import React, { useMemo } from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm"
import { usePx } from "../../../../shared/interfaces/hooks/usePx";
import { BackpackItem } from "./backpack-item/BackpackItem";
import { UBUNTU } from "@common/shared/Fonts"
import { BackpackController } from "@common/client/controllers/Backpack.controller";
import { backpackHotbarItemsSelector, backpackOpenedSelector } from "@common/client/states/Backpack.atom";

interface HotbarProps {
    backpackController: BackpackController;
    Position: UDim2;
    AnchorPoint: Vector2;
    itemSize: number;
    itemPadding: number;
}

export function Hotbar({ backpackController, Position, AnchorPoint, itemSize, itemPadding }: HotbarProps) {
    const px = usePx();
    const hotbarItems = useAtom(backpackHotbarItemsSelector);
    const isBackpackOpened = useAtom(backpackOpenedSelector);
    const hotbarWithSize = useMemo(() => {
        const effectiveItemsCount = isBackpackOpened ? hotbarItems.size() : hotbarItems.filter(item => item !== "empty").size();
        return effectiveItemsCount * itemSize + itemPadding * (effectiveItemsCount - 1);
    }, [hotbarItems, isBackpackOpened]);

    const createItems = () => {
        const items: JSX.Element[] = [];

        for (let realIndex = 0; realIndex < hotbarItems.size(); realIndex++) {
            const item = hotbarItems[realIndex];
            const positionIndex = items.size()
            const key = backpackController.getHotbarKey(realIndex);
            if (!key) continue;
            if (!isBackpackOpened && item === "empty") continue;
            const position = new UDim2(0, (itemSize + itemPadding) * positionIndex, 0, 0);

            items.push(
                <BackpackItem
                    index={realIndex}
                    backpackItem={item !== "empty" ? item : undefined}
                    Size={new UDim2(0, itemSize, 0, itemSize)}
                    Position={position}
                    context="hotbar"
                    backpackController={backpackController}
                    uuid={item !== "empty" ? item.uuid : ""}
                >
                    <textlabel 
                        Size={new UDim2(0.3, 0, 0.3, 0)}
                        TextScaled={true}
                        TextColor3={new Color3(1, 1, 1)}
                        BackgroundTransparency={1}
                        BorderSizePixel={0}
                        FontFace={UBUNTU}
                        Position={new UDim2(0, px(4), 0, px(2))}
                        AnchorPoint={new Vector2(0, 0)}
                        Text={`${key.icon}`}
                    />
                </BackpackItem>
            )
        }

        return items;
    }

    return (
        <frame
            key={"hotbar"}
            Position={Position}
            AnchorPoint={AnchorPoint}
            Size={new UDim2(0, hotbarWithSize, 0, itemSize)}
            BackgroundTransparency={1}
            ZIndex={1}
        >
            {createItems()}
        </frame>
    )
}
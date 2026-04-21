import React from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { BackpackScrollingFrame } from "./BackpackScrollingFrame"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { BackpackSearchBar } from "./BackpackSearchBar"
import { CloseButton } from "./CloseButton"
import Object from "@rbxts/object-utils"
import { UBUNTU } from "@common/shared/Fonts"
import { BackpackController } from "@common/client/controllers/Backpack.controller"
import { backpackHotbarItemsSelector, backpackItemsSelector, backpackOpenedSelector } from "@common/client/states/Backpack.atom"

interface BackpackInventoryProps {
    backpackController: BackpackController;
    Position: UDim2;
    AnchorPoint: Vector2;
    itemSize: number;
    itemPadding: number;
}

export function BackpackInventory({ backpackController, Position, AnchorPoint, itemSize, itemPadding }: BackpackInventoryProps) {
    const px = usePx();
    const isBackpackOpened = useAtom(backpackOpenedSelector);

    const backpackItems = useAtom(backpackItemsSelector);
    const hotbarItems = useAtom(backpackHotbarItemsSelector);

    return isBackpackOpened && (
        <frame
            key={"inventory"}
            Position={Position}
            AnchorPoint={AnchorPoint}
            Size={new UDim2(0, backpackController.hotbarItemsCount * itemSize + (backpackController.hotbarItemsCount - 1) * itemPadding + px(20), 0, px(500))}
            BackgroundColor3={Color3.fromHex("#283035")}
            BackgroundTransparency={0.5}
            BorderSizePixel={0}
            ZIndex={0}
        >
            <uicorner CornerRadius={new UDim(0.03, 0)} />
            <BackpackSearchBar />
            <CloseButton />
            <BackpackScrollingFrame
                backpackController={backpackController}
                itemSize={itemSize}
                itemPadding={itemPadding}
            />
            <textlabel 
                Size={new UDim2(1, 0, 0.1, 0)}
                Position={new UDim2(0.02, 0, 0.02, 0)}
                AnchorPoint={new Vector2(0, 0)}
                Text={`Capacity : ${backpackItems.size() + hotbarItems.filter(item => item !== "empty").size()}/${backpackController.getBackpackItemsLimit()}`}
                TextScaled={true}
                FontFace={UBUNTU}
                TextColor3={Color3.fromHex("#FFFFFF")}
                BackgroundTransparency={1}
                TextXAlignment={Enum.TextXAlignment.Left}
            >   
                <uistroke Thickness={px(5)} Color={new Color3(0, 0, 0)} Transparency={0} />
            </textlabel>
        </frame>
    )
}
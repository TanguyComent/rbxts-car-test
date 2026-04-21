import React, { useCallback } from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { BackpackItem } from "../backpack-item/BackpackItem"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { BackpackController } from "@common/client/controllers/Backpack.controller";
import { backpackItemsSelector, backpackSearchbarTextSelector } from "@common/client/states/Backpack.atom";

interface BackpackScrollingFrameProps {
    backpackController: BackpackController;
    itemSize: number;
    itemPadding: number;
}

export function BackpackScrollingFrame({ backpackController, itemSize, itemPadding }: BackpackScrollingFrameProps) {
    const backpackItems = useAtom(backpackItemsSelector);
    const rowCount = math.ceil(backpackItems.size() / backpackController.hotbarItemsCount);
    const searchbarText = useAtom(backpackSearchbarTextSelector);
    const px = usePx();
    const getItems = useCallback(() => {
        const items: JSX.Element[] = [];
        const filteredItems = backpackItems.filter((backpackItems) => {
            if (!searchbarText) return true;
            return backpackItems.tool.Name.lower().find(searchbarText.lower(), 0, true).size() > 0;
        })

        for (let index = 0; index < filteredItems.size(); index++) {
            const backpackItem = filteredItems[index];
            const row = math.floor(index / backpackController.hotbarItemsCount);
            const column = index % backpackController.hotbarItemsCount;
            const position = new UDim2(0, column * itemSize + (column) * itemPadding, 0, row * itemSize + (row) * itemPadding);
``
            items.push(
                <BackpackItem 
                    index={index}
                    backpackItem={backpackItem}
                    Position={position}
                    context="inventory"
                    backpackController={backpackController}
                    Size={new UDim2(0, itemSize, 0, itemSize)}
                    uuid={backpackItem.uuid}
                />
            )
        }

        return items;
    }, [backpackItems, backpackController, itemSize, itemPadding, searchbarText]);
    
    return (
        <scrollingframe
            key={"backpack-scrolling-frame"}
            Size={new UDim2(1, px(30), 0.7, px(20))}
            Position={new UDim2(0, 0, 0.95, -px(10))}
            AnchorPoint={new Vector2(0, 1)}
            BorderSizePixel={0}
            BackgroundTransparency={1}
            ScrollBarThickness={px(15)}
            CanvasSize={new UDim2(1, 0, 0, rowCount * itemSize + (rowCount - 1) * itemPadding + px(20))}
            ScrollingDirection={Enum.ScrollingDirection.Y}
            ClipsDescendants={true}
        >
            <uipadding 
                PaddingTop={new UDim(0, px(10))}
                PaddingLeft={new UDim(0, px(10))}
                PaddingRight={new UDim(0, px(10))}
                PaddingBottom={new UDim(0, px(10))}
            />
            {getItems()}
        </scrollingframe>
    )
}
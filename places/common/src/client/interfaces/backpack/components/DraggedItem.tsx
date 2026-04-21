import React, { useMemo } from "@rbxts/react"
import { useAtom } from "@rbxts/react-charm"
import { VisualItem } from "./backpack-item/VisualItem"
import { backpackDragInformationsSelector, backpackEquippedItemSelector } from "@common/client/states/Backpack.atom";

interface DraggedItemProps {
    itemSize: number;
}

export function DraggedItem({ itemSize }: DraggedItemProps) {
    const dragInformations = useAtom(backpackDragInformationsSelector);
    const position = useMemo(() => {
        if (!dragInformations) return new UDim2();

        return new UDim2(
            dragInformations.dragOffset.X.Scale,
            dragInformations.dragInitialPosition.X + dragInformations.dragOffset.X.Offset,
            dragInformations.dragOffset.Y.Scale,
            dragInformations.dragInitialPosition.Y + dragInformations.dragOffset.Y.Offset,
        )
    }, [dragInformations]);
    const equippedItem = useAtom(backpackEquippedItemSelector);
    const isEquipped = useMemo(() => {
        return dragInformations ? dragInformations.item.tool === equippedItem?.tool : false;
    }, [dragInformations, equippedItem]);

    return dragInformations && (
        <imagebutton
            key={"drag-overlay"}
            Position={position}
            Size={new UDim2(0, itemSize, 0, itemSize)}
            BackgroundTransparency={1}
            BorderSizePixel={0}
        >
            <VisualItem
                backpackItem={dragInformations.item}
                isHovered={true}
                isEquipped={isEquipped}
                backpackOpened={true}
                Size={new UDim2(1, 0, 1, 0)}
            >
                {dragInformations.draggedItemChildren}
            </VisualItem>
        </imagebutton>
    )
}
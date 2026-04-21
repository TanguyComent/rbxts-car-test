import React from "@rbxts/react"
import { Hotbar } from "./Hotbar"
import { usePx } from "../../../../shared/interfaces/hooks/usePx"
import { BackpackInventory } from "./backpack-inventory/BackpackInventory"
import { UserInputService } from "@rbxts/services"
import { DraggedItem } from "./DraggedItem"
import { HoverLayer } from "./backpack-item/HoverLayer"
import { BackpackController } from "@common/client/controllers/Backpack.controller"

interface AppProps {
    backpackController: BackpackController;
}

export function App({ backpackController }: AppProps) {
    const px = usePx();
    const itemPadding = UserInputService.TouchEnabled ? px(22.5) : px(15);
    const itemSize = UserInputService.TouchEnabled ? px(170) : px(130);

    return (
        <>
            <BackpackInventory 
                backpackController={backpackController}
                Position={new UDim2(0.5, 0, 1, -px(70) - itemSize)}
                AnchorPoint={new Vector2(0.5, 1)}
                itemSize={itemSize}
                itemPadding={itemPadding}
            />
            <Hotbar
                backpackController={backpackController}
                Position={new UDim2(0.5, 0, 1, -px(50))}
                AnchorPoint={new Vector2(0.5, 1)}
                itemSize={itemSize}
                itemPadding={itemPadding}
            />
            <DraggedItem 
                itemSize={itemSize}
            />
            <HoverLayer />
        </>
    )
}
import { BackpackAtom } from "@common/client/states/Backpack.atom"
import { CROSS_ICON_WHITE } from "@common/shared/Assets"
import React from "@rbxts/react"

interface CloseButtonProps {
}

export function CloseButton({  }: CloseButtonProps) {
    return (
        <imagebutton 
            key={"backpack-close-button"}
            Size={new UDim2(0.1, 0, 0.13, 0)}
            Position={new UDim2(0.98, 0, 0.02, 0)}
            BackgroundTransparency={1}
            AnchorPoint={new Vector2(1, 0)}
            Image={CROSS_ICON_WHITE}

            Event={{
                Activated: () => {
                    BackpackAtom((old) => {
                        return {
                            ...old,
                            isOpened: false,
                        }
                    })
                }
            }}
        >
            <uiaspectratioconstraint AspectRatio={1} />
        </imagebutton>
    )
}
import { BackpackAtom } from "@common/client/states/Backpack.atom";
import { UBUNTU } from "@common/shared/Fonts"
import { usePx } from "@common/shared/interfaces/hooks/usePx"
import React from "@rbxts/react"

export function BackpackSearchBar() {
    const px = usePx();
    const textboxRef = React.useRef<TextBox>();

    React.useEffect(() => {
        if (!textboxRef.current) return
        const connection = textboxRef.current.GetPropertyChangedSignal("Text").Connect(() => {
            
            BackpackAtom((old) => {
                return {
                    ...old,
                    searchbarText: textboxRef.current ? textboxRef.current.Text !== "" ? textboxRef.current.Text : undefined : undefined,
                }
            })
        })

        return () => connection.Disconnect();
    }, [textboxRef.current])

    return (
        <textbox
            ref={textboxRef}
            key={"backpack-search-bar"}
            FontFace={UBUNTU}
            Size={new UDim2(0.3, 0, 0.13, 0)}
            Position={new UDim2(0.92, 0, 0.02, 0)}
            AnchorPoint={new Vector2(1, 0)}
            BackgroundColor3={new Color3(1, 1, 1)}
            TextColor3={new Color3(1, 1, 1)}
            BackgroundTransparency={0.5}
            TextTransparency={0}
            PlaceholderText={"Search"}
            PlaceholderColor3={new Color3(1, 1, 1)}
            Text={""}
            TextScaled={true}
            BorderSizePixel={0}
            TextXAlignment={Enum.TextXAlignment.Left}
        >
            <uicorner 
                CornerRadius={new UDim(0.2, 0)}
            />
            <uipadding 
                PaddingLeft={new UDim(0, px(10))}
            />
        </textbox>
    )
}
import { BackpackAtom, backpackDragContextSelector, backpackHoveredItemSelector, backpackOpenedSelector, backpackSearchbarTextSelector } from "@common/client/states/Backpack.atom";
import { BUBBLE_TAIL } from "@common/shared/Assets"
import { UBUNTU } from "@common/shared/Fonts";
import { usePx } from "@common/shared/interfaces/hooks/usePx";
import React from "@rbxts/react";
import { useAtom } from "@rbxts/react-charm"
import { GuiService, RunService } from "@rbxts/services"

export function HoverLayer() {
    const px = usePx();
    const hoveredItem = useAtom(backpackHoveredItemSelector);
    const frameRef = React.useRef<Frame>(undefined);
    const dragContext = useAtom(backpackDragContextSelector);
    const backpackOpened = useAtom(backpackOpenedSelector);
    const research = useAtom(backpackSearchbarTextSelector)

    React.useEffect(() => {
        if (hoveredItem && hoveredItem.instance.Parent === undefined) {
            /// The hovered item was in the inventory but the inventory just closed
            BackpackAtom((old) => {
                return {
                    ...old,
                    hoveredItem: undefined,
                }
            })
        }
    }, [backpackOpened, hoveredItem, research])

    React.useEffect(() => {
        if (!hoveredItem || !frameRef.current) return;
        
        const guiInset = GuiService.GetGuiInset()[0]
        const runServiceConnection = RunService.RenderStepped.Connect(() => {
            if (!frameRef.current) return

            const hoveredInstanceAbsolutePosition = hoveredItem.instance.AbsolutePosition;
            const absoluteSize = hoveredItem.instance.AbsoluteSize;
            frameRef.current.Position = UDim2.fromOffset(
                hoveredInstanceAbsolutePosition.X + guiInset.X + absoluteSize.X / 2,
                hoveredInstanceAbsolutePosition.Y + guiInset.Y + px(20)
            );
        })

        return () => {
            runServiceConnection.Disconnect();
        }
    }, [hoveredItem, frameRef.current]);

    return hoveredItem !== undefined && dragContext === undefined && (
        <frame
            ref={frameRef}
            ZIndex={15}
            key={'hover-layer'}
            AnchorPoint={new Vector2(0.5, 1)}
            AutomaticSize={Enum.AutomaticSize.XY}
            BackgroundTransparency={1}
        >
            <uilistlayout 
                FillDirection={Enum.FillDirection.Vertical}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />
            <frame 
                BackgroundColor3={new Color3(1, 1, 1)}
                AutomaticSize={Enum.AutomaticSize.XY}
            >
                <uicorner CornerRadius={new UDim(0.2, 0)} />
                <textlabel 
                    AutomaticSize={Enum.AutomaticSize.XY}
                    TextSize={px(50)}
                    FontFace={UBUNTU}
                    Text={hoveredItem.item.tool.Name}
                    BackgroundTransparency={1}
                    TextColor3={new Color3(0.23, 0.22, 0.22)}
                />
                <uipadding 
                    PaddingTop={new UDim(0, px(8))}
                    PaddingBottom={new UDim(0, px(8))}
                    PaddingLeft={new UDim(0, px(15))}
                    PaddingRight={new UDim(0, px(15))}
                />
            </frame>
            <imagelabel 
                Image={BUBBLE_TAIL}
                Size={new UDim2(0, px(30), 0, px(30))}
                Position={new UDim2(0.5, 0, 1, px(30))}
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundTransparency={1}
            />
        </frame>
    )
}
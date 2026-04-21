import React from "@rbxts/react"
import { usePx } from "../hooks/usePx"
import { CLOSE_ICON } from "@common/shared/Assets"
import { TweenService } from "@rbxts/services"
import { deepCopy } from "@rbxts/object-utils"

interface CloseButtonProps extends React.InstanceProps<TextButton> {
    borderSizeOffset?: number;
}

export function CloseButton(props: CloseButtonProps) {
    const propsClone = deepCopy(props);
    const ref = React.useRef<TextButton>();
    const px = usePx();
    delete propsClone.Text;

    const borderSizeOffset = propsClone.borderSizeOffset ?? 5;
    delete propsClone.borderSizeOffset;

    const [isHovered, setIsHovered] = React.useState(false);
    const mouseEnter = propsClone.Event?.MouseEnter;
    const mouseLeave = propsClone.Event?.MouseLeave;

    delete propsClone.Event?.MouseEnter;
    delete propsClone.Event?.MouseLeave;
    delete propsClone.ref;

    const rotateTo = (angle: number) => {
        if (!ref.current) return;
        const tween = TweenService.Create(
            ref.current,
            new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            { Rotation: angle }
        );
        tween.Play()
    }

    React.useEffect(() => {
        if (isHovered) {
            rotateTo(5);
        } else {
            rotateTo(0);
        }
    }, [isHovered]);

    return (
        <textbutton
            {...propsClone}
            ref={ref}
            BackgroundColor3={new Color3(0, 0, 0)}
            BorderSizePixel={0}
            Text={""}
            AutoButtonColor={false}

            Event={{
                ...propsClone.Event,
                MouseEnter: (rbx, x, y) => {
                    setIsHovered(true);
                    mouseEnter?.(rbx, x, y);
                },
                MouseLeave: (rbx, x, y) => {
                    setIsHovered(false);
                    mouseLeave?.(rbx, x, y);
                }
            }}
        >
            <frame
                key={"close-button-red-gradient-box"}
                Size={new UDim2(1, -borderSizeOffset, 1, -borderSizeOffset)}
                BackgroundColor3={new Color3(1, 1, 1)}
                Position={UDim2.fromScale(0.5, 0.5)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                BorderSizePixel={0}
            >
                <uigradient 
                    Color={new ColorSequence(Color3.fromRGB(240, 0, 4), Color3.fromRGB(240, 234, 234))}
                    Rotation={-90}
                />
                <frame  
                    Size={new UDim2(1, -borderSizeOffset, 1, -borderSizeOffset)}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundColor3={Color3.fromRGB(240, 0, 4)}
                    BorderSizePixel={0}
                >
                    <imagelabel 
                        key={"close-button-icon"}
                        Size={UDim2.fromScale(0.8, 0.8)}
                        Position={UDim2.fromScale(0.5, 0.5)}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        BackgroundTransparency={1}
                        Image={CLOSE_ICON}
                        BorderSizePixel={0}
                    />
                </frame>
            </frame>
            <uiaspectratioconstraint AspectRatio={1} />
        </textbutton>
    )
}
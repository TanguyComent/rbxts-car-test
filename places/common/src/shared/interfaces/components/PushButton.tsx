import React, { useCallback, useRef } from "@rbxts/react";
import { TweenService } from "@rbxts/services";
import { usePx } from "../hooks/usePx";
import { deepCopy } from "@rbxts/object-utils";

interface PushButtonProps extends React.InstanceProps<TextButton> {
    borderColor?: Color3;
    backgroundColor?: Color3;
    aspectRatio?: number;
}

export function PushButton(props: PushButtonProps) {
    const px = usePx();
    const propsCopy = deepCopy(props);
    const uiScaleRef = useRef<UIScale>(undefined);

    const scaleTo = useCallback((targetScale: number, duration: number) => {
        if (!uiScaleRef.current) return;
        const tweenInfo = new TweenInfo(duration, Enum.EasingStyle.Linear, Enum.EasingDirection.Out, 0, false, 0);
        const tween = TweenService.Create(uiScaleRef.current, tweenInfo, { Scale: targetScale });
        tween.Play();
    }, [uiScaleRef.current]);
    
    const children = propsCopy.children;
    delete propsCopy.children;

    const backgroundColor = propsCopy.backgroundColor;
    delete propsCopy.backgroundColor;

    const borderColor = propsCopy.borderColor;;
    delete propsCopy.borderColor;

    const aspectRatio = propsCopy.aspectRatio;
    delete propsCopy.aspectRatio;
    
    delete propsCopy.Event?.MouseEnter;
    delete propsCopy.Event?.MouseLeave;
    delete propsCopy.Event?.MouseButton1Down;
    delete propsCopy.Event?.MouseButton1Up;

    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    React.useEffect(() => {
        if (isPressed) {
            scaleTo(0.9, 0.1);
        } else if (isHovered) {
            scaleTo(1.1, 0.1);
        } else {
            scaleTo(1, 0.1);
        }
    }, [isHovered, isPressed]);

    return (
        <textbutton
            {...propsCopy}
            BackgroundColor3={borderColor}
            AutoButtonColor={false}
            Event={{
                ...propsCopy.Event,
                MouseEnter: (rbx, x, y) => {
                    setIsHovered(true);
                },
                MouseLeave: (rbx, x, y) => {
                    setIsHovered(false);
                },

                MouseButton1Down: (rbx, x, y) => {
                    setIsPressed(true);
                },
                MouseButton1Up: (rbx, x, y) => {
                    setIsPressed(false);
                },
            }}
        >
            <uiscale Scale={1} ref={uiScaleRef} />
            <uicorner CornerRadius={new UDim(0, px(25))} />
            {aspectRatio !== undefined && <uiaspectratioconstraint AspectRatio={aspectRatio} />}
            <frame
                Size={new UDim2(1, -px(20), 1, -px(30))}
                Position={new UDim2(0.5, 0, 0, px(10))}
                AnchorPoint={new Vector2(0.5, 0)}
                BackgroundColor3={backgroundColor}
            >
                <uicorner CornerRadius={new UDim(0, px(16))} />
                <frame 
                    key={"effect"}
                    Size={new UDim2(0.9, 0, 0.5, 0)}
                    Position={new UDim2(0.5, 0, 0, px(5))}
                    AnchorPoint={new Vector2(0.5, 0)}
                    BackgroundColor3={new Color3(1, 1, 1)}
                    BackgroundTransparency={0.7}
                    BorderSizePixel={0}
                >
                    <uicorner CornerRadius={new UDim(0, px(16))} />
                </frame>
                {children}
            </frame>
        </textbutton>
    )
}
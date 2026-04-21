import { UBUNTU } from "@common/shared/Fonts";
import { AnimatedFrame } from "@common/shared/interfaces/components/AnimatedFrame";
import { usePx } from "@common/shared/interfaces/hooks/usePx";
import React from "@rbxts/react";

export interface MessageStyle {
    textColor?: Color3;
    textGradient?: ColorSequence;
    textGradientRotation?: number;

    strokeSize?: number;
    strokeColor?: Color3;
    text: string;
}

interface MessageProps extends MessageStyle {
    index: number;
}

export function Message({ textColor, textGradient, textGradientRotation, text, strokeSize, strokeColor, index }: MessageProps) {
    const px = usePx();

    return (
        <AnimatedFrame
            Size={new UDim2(1, 0, 0, px(50))}
            AnchorPoint={new Vector2(0.5, 0.5)}
            AutomaticSize={Enum.AutomaticSize.Y}
            BackgroundTransparency={1}
            LayoutOrder={-index}
        >
            <textlabel 
                Size={UDim2.fromScale(1, 1)}
                BackgroundTransparency={1}
                TextColor3={textColor ?? new Color3(1, 1, 1)}
                TextScaled={true}
                RichText={true}
                FontFace={UBUNTU}
                Text={text}
            >
                {textGradient && <uigradient Color={textGradient} Rotation={textGradientRotation} />}
                {strokeSize !== undefined && <uistroke Color={strokeColor ?? new Color3(0, 0, 0)} Thickness={px(strokeSize)} />}
            </textlabel>
        </AnimatedFrame>
    )
}
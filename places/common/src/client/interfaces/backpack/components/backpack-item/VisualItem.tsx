import { usePx } from "@common/shared/interfaces/hooks/usePx"
import { peek } from "@rbxts/charm";
import React, { useMemo } from "@rbxts/react"
import { TweenService } from "@rbxts/services"
import { IBackpackItem } from "@common/client/states/Backpack.atom";

interface VisualItemProps {
    isHovered: boolean;
    isEquipped: boolean;
    backpackOpened: boolean;
    backpackItem?: IBackpackItem;

    Size?: UDim2;
    Position?: UDim2;
    AnchorPoint?: Vector2;
    children?: React.ReactNode;
}

export function VisualItem({ backpackItem, isHovered, isEquipped, backpackOpened, Position, Size, AnchorPoint, children }: VisualItemProps) {
    const frameRef = React.useRef<Frame>(undefined);
    const px = usePx();

    React.useEffect(() => {
        if (!frameRef.current) return;
        const targetColor = isHovered ? Color3.fromHex("#3b484f") : Color3.fromHex("#283035");

        const tween = TweenService.Create(
            frameRef.current,
            new TweenInfo(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            { BackgroundColor3: targetColor },
        )

        tween.Play();

        return () => tween.Pause();
    }, [isHovered, frameRef.current]);

    return(
        <frame
            ref={frameRef}
            Position={Position}
            Size={Size}
            AnchorPoint={AnchorPoint}
            BackgroundTransparency={backpackOpened ? 0 : 0.3}
            BackgroundColor3={Color3.fromHex("#283035")}
            BorderSizePixel={0}
            Active={false}
            Selectable={false}
        >
            <uicorner CornerRadius={new UDim(0.15, 0)} />
            {isEquipped && (
                <uistroke 
                    Color={Color3.fromHex("#17e0ff")}
                    Thickness={px(5)}
                    ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
                    BorderStrokePosition={Enum.BorderStrokePosition.Outer}
                />
            )}
            {backpackItem && (
                <imagelabel 
                    Image={backpackItem.tool.TextureId}
                    Size={new UDim2(0.8, 0, 0.8, 0)}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    BackgroundTransparency={1}
                    ZIndex={1}
                />
            )}
            {children}
        </frame>
    )
}
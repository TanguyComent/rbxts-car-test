import React from "@rbxts/react";
import { EmptyHoverEffect } from "../empty/EmptyHoverEffect";

interface HoverEffectProps {
    hoveredScale?: number;
    enabled?: boolean;
    tweenInfo?: TweenInfo;
}

/**
 * Parent must be a gui object, otherwise, the effect will be inactive
 */
export function HoverScaleEffect({ hoveredScale = 1.1, enabled = true, tweenInfo }: HoverEffectProps) {
    return (
        <EmptyHoverEffect
            enabled={enabled}
            hoverStart={(context, parent, key) => {
                context.getScaleApi(parent).register(key, hoveredScale, tweenInfo);
            }}
            hoverEnd={(context, parent, key) => {
                context.getScaleApi(parent).unregister(key, tweenInfo);
            }}
        />
    )
}
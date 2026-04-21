import React from "@rbxts/react";
import { EmptyHoverEffect } from "../empty/EmptyHoverEffect";

interface HoverRotationEffectProps {
    rotation?: number;
    tweenInfo?: TweenInfo;
    enabled?: boolean;
}

export function HoverRotationEffect({ rotation = 20, tweenInfo, enabled }: HoverRotationEffectProps) {
    return (
        <EmptyHoverEffect 
            enabled={enabled}
            hoverStart={(context, parent, key) => {
                context.getRotationApi(parent).register(key, rotation, tweenInfo)
            }}
            hoverEnd={(context, parent, key) => {
                context.getRotationApi(parent).unregister(key, tweenInfo)
            }}
        />
    )
}
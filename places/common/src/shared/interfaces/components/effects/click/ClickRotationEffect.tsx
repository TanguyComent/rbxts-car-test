import React from "@rbxts/react";
import { EmptyClickEffect } from "../empty/EmptyClickEffect";

interface ClickEffectProps {
    enabled?: boolean;
    rotation?: number;
    tweenInfo?: TweenInfo;
}

export function ClickRotationEffect({ enabled = true, rotation = 15, tweenInfo }: ClickEffectProps) {
    return (
        <EmptyClickEffect 
            enabled={enabled}
            onMouseDown={(context, parent, key) => {
                context.getRotationApi(parent).register(key, rotation, tweenInfo);  
            }}
            onMouseUp={(context, parent, key) => {
                context.getRotationApi(parent).unregister(key, tweenInfo);
            }}
        />
    )
}
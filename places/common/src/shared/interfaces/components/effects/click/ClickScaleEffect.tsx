import React from "@rbxts/react";
import { EmptyClickEffect } from "../empty/EmptyClickEffect";

interface ClickEffectProps {
    clickedScale?: number;
    enabled?: boolean;
}

/**
 * Parent must be a gui button, otherwise, the effect will be inactive
 */
export function ClickScaleEffect({ clickedScale = 0.8, enabled = true }: ClickEffectProps) {    
    return (
        <EmptyClickEffect 
            enabled={enabled}
            onMouseDown={(context, parent, key) => {
                context.getScaleApi(parent).register(key, clickedScale);
            }}
            onMouseUp={(context, parent, key) => {
                context.getScaleApi(parent).unregister(key);
            }}
        />
    )
}
import React from "@rbxts/react";
import { EmptyHoverEffect } from "../empty/EmptyHoverEffect";

interface HoverPanelEffectProps extends React.InstanceProps<Frame> {
    
}

export function HoverPanelEffect(props: HoverPanelEffectProps) {
    return (
        <EmptyHoverEffect
            hoverStart={(effectsContext, _, key) => {
                effectsContext.mousePanelApi?.setMountedTree(key, props);
            }}

            hoverEnd={(effectsContext, _, key) => {
                effectsContext.mousePanelApi?.clearMountedTree(key);
            }}
        />            
    )
}
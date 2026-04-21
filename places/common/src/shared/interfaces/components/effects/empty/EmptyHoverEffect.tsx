import React from "@rbxts/react";
import { EffectsContext, EffectsContextValue } from "../../context/EffectsContext";
import { EmptyParentGetter } from "./EmptyParentGetter";
import { GenerateUUID } from "@common/shared/utils/GenerateUUID.utils";

interface EmptyHoverEffectProps {
    enabled?: boolean;

    hoverStart?: (effectsContext: EffectsContextValue, parent: GuiObject, effectKey: string) => void;
    hoverEnd?: (effectsContext: EffectsContextValue, parent: GuiObject, effectKey: string) => void;
}

/* Effect without any visual changes, can be used to create new effects */
export function EmptyHoverEffect({ enabled = true, hoverStart, hoverEnd }: EmptyHoverEffectProps) {
    const context = React.useContext(EffectsContext)

    if (!context) throw "An effect is rendered without the effects context"

    return (
        <EmptyParentGetter 
            enabled={enabled}
            parentClassName="GuiObject"
            onReady={(parent, janitor) => {
                const effectKey = GenerateUUID.generateHexSegment();
                const mouseEnterConnection = parent.MouseEnter.Connect(() => hoverStart?.(context, parent, effectKey))
                janitor.Add(mouseEnterConnection);

                const mouseLeaveConnection = parent.MouseLeave.Connect(() => hoverEnd?.(context, parent, effectKey))
                janitor.Add(mouseLeaveConnection);

                janitor.Add(() => hoverEnd?.(context, parent, effectKey))
            }}
        />
    )
}
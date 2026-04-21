import React from "@rbxts/react";
import { EmptyParentGetter } from "./EmptyParentGetter";
import { EffectsContext, EffectsContextValue } from "../../context/EffectsContext";
import { GenerateUUID } from "@common/shared/utils/GenerateUUID.utils";

interface EmptyClickEffectProps {
    enabled?: boolean;

    onMouseDown?: (context: EffectsContextValue, parent: GuiButton, effectKey: string) => void;
    onMouseUp?: (context: EffectsContextValue, parent: GuiButton, effectKey: string) => void;
}

/* Effect without any visual changes, can be used to create new effects */
export function EmptyClickEffect({ enabled = true, onMouseDown, onMouseUp }: EmptyClickEffectProps) {
    const context = React.useContext(EffectsContext)

    if (!context) throw "An effect is rendered without the effects context"

    return (
        <EmptyParentGetter 
            enabled={enabled}
            parentClassName="GuiButton"
            onReady={(parent, janitor) => {
                const effectKey = GenerateUUID.generateHexSegment();
                const mouseDownConnection = parent.MouseButton1Down.Connect(() => onMouseDown?.(context, parent, effectKey))
                janitor.Add(mouseDownConnection)
                
                const mouseUpConnection = parent.MouseButton1Up.Connect(() => onMouseUp?.(context, parent, effectKey))
                janitor.Add(mouseUpConnection)

                const hoverEndedConnection = parent.MouseLeave.Connect(() => onMouseUp?.(context, parent, effectKey))
                janitor.Add(hoverEndedConnection)

                janitor.Add(() => onMouseUp?.(context, parent, effectKey))
            }}
        />
    )
}
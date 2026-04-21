import React from "@rbxts/react";
import { EmptyParentGetter } from "../empty/EmptyParentGetter";
import { TweenService } from "@rbxts/services";

interface PersistentMovementEffectProps {
    minOffset: UDim2;
    maxOffset: UDim2;
    pauseDuration?: number;
    tweenInfo?: TweenInfo;
    enabled?: boolean;
}

export function PersistentMovementEffect({ minOffset, maxOffset, tweenInfo, enabled = true, pauseDuration = 0 }: PersistentMovementEffectProps) {
    const [initialPosition, setInitialPosition] = React.useState<UDim2 | undefined>(undefined);

    return (
        <EmptyParentGetter
            enabled={enabled}
            parentClassName="GuiObject"
            onReady={(parent, janitor) => {
                if (!initialPosition) {
                    setInitialPosition(parent.Position);
                }

                const targetPosition1 = (initialPosition ?? parent.Position).add(minOffset);
                const targetPosition2 = (initialPosition ?? parent.Position).add(maxOffset);
                tweenInfo = tweenInfo || new TweenInfo(0.5, Enum.EasingStyle.Linear, Enum.EasingDirection.In);

                let tweenToTarget1: Tween = TweenService.Create(parent, tweenInfo, { Position: targetPosition1 });
                let tweenToTarget2: Tween = TweenService.Create(parent, tweenInfo, { Position: targetPosition2 });
                
                const tween1FinishedConnection = tweenToTarget1.Completed.Connect(() => {
                    task.wait(pauseDuration);
                    tweenToTarget2?.Play() /// Could have been destroyed
                });
                const tween2FinishedConnection = tweenToTarget2.Completed.Connect(() => {
                    task.wait(pauseDuration);
                    tweenToTarget1?.Play()
                });

                janitor.Add(() => {
                    tween1FinishedConnection.Disconnect();
                    tween2FinishedConnection.Disconnect();

                    tweenToTarget1.Cancel();
                    tweenToTarget2.Cancel();

                    tweenToTarget1.Destroy();
                    tweenToTarget2.Destroy();
                })

                tweenToTarget1.Play();
            }}
        />
    )
}
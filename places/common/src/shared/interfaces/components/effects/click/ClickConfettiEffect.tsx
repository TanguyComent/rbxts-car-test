import React from "@rbxts/react";
import { Janitor } from "@rbxts/janitor";
import { ConfettiesBornes, ConfettiesManager, IConfettiManager } from "@common/shared/interfaces/components/ConfettiEffect";
import { usePx } from "@common/shared/interfaces/hooks/usePx";
import { CONFETTO_STAR } from "@common/shared/Assets";

interface ClickConfettiEffectProps {
    amount?: number;
    settings?: ConfettiesBornes;
    enabled?: boolean;
}

export function ClickConfettiEffect({ amount = 10, settings, enabled = true }: ClickConfettiEffectProps) {
    const px = usePx();
    const folderRef = React.useRef<Folder>(undefined);
    const [confettiManager, setConfettiesManager] = React.useState<IConfettiManager>();

    settings = settings ?? {
        size: { min: px(30), max: px(50) },
        colors: [
            new Color3(0.97, 1, 0.5),
            new Color3(1, 1, 0),
        ],
        rotationSpeed: { min: 100, max: 200 },
        speed: { min: 0.01, max: 0.01 },
        delay: { min: 0, max: 0 },
        shapes: [CONFETTO_STAR],
        gravityEnabled: true,
        startScalePosition: {
            min: new Vector2(0.5, 0.5),
            max: new Vector2(0.5, 0.5),
        },
        direction: {
            min: new Vector2(-0.03, 1.2),
            max: new Vector2(0.03, 1.8),
        },
        throwForce: {
            min: new Vector2(-0.7, -3.8),
            max: new Vector2(0.7, -3.3),
        },
        zindex: 10,
    }

    React.useEffect(() => {
        if (!enabled) return;
        if (!folderRef.current?.Parent || !folderRef.current.Parent.IsA("GuiButton")) return;
        if (!confettiManager) return;

        const effectJanior = new Janitor();
        const activatedConnection = folderRef.current.Parent.Activated.Connect(() => {
            confettiManager.launchRandomConfetties(amount, settings);
        })
        effectJanior.Add(activatedConnection);

        return () => {
            effectJanior.Destroy();
        }
    }, [confettiManager, folderRef.current, enabled]);

    return (
        <>
            <folder ref={folderRef} />
            <ConfettiesManager
                onReady={(manager) => {
                    setConfettiesManager(manager);
                }}
            />
        </>
    )
}
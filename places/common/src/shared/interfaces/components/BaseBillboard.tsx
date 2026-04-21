import React, { StrictMode } from "@rbxts/react";
import ReactRoblox, { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { EffectsProvider } from "./context/EffectsContext";

export abstract class BaseBillboard {
    protected billboardGui: BillboardGui;
    protected root: ReactRoblox.Root;

    constructor(
        adornee: PVInstance,
        billboardGuiName: string,
    ) {
        const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
        this.billboardGui = new Instance("BillboardGui");
        this.billboardGui.Name = billboardGuiName;
        this.billboardGui.Parent = playerGui;
        this.billboardGui.AlwaysOnTop = true;
        this.billboardGui.Adornee = adornee;
        this.billboardGui.Active = true;

        this.root = createRoot(this.billboardGui);
    }

    protected render(app: React.ReactNode) {
        this.root.unmount();
        this.root.render(
            <StrictMode>
                <EffectsProvider container={this.billboardGui}>
                    {createPortal(app, this.billboardGui)}
                </EffectsProvider>
            </StrictMode>
        );
    }
    
    public destroy() {
        this.root.unmount();
        this.billboardGui.Destroy();
    }
}
import React, { StrictMode } from "@rbxts/react"
import { createRoot, createPortal } from "@rbxts/react-roblox"
import { Players } from "@rbxts/services"
import { App } from "./components/App"
import { BackpackController } from "@common/client/controllers/Backpack.controller";

const player = Players.LocalPlayer;
let root: ReturnType<typeof createRoot> | undefined;
let screenGui: ScreenGui | undefined;

export function createBackpack(backpackController: BackpackController) {
    if (root) return;
    const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

    screenGui = new Instance("ScreenGui");
    screenGui.Name = "Backpack";
    screenGui.Parent = playerGui;
    screenGui.ResetOnSpawn = false;
    screenGui.IgnoreGuiInset = true;
    screenGui.AutoLocalize = true;
    screenGui.ScreenInsets = Enum.ScreenInsets.DeviceSafeInsets;
    screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
    screenGui.DisplayOrder = 0;

    root = createRoot(screenGui);
    root.render(
        <StrictMode>
            {createPortal(<App backpackController={backpackController} />, screenGui)}
        </StrictMode>,
    );
}

export function destroyBackpack() {
    if (!root) return;
    root.unmount();
    root = undefined;

    if (screenGui) {
        screenGui.Destroy();
        screenGui = undefined;
    }
}
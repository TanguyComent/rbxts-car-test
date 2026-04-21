import { ICustomProximityPrompt } from "@common/client/controllers/CustomProximityPrompts.controller";
import React, { StrictMode } from "@rbxts/react";
import ReactRoblox, { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";

export abstract class CustomProximityPrompt implements ICustomProximityPrompt {
    protected root: ReactRoblox.Root;
    protected billboardGui: BillboardGui;

    protected gamePadButtonIconMapping = {
        [Enum.KeyCode.ButtonX.Value]: "rbxasset://textures/ui/Controls/xboxX.png",
        [Enum.KeyCode.ButtonY.Value]: "rbxasset://textures/ui/Controls/xboxY.png",
        [Enum.KeyCode.ButtonA.Value]: "rbxasset://textures/ui/Controls/xboxA.png",
        [Enum.KeyCode.ButtonB.Value]: "rbxasset://textures/ui/Controls/xboxB.png",
        [Enum.KeyCode.DPadLeft.Value]: "rbxasset://textures/ui/Controls/dpadLeft.png",
        [Enum.KeyCode.DPadRight.Value]: "rbxasset://textures/ui/Controls/dpadRight.png",
        [Enum.KeyCode.DPadUp.Value]: "rbxasset://textures/ui/Controls/dpadUp.png",
        [Enum.KeyCode.DPadDown.Value]: "rbxasset://textures/ui/Controls/dpadDown.png",
        [Enum.KeyCode.ButtonSelect.Value]: "rbxasset://textures/ui/Controls/xboxView.png",
        [Enum.KeyCode.ButtonStart.Value]: "rbxasset://textures/ui/Controls/xboxmenu.png",
        [Enum.KeyCode.ButtonL1.Value]: "rbxasset://textures/ui/Controls/xboxLB.png",
        [Enum.KeyCode.ButtonR1.Value]: "rbxasset://textures/ui/Controls/xboxRB.png",
        [Enum.KeyCode.ButtonL2.Value]: "rbxasset://textures/ui/Controls/xboxLT.png",
        [Enum.KeyCode.ButtonR2.Value]: "rbxasset://textures/ui/Controls/xboxRT.png",
        [Enum.KeyCode.ButtonL3.Value]: "rbxasset://textures/ui/Controls/xboxLS.png",
        [Enum.KeyCode.ButtonR3.Value]: "rbxasset://textures/ui/Controls/xboxRS.png",
        [Enum.KeyCode.Thumbstick1.Value]: "rbxasset://textures/ui/Controls/xboxLSDirectional.png",
        [Enum.KeyCode.Thumbstick2.Value]: "rbxasset://textures/ui/Controls/xboxRSDirectional.png",
    };

    protected keyboardButtonImages = {
        [Enum.KeyCode.Backspace.Value]: "rbxasset://textures/ui/Controls/backspace.png",
        [Enum.KeyCode.Return.Value]: "rbxasset://textures/ui/Controls/return.png",
        [Enum.KeyCode.LeftShift.Value]: "rbxasset://textures/ui/Controls/shift.png",
        [Enum.KeyCode.RightShift.Value]: "rbxasset://textures/ui/Controls/shift.png",
        [Enum.KeyCode.Tab.Value]: "rbxasset://textures/ui/Controls/tab.png",
    };

    protected keyboardButtonIconMapping = {
        ["'"]: "rbxasset://textures/ui/Controls/apostrophe.png",
        [","]: "rbxasset://textures/ui/Controls/comma.png",
        ["`"]: "rbxasset://textures/ui/Controls/graveaccent.png",
        ["."]: "rbxasset://textures/ui/Controls/period.png",
        [" "]: "rbxasset://textures/ui/Controls/spacebar.png",
    };

    protected keyCodeToTextMapping = {
	    [Enum.KeyCode.LeftControl.Value]: "Ctrl",
        [Enum.KeyCode.RightControl.Value]: "Ctrl",
        [Enum.KeyCode.LeftAlt.Value]: "Alt",
        [Enum.KeyCode.RightAlt.Value]: "Alt",
        [Enum.KeyCode.F1.Value]: "F1",
        [Enum.KeyCode.F2.Value]: "F2",
        [Enum.KeyCode.F3.Value]: "F3",
        [Enum.KeyCode.F4.Value]: "F4",
        [Enum.KeyCode.F5.Value]: "F5",
        [Enum.KeyCode.F6.Value]: "F6",
        [Enum.KeyCode.F7.Value]: "F7",
        [Enum.KeyCode.F8.Value]: "F8",
        [Enum.KeyCode.F9.Value]: "F9",
        [Enum.KeyCode.F10.Value]: "F10",
        [Enum.KeyCode.F11.Value]: "F11",
        [Enum.KeyCode.F12.Value]: "F12",
    };

    constructor(
        protected proximityPrompt: ProximityPrompt,
        protected inputType: Enum.ProximityPromptInputType,
    ) {
        this.billboardGui = new Instance("BillboardGui");
        this.billboardGui.Parent = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui
        if (proximityPrompt.Parent && (proximityPrompt.Parent.IsA("PVInstance") || proximityPrompt.Parent.IsA("Attachment"))) {
            this.billboardGui.Adornee = proximityPrompt.Parent;
        }
        this.billboardGui.AlwaysOnTop = true;
        this.billboardGui.Active = true;

        this.root = createRoot(this.billboardGui);
    }

    protected render(app: React.ReactNode) {
        this.root.render(
            <StrictMode>
                {createPortal(app, this.billboardGui)}
            </StrictMode>
        )
    }

    destroy() {
        this.root.unmount();
        this.billboardGui.Destroy();
    }
}
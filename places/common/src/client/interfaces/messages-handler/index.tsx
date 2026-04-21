import { createRoot } from "@rbxts/react-roblox";
import { Message, MessageStyle } from "./components/Message";
import { UUID } from "@common/shared/utils/TypeWrapper.utils";
import { StrictMode } from "@rbxts/react";
import { App, MessagesHandlerAPI } from "./components/App";
import React from "@rbxts/react";

export class MessagesHandler {
    private root: ReturnType<typeof createRoot>;
    private screenGui: ScreenGui;
    
    private api: MessagesHandlerAPI | undefined

    constructor() {
        const player = game.GetService("Players").LocalPlayer
        this.screenGui = new Instance("ScreenGui");
        this.screenGui.Name = "RebirthInterface";
        this.screenGui.IgnoreGuiInset = true;
        this.screenGui.ResetOnSpawn = false;
        this.screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
        this.screenGui.DisplayOrder = 999;
        this.screenGui.Parent = player.WaitForChild("PlayerGui") as PlayerGui;

        this.root = createRoot(this.screenGui);
        this.root.render(
            <StrictMode>
                <App 
                    onReady={(api) => {
                        this.api = api;
                    }} 
                />
            </StrictMode>
        );
    }

    public createMessage(messageStyle: MessageStyle, lifetime: number) {
        if (!this.api) return; /// Not ready yet
        const messageId = this.api.createMessage(messageStyle);
        task.delay(lifetime, () => this.api?.destroyMessage(messageId));
    }

    public createErrorMessage(text: string, lifetime: number = 5) {
        const messageStyle: MessageStyle = {
            text,
            textGradient: new ColorSequence(Color3.fromRGB(245, 47, 73), Color3.fromRGB(185, 0, 3)),
            textGradientRotation: 90,
            strokeSize: 6,
        }
        this.createMessage(messageStyle, lifetime);
    }

    public createSuccessMessage(text: string, lifetime: number = 5) {
        const messageStyle: MessageStyle = {
            text,
            textGradient: new ColorSequence(Color3.fromRGB(46, 245, 79), Color3.fromRGB(0, 186, 77)),
            textGradientRotation: 90,
            strokeSize: 6,
        }
        this.createMessage(messageStyle, lifetime);
    }
}
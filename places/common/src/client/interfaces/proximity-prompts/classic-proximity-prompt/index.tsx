import React from "@rbxts/react";
import { CustomProximityPrompt } from "../CustomProximityPrompt";
import { App } from "./components/App";
import { TextService } from "@rbxts/services";

export class ClassicProximityPrompt extends CustomProximityPrompt {

    static Create() {
        const pp = new Instance("ProximityPrompt");
        pp.SetAttribute("style", "classic");
        pp.Style = Enum.ProximityPromptStyle.Custom;
        return pp;
    }

    private actionTextSize: number = 19;
    private objectTextSize: number = 14;
    private actionText: React.Binding<string>;
    private setActionText: (text: string) => void;
    private destroyMethod: () => Promise<void> = () => Promise.resolve();

    constructor(proximityPrompt: ProximityPrompt, inputType: Enum.ProximityPromptInputType) {
        super(proximityPrompt, inputType)

        const actionTextSize = TextService.GetTextSize(proximityPrompt.ActionText, this.actionTextSize, Enum.Font.SourceSansBold, new Vector2(1000, 1000))
        const objectTextSize = TextService.GetTextSize(proximityPrompt.ObjectText, this.objectTextSize, Enum.Font.SourceSansBold, new Vector2(1000, 1000))
        const maxTextWidth = math.max(actionTextSize.X, objectTextSize.X);

        const promptHeight = 72;
        let promptWidth = 72;
        const textPaddingLeft = 72;
        const textPaddingRight = 24;

        if (
            this.proximityPrompt.ActionText !== "" ||
            this.proximityPrompt.ObjectText !== ""
        ) {
            promptWidth = textPaddingLeft + maxTextWidth + textPaddingRight;
        }

        [this.actionText, this.setActionText] = React.createBinding(proximityPrompt.ActionText);

        this.billboardGui.Size = UDim2.fromOffset(promptWidth, promptHeight);
        this.billboardGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
        proximityPrompt.GetPropertyChangedSignal("ActionText").Connect(() => {
            const actionTextSize = TextService.GetTextSize(proximityPrompt.ActionText, this.actionTextSize, Enum.Font.SourceSansBold, new Vector2(1000, 1000))
            const maxTextWidth = math.max(actionTextSize.X, objectTextSize.X);
            this.billboardGui.Size = UDim2.fromOffset(textPaddingLeft + maxTextWidth + textPaddingRight, promptHeight);
            this.setActionText(proximityPrompt.ActionText);
        })
        this.render(
            <App
                proximityPrompt={this.proximityPrompt}
                actionText={this.actionText}
                inputType={this.inputType}
                keyCodeToTextMapping={this.keyCodeToTextMapping}
                keyboardButtonIconMapping={this.keyboardButtonIconMapping}
                keyboardButtonImages={this.keyboardButtonImages}
                gamePadButtonIconMapping={this.gamePadButtonIconMapping}
                actionTextSize={this.actionTextSize}
                objectTextSize={this.objectTextSize}
                onReady={(controller) => {
                    this.destroyMethod = controller.destroy
                }}
            />
        );
    }

    override destroy(): void {
        this.destroyMethod().then(() => super.destroy())
    }
}
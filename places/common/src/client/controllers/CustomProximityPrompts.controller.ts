import { Controller, OnStart } from "@flamework/core";
import { ProximityPromptService } from "@rbxts/services";
import { ClassicProximityPrompt } from "../interfaces/proximity-prompts/classic-proximity-prompt"

type CustomProximityPromptConstructor = (proximityPrompt: ProximityPrompt, inputType: Enum.ProximityPromptInputType) => ICustomProximityPrompt;
export interface ICustomProximityPrompt {
    destroy(): void;
}

@Controller()
export class CustomProximityPromptController implements OnStart {
    private promptStyles: Record<string, CustomProximityPromptConstructor> = {
        "classic": (p, i) => new ClassicProximityPrompt(p, i),
    }

    onStart(): void {
        ProximityPromptService.PromptShown.Connect((prompt, inputType) => {
            const style = prompt.GetAttribute("style");
            if (!style || !typeIs(style, "string")) return;

            const createPrompt = this.promptStyles[style];
            if (!createPrompt) return;

            prompt.Style = Enum.ProximityPromptStyle.Custom;
            const customPrompt = createPrompt(prompt, inputType);
            
            prompt.PromptHidden.Wait();
            customPrompt.destroy();
        })
    }
}
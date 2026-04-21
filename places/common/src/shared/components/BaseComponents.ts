import { BaseComponent, Component } from "@flamework/components"
import { Janitor } from "@rbxts/janitor"

@Component({})
export class DestroyableComponent<A extends {} = {}, I extends Instance = Instance> extends BaseComponent<A, I> {
    protected readonly janitor = new Janitor();
    
    override destroy() {
        this.janitor.Destroy();
        super.destroy();
    }
}
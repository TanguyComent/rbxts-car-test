export namespace ToolsUtils {
    export function createToolFromModel(model: Model, iconURL: string): Tool {
        const usedModel = model.Clone();
        
        const tool = new Instance("Tool");
        tool.CanBeDropped = false;
        tool.TextureId = iconURL;

        const handle = new Instance("Part");
        handle.Name = "Handle";
        handle.Size = new Vector3(1, 1, 1);
        handle.Transparency = 1;
        handle.CanCollide = false;
        handle.Anchored = false;
        handle.CFrame = usedModel.GetPivot();
        handle.Parent = tool;

        usedModel.GetChildren().forEach((child) => {
            child.Parent = tool;
            if (child.IsA("BasePart")) {
                child.Anchored = false;
                child.CanCollide = false;
                child.Massless = true;
            }
        })

        tool.GetDescendants().forEach((child) => {
            if (child.IsA("BasePart")) {
                const weld = new Instance("WeldConstraint");
                weld.Part0 = handle;
                weld.Part1 = child;
                weld.Parent = handle;
                child.Anchored = false;
                child.CanCollide = false;
            }
        })

        return tool;
    }
}
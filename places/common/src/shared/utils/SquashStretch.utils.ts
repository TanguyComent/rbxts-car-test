import { Workspace } from "@rbxts/services";

export namespace SquashStretchUtils {
	export const readyElementsTag = "SS_Ready";
	export const currentStretchAttribute = "SS_CurrentStretch";
	export const currentSquashAttribute = "SS_CurrentSquash";

	function initSquashStretch(model: Model) {
		const primary = model.PrimaryPart;
		if (!primary) return;

		const configureDescendant = (d: Instance) => {
			if (!d.IsA("BasePart") || d === primary) return;

			// Store original size
			d.SetAttribute("SS_OriginalSize", d.Size);

			// Store LOCAL CFrame relative to PrimaryPart
			const localPosition = primary.CFrame.ToObjectSpace(d.CFrame);
			d.SetAttribute("SS_LocalCFrame", localPosition);
		};

		model.DescendantAdded.Connect(configureDescendant);
		for (const d of model.GetDescendants()) configureDescendant(d);

		model.AddTag(readyElementsTag);
	}

	function applyScaleFromAttributes(model: Model, scale: Vector3) {
		if (!model.HasTag(readyElementsTag)) {
			initSquashStretch(model);
		}

		const primary = model.PrimaryPart;
		if (!primary) return;

		const pivot = primary.CFrame;

		const elements: BasePart[] = [];
		const cframes: CFrame[] = [];

		for (const d of model.GetDescendants()) {
			if (!d.IsA("BasePart") || d === primary) continue;

			const size = d.GetAttribute("SS_OriginalSize") as Vector3;
			const localPosition = d.GetAttribute("SS_LocalCFrame") as CFrame;
			if (!size || !localPosition) continue;

			// Scale size
			d.Size = new Vector3(
				size.X * scale.X,
				size.Y * scale.Y,
				size.Z * scale.Z
			);

			// Scale LOCAL position only (not rotation)
			const pos = localPosition.Position;
			const scaledPos = new Vector3(
				pos.X * scale.X,
				pos.Y * scale.Y,
				pos.Z * scale.Z
			);

			const rotationOnly = localPosition.sub(localPosition.Position);
			const scaledLocal = new CFrame(scaledPos).mul(rotationOnly);

			// Rebuild world CFrame from CURRENT pivot
			const targetCFrame = pivot.mul(scaledLocal);
			elements.push(d);
			cframes.push(targetCFrame);
		}

		Workspace.BulkMoveTo(elements, cframes);
	}

	export function squash(model: Model, amount: number) {
		applyScaleFromAttributes(model, new Vector3(
			1 + amount,
			1 - amount,
			1 + amount
		));
	}

	export function stretch(model: Model, amount: number) {
		applyScaleFromAttributes(model, new Vector3(
			1 - amount,
			1 + amount,
			1 - amount
		));
	}

	export function reset(model: Model) {
		applyScaleFromAttributes(model, new Vector3(1, 1, 1));
	}
}

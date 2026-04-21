import Object from "@rbxts/object-utils";
import { TweenService } from "@rbxts/services";

export interface ScaleApi {
	register: (key: string, scale: number, tweenInfo?: TweenInfo) => void;
	unregister: (key: string, tweenInfo?: TweenInfo) => void;
	values: Record<string, number>;
	parent: GuiObject;
}

export function createScaleApi(parent: GuiObject): ScaleApi {
	const values: Record<string, number> = {};
	const uiScale: UIScale = new Instance("UIScale");
	uiScale.Parent = parent;
	let tween: Tween | undefined = undefined;

	const getScale = () => {
		let result = 1;
		for (const value of Object.values(values)) {
			result *= value;
		}
		return result;
	}

	const scaleTo = (scale: number, tweenInfo?: TweenInfo) => {
		tween?.Destroy();
		tween = TweenService.Create(
			uiScale,
			tweenInfo ?? new TweenInfo(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
			{ Scale: scale },
		);
		tween.Parent = parent;
		tween.Play();
	}

	const register = (key: string, scale: number, tweenInfo?: TweenInfo) => {
		values[key] = scale;
		scaleTo(getScale(), tweenInfo);
	}

	const unregister = (key: string, tweenInfo?: TweenInfo) => {
		delete values[key];
		scaleTo(getScale(), tweenInfo);
	}

	return {
		register,
		unregister,
		values,
		parent,
	};
}
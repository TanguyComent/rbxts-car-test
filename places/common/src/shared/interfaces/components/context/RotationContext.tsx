import Object from "@rbxts/object-utils";
import { TweenService } from "@rbxts/services";

export interface RotationApi {
	register: (key: string, rotation: number, tweenInfo?: TweenInfo) => void;
    unregister: (key: string, tweenInfo?: TweenInfo) => void;
    parent: GuiObject;
}

export function createRotationApi(parent: GuiObject): RotationApi {
	const values: Record<string, number> = {};
    let tween: Tween | undefined = undefined;
    parent.SetAttribute("r_initial_rotation", parent.Rotation);

    const getEffectRotation = () => {
        let result = 0;
        for (const value of Object.values(values)) {
            result += value;
        }
        return result;
    }

    const getInitialRotation = () => {
        return parent.GetAttribute("r_initial_rotation") as number;
    }

    const getRotation = () => {
        return getEffectRotation() + getInitialRotation();
    }

    const rotateTo = (rotation: number, tweenInfo?: TweenInfo) => {
        tween?.Destroy();
        tween = TweenService.Create(
            parent,
            tweenInfo ?? new TweenInfo(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
            { Rotation: rotation },
        )
        tween.Parent = parent;
        tween.Play();
    }

    const register = (key: string, rotation: number, tweenInfo?: TweenInfo) => {
        values[key] = rotation;
        rotateTo(getRotation(), tweenInfo);
    }

    const unregister = (key: string, tweenInfo?: TweenInfo) => {
        delete values[key];
        rotateTo(getRotation(), tweenInfo);
    }

    return {
        register,
        unregister,
        parent,
    };
}
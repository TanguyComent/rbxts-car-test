import { Controller, OnStart } from "@flamework/core";
import { Lighting, Players, TweenService, Workspace } from "@rbxts/services";

@Controller()
export class CameraController {
    public readonly initialFOV: number = Workspace.CurrentCamera ? Workspace.CurrentCamera.FieldOfView : 70;
    private blurEffect: BlurEffect;
    private depthOfFieldEffect: DepthOfFieldEffect;

    private positionBeforeForceMovement: CFrame | undefined;

    constructor() {
        this.blurEffect = new Instance("BlurEffect")
        this.blurEffect.Size = 0
        this.blurEffect.Parent = Lighting

        this.depthOfFieldEffect = new Instance("DepthOfFieldEffect")
        this.depthOfFieldEffect.Enabled = true
        this.depthOfFieldEffect.FarIntensity = 0;
        this.depthOfFieldEffect.NearIntensity = 0;
        this.depthOfFieldEffect.FocusDistance = 5;
        this.depthOfFieldEffect.InFocusRadius = 50;
        this.depthOfFieldEffect.Parent = Lighting
    }

    public tweenCameraFOV(targetFOV: number, tweenInfo: TweenInfo) {
        const camera = Workspace.CurrentCamera;
        if (!camera) return;
        
        const tween = game.GetService("TweenService").Create(camera, tweenInfo, { FieldOfView: targetFOV });
        tween.Play();
    }

    public tweenBlurSize(targetSize: number, tweenInfo: TweenInfo) {
        const tween = game.GetService("TweenService").Create(this.blurEffect, tweenInfo, { Size: targetSize });
        tween.Play();
    }

    public tweenDepthOfField(intensity: number,focusDistance: number, inFocusRadius: number, duration: number) {
        const tweenInfo = new TweenInfo(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
        const tween = game.GetService("TweenService").Create(this.depthOfFieldEffect, tweenInfo, { 
            FarIntensity: intensity, 
            NearIntensity: intensity, 
            FocusDistance: focusDistance, 
            InFocusRadius: inFocusRadius 
        });
        tween.Play();
    }

    public setInInterfaceMode(inInterface: boolean, options?: {fovFactor?: number; blurSize?: number}) {
        if (inInterface) {
            this.tweenCameraFOV(this.initialFOV * (options?.fovFactor ?? 1.3), new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out));
            this.tweenBlurSize(options?.blurSize ?? 12, new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out));
        } else {
            this.tweenCameraFOV(this.initialFOV, new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out));
            this.tweenBlurSize(0, new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out));
        }
    }

    public setInPetHatchMode(inPetHatch: boolean) {
        if (inPetHatch) {
            this.tweenCameraFOV(this.initialFOV * 1.3, new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out));
            this.tweenDepthOfField(1, 5, 10, 0.22);
        } else {
            this.tweenCameraFOV(this.initialFOV, new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out));
            this.tweenDepthOfField(0, 0, 0, 0.22);
        }
    }

    public moveCameraTo(CFrame: CFrame, duration: number, easingStyle: Enum.EasingStyle): Promise<void> {
        const camera = Workspace.CurrentCamera;
        if (!camera) return Promise.resolve();

        if (camera.CameraType === Enum.CameraType.Custom) { /// Was controlled by player before
            this.positionBeforeForceMovement = camera.CFrame;
        }

        this.updateCameraType(Enum.CameraType.Scriptable);
        const tweenInfo = new TweenInfo(duration, easingStyle);
        const tween = TweenService.Create(camera, tweenInfo, { CFrame: CFrame });
        return new Promise((resolve) => {
            tween.Completed.Connect(() => resolve())
            tween.Play();
        })
    }

    public bringCameraBackToCharacter(duration: number, easingStyle: Enum.EasingStyle): Promise<void> {
        if (!this.positionBeforeForceMovement) return Promise.resolve();

        return this.moveCameraTo(this.positionBeforeForceMovement, duration, easingStyle).andThen(() => {
            this.updateCameraType(Enum.CameraType.Custom);
            this.positionBeforeForceMovement = undefined;
        });
    }

    public updateCameraType(cameraType: Enum.CameraType) {
        const camera = Workspace.CurrentCamera;
        if (!camera) return;

        camera.CameraType = cameraType;
    }
}
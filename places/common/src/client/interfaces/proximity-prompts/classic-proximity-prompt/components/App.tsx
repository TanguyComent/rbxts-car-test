import { Janitor } from "@rbxts/janitor"
import { useEventListener, useMountEffect } from "@rbxts/pretty-react-hooks"
import React from "@rbxts/react";
import { TweenService, UserInputService } from "@rbxts/services"

interface AppProps {
    inputType: Enum.ProximityPromptInputType;

    keyCodeToTextMapping: Record<number, string>;
    keyboardButtonIconMapping: Record<string, string>;
    keyboardButtonImages: Record<number, string>;
    gamePadButtonIconMapping: Record<number, string>;

    proximityPrompt: ProximityPrompt;
    actionTextSize: number;
    objectTextSize: number;
    actionText: React.Binding<string>;

    onReady?: (controller: {
        destroy: () => Promise<void>
    }) => void;
}

export function App({ inputType, keyCodeToTextMapping, keyboardButtonIconMapping, keyboardButtonImages, gamePadButtonIconMapping, proximityPrompt, actionTextSize, objectTextSize, actionText, onReady }: AppProps) {
    const font = "rbxasset://fonts/families/SourceSansPro.json"
    const [interactionJanitor, setInteractionJanitor] = React.useState<Janitor>(new Janitor());
    const [buttonHeld, setButtonHeld] = React.useState(false);

    const gradient1Ref = React.useRef<UIGradient>();
    const gradient2Ref = React.useRef<UIGradient>();
    const canvaGroupRef = React.useRef<CanvasGroup>();
    const mainFrameRef = React.useRef<Frame>();
    const mainFrameStrokeRef = React.useRef<UIStroke>();
    const textClipFrameRef = React.useRef<Frame>();
    const textContentFrameRef = React.useRef<Frame>();
    const uiScaleRef = React.useRef<UIScale>();

    const holdProgressValueRef = React.useRef<NumberValue>();
    const collapseProgressValueRef = React.useRef<NumberValue>();
    let buttonTextString = UserInputService.GetStringForKeyCode(proximityPrompt.KeyboardKeyCode);
    const buttonTextImage = keyboardButtonImages[proximityPrompt.KeyboardKeyCode.Value] ||
                            keyboardButtonIconMapping[buttonTextString]

    const tweenInfoInFullDuration = new TweenInfo(proximityPrompt.HoldDuration, Enum.EasingStyle.Linear, Enum.EasingDirection.Out)
    const tweenInforInHalfSecond = new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
    const collapseTweenInfo = new TweenInfo(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)

    if (buttonTextImage === undefined) {
        const keycodeMappedText = keyCodeToTextMapping[proximityPrompt.KeyboardKeyCode.Value];
        if (keycodeMappedText !== undefined) {
            buttonTextString = keycodeMappedText;
        }
    }

    const updateHoldProgress = (value: number) => {
        if (gradient1Ref.current && gradient2Ref.current) {
            const angle = math.clamp(value * 360, 0, 360)
            gradient1Ref.current.Rotation = math.clamp(angle, 180, 360)
            gradient2Ref.current.Rotation = math.clamp(angle, 0, 180)
        }
    }

    const updateCollapseProgress = (value: number) => {
        const openRatio = math.clamp(1 - value, 0, 1)

        if (textClipFrameRef.current && textContentFrameRef.current) {
            const fullTextWidth = textContentFrameRef.current.AbsoluteSize.X
            textClipFrameRef.current.Size = new UDim2(0, fullTextWidth * openRatio, 1, 0)
        }

        if (mainFrameRef.current) {
            mainFrameRef.current.BackgroundTransparency = 0.6 + (0.4 * value)
        }

        if (mainFrameStrokeRef.current) {
            mainFrameStrokeRef.current.Transparency = 0.1 + (0.9 * value)
        }
    }
    
    useEventListener(proximityPrompt.PromptButtonHoldBegan, () => {
        interactionJanitor.Cleanup();
        if (!holdProgressValueRef.current || !collapseProgressValueRef.current) return
        const holdTween = TweenService.Create(holdProgressValueRef.current, tweenInfoInFullDuration, { Value: 1 })
        const collapseTween = TweenService.Create(collapseProgressValueRef.current, collapseTweenInfo, { Value: 1 })

        interactionJanitor.Add(() => {
            holdTween.Cancel()
            holdTween.Destroy()

            collapseTween.Cancel()
            collapseTween.Destroy()
        })
        
        holdTween.Play()
        collapseTween.Play()
    })

    useEventListener(proximityPrompt.PromptButtonHoldEnded, () => {
        interactionJanitor.Cleanup();
        if (!holdProgressValueRef.current || !collapseProgressValueRef.current) return
        const holdTween = TweenService.Create(holdProgressValueRef.current, tweenInforInHalfSecond, { Value: 0 })
        const collapseTween = TweenService.Create(collapseProgressValueRef.current, collapseTweenInfo, { Value: 0 })

        interactionJanitor.Add(() => {
            holdTween.Cancel()
            holdTween.Destroy()

            collapseTween.Cancel()
            collapseTween.Destroy()
        })

        holdTween.Play()
        collapseTween.Play()
    })

    useEventListener(proximityPrompt.Triggered, () => {
        interactionJanitor.Cleanup();
        if (!holdProgressValueRef.current || !collapseProgressValueRef.current || !canvaGroupRef.current) {
            return
        }
        holdProgressValueRef.current.Value = 1
        collapseProgressValueRef.current.Value = 1

        const fadeOutTween = TweenService.Create(canvaGroupRef.current, new TweenInfo(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { GroupTransparency: 1 })
        interactionJanitor.Add(() => {
            fadeOutTween.Cancel()
            fadeOutTween.Destroy()
        })

        fadeOutTween.Play()
    })

    useEventListener(proximityPrompt.TriggerEnded, () => {
        interactionJanitor.Cleanup();
        if (!holdProgressValueRef.current || !collapseProgressValueRef.current || !canvaGroupRef.current) return
        const holdTween = TweenService.Create(holdProgressValueRef.current, tweenInforInHalfSecond, { Value: 0 })
        const collapseTween = TweenService.Create(collapseProgressValueRef.current, collapseTweenInfo, { Value: 0 })
        canvaGroupRef.current.GroupTransparency = 0

        interactionJanitor.Add(() => {
            holdTween.Cancel()
            holdTween.Destroy()

            collapseTween.Cancel()
            collapseTween.Destroy()
        })

        holdTween.Play()
        collapseTween.Play()
    })

    useMountEffect(() => {
        if (!canvaGroupRef.current) return
        const tween = TweenService.Create(canvaGroupRef.current, new TweenInfo(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { GroupTransparency: 0 })
        tween.Play()

        task.defer(() => {
            updateHoldProgress(holdProgressValueRef.current ? holdProgressValueRef.current.Value : 0)
            updateCollapseProgress(collapseProgressValueRef.current ? collapseProgressValueRef.current.Value : 0)
        })

        if (onReady) {
            onReady({
                destroy: () => {
                    return new Promise((resolve, _) => {
                        if (!canvaGroupRef.current) {
                            resolve()
                            return;
                        }

                        const fadeOutTween = TweenService.Create(canvaGroupRef.current, new TweenInfo(0.22, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), { GroupTransparency: 1 })
                        fadeOutTween.Completed.Once(() => {
                            fadeOutTween.Destroy()
                            resolve()
                        })
                        fadeOutTween.Play()
                    })
                }
            })
        }

        return () => {
            tween.Destroy()
        }
    })

    return (
        <>
            <textbutton
                BackgroundTransparency={1}
                TextTransparency={1}
                Text={""}
                Size={UDim2.fromScale(1, 1)}
                Event={{
                    InputBegan: (_, input) => {
                        if (input.UserInputType === Enum.UserInputType.Touch || input.UserInputType === Enum.UserInputType.MouseButton1) {
                            proximityPrompt.InputHoldBegin()
                            setButtonHeld(true)
                        }
                    },
                    InputEnded: (_, input) => {
                        if ((input.UserInputType === Enum.UserInputType.Touch || input.UserInputType === Enum.UserInputType.MouseButton1) && buttonHeld) {
                            proximityPrompt.InputHoldEnd()
                            setButtonHeld(false)
                        }
                    }
                }}
                ZIndex={2}
            />
            <canvasgroup
                ref={canvaGroupRef}
                key="MainCanvasGroup"
                BackgroundTransparency={1}
                Size={new UDim2(1, 16, 1, 1)}
                GroupTransparency={1}
            >
                <frame
                    ref={mainFrameRef}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    AutomaticSize={Enum.AutomaticSize.X}
                    BackgroundColor3={Color3.fromRGB(18, 18, 18)}
                    BackgroundTransparency={0.6}
                    Position={UDim2.fromScale(0.5, 0.5)}
                    Size={new UDim2(0, -10, 1, -10)}
                >
                    <uipadding PaddingRight={new UDim(0, 24)} />
                    <uistroke
                        ref={mainFrameStrokeRef}
                        Color={Color3.fromRGB(18, 18, 18)}
                        Transparency={0.1}
                        Thickness={4}
                    />
                    <uicorner
                        CornerRadius={new UDim(0, 3)}
                    />

                    <numbervalue
                        ref={holdProgressValueRef}
                        key="HoldProgress"
                        Value={0}

                        Event={{
                            Changed: (_, value) => {
                                updateHoldProgress(value)
                            }
                        }}
                    />
                    <numbervalue
                        ref={collapseProgressValueRef}
                        key="CollapseProgress"
                        Value={0}

                        Event={{
                            Changed: (_, value) => {
                                updateCollapseProgress(value)
                            }
                        }}
                    />
                    <frame
                        key="InputFrame"
                        BackgroundTransparency={1}
                        Size={UDim2.fromScale(1, 1)}
                        SizeConstraint={Enum.SizeConstraint.RelativeYY}
                    >
                        <frame
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            BackgroundTransparency={1}
                            Position={UDim2.fromScale(0.5, 0.5)}
                            Size={UDim2.fromScale(1, 1)}
                        >
                            <frame
                                key="RoundFrame"
                                AnchorPoint={new Vector2(0.5, 0.5)}
                                BackgroundTransparency={0.25}
                                Position={UDim2.fromScale(0.5, 0.5)}
                                Size={UDim2.fromOffset(48, 48)}
                            >
                                <uicorner CornerRadius={new UDim(0.5, 0)} />
                            </frame>
                            {inputType === Enum.ProximityPromptInputType.Gamepad && gamePadButtonIconMapping[proximityPrompt.GamepadKeyCode.Value] !== undefined && (
                                <imagelabel
                                    AnchorPoint={new Vector2(0.5, 0.5)}
                                    Image={gamePadButtonIconMapping[proximityPrompt.GamepadKeyCode.Value]} 
                                    BackgroundTransparency={1}
                                    Position={UDim2.fromScale(0.5, 0.5)}
                                    Size={UDim2.fromOffset(24, 24)}
                                />
                            )}
                            {inputType === Enum.ProximityPromptInputType.Touch && (
                                <imagelabel 
                                    AnchorPoint={new Vector2(0.5, 0.5)}
                                    BackgroundTransparency={1}
                                    Position={UDim2.fromScale(0.5, 0.5)}
                                    Size={UDim2.fromOffset(25, 31)}
                                    Image="rbxasset://textures/ui/Controls/TouchTapIcon.png"
                                />
                            )}
                            {inputType === Enum.ProximityPromptInputType.Keyboard && (
                                <imagelabel 
                                    AnchorPoint={new Vector2(0.5, 0.5)}
                                    BackgroundTransparency={1}
                                    Position={UDim2.fromScale(0.5, 0.5)}
                                    Size={UDim2.fromOffset(28, 30)}
                                    Image="rbxasset://textures/ui/Controls/key_single.png"
                                >
                                    {buttonTextImage !== undefined && (
                                        <imagelabel 
                                            AnchorPoint={new Vector2(0.5, 0.5)}
                                            BackgroundTransparency={1}
                                            Image={buttonTextImage} 
                                            Position={UDim2.fromScale(0.5, 0.5)}
                                            Size={UDim2.fromOffset(36, 36)}
                                        />
                                    )}
                                    {buttonTextImage === undefined && (
                                        <textlabel
                                            BackgroundTransparency={1}
                                            Position={UDim2.fromOffset(0, -1)}
                                            Size={UDim2.fromScale(1, 1)}
                                            FontFace={new Font(font, Enum.FontWeight.Medium, Enum.FontStyle.Normal)}
                                            Text={buttonTextString}
                                            TextSize={14}
                                            TextColor3={new Color3(1, 1, 1)}
                                            TextXAlignment={Enum.TextXAlignment.Center}
                                        />
                                    )}
                                </imagelabel>
                            )}
                            <frame
                                key="CircularProgressBar"
                                AnchorPoint={new Vector2(0.5, 0.5)}
                                BackgroundTransparency={1}
                                Position={UDim2.fromScale(0.5, 0.5)}
                                Size={UDim2.fromOffset(58, 58)}
                                >
                                <frame
                                    BackgroundTransparency={1}
                                    ClipsDescendants={true}
                                    Size={UDim2.fromScale(0.5, 1)}
                                >
                                    <imagelabel
                                        BackgroundTransparency={1}
                                        Image="rbxasset://textures/ui/Controls/RadialFill.png"
                                        Size={UDim2.fromScale(2, 1)}
                                    >
                                        <uigradient
                                            ref={gradient1Ref}
                                            Rotation={180}
                                            Transparency={new NumberSequence([
                                                new NumberSequenceKeypoint(0, 0),
                                                new NumberSequenceKeypoint(0.4999, 0),
                                                new NumberSequenceKeypoint(0.5, 1),
                                                new NumberSequenceKeypoint(1, 1),
                                            ])}
                                        />
                                    </imagelabel>
                                </frame>
                                <frame
                                    BackgroundTransparency={1}
                                    ClipsDescendants={true}
                                    Position={UDim2.fromScale(0.5, 0)}
                                    Size={UDim2.fromScale(0.5, 1)}
                                >
                                    <imagelabel
                                        BackgroundTransparency={1}
                                        Image="rbxasset://textures/ui/Controls/RadialFill.png"
                                        Position={UDim2.fromScale(-1, 0)}
                                        Size={UDim2.fromScale(2, 1)}
                                    >
                                        <uigradient
                                            ref={gradient2Ref}
                                            Transparency={new NumberSequence([
                                                new NumberSequenceKeypoint(0, 0),
                                                new NumberSequenceKeypoint(0.4999, 0),
                                                new NumberSequenceKeypoint(0.5, 1),
                                                new NumberSequenceKeypoint(1, 1),
                                            ])}                                        />
                                    </imagelabel>
                                </frame>
                            </frame>
                        </frame>
                    </frame>
                    <uilistlayout FillDirection={Enum.FillDirection.Horizontal} />
                    <frame
                        key="TextFrame"
                        ref={textClipFrameRef}
                        BackgroundTransparency={1}
                        ClipsDescendants={true}
                        Size={UDim2.fromScale(0, 1)}
                    >
                        <frame
                            ref={textContentFrameRef}
                            AutomaticSize={Enum.AutomaticSize.X}
                            BackgroundTransparency={1}
                            Size={UDim2.fromScale(0, 1)}
                        >
                            <uipadding 
                                PaddingLeft={new UDim(0, 3)}
                                PaddingRight={new UDim(0, 3)}
                            />
                            <textlabel
                                key="ActionText"
                                AutomaticSize={Enum.AutomaticSize.X}
                                BackgroundTransparency={1}
                                FontFace={new Font(font, Enum.FontWeight.Bold, Enum.FontStyle.Normal)}
                                Size={new UDim2(0, 6, 1, 0)}
                                Text={actionText}
                                TextColor3={Color3.fromRGB(255, 255, 255)}
                                TextSize={actionTextSize}
                                TextXAlignment={Enum.TextXAlignment.Left}
                            >
                                <uistroke 
                                    Color={Color3.fromRGB(18, 18, 18)}
                                    Thickness={3}
                                />
                            </textlabel>
                            {/* <textlabel TODO : Add object text
                                key="ObjectText"
                                AutomaticSize={Enum.AutomaticSize.X}
                                BackgroundTransparency={1}
                                FontFace={new Font(font, Enum.FontWeight.Bold, Enum.FontStyle.Normal)}
                                Position={UDim2.fromOffset(0, -10)}
                                Size={UDim2.fromScale(0, 1)}
                                Text={proximityPrompt.ObjectText}
                                TextColor3={Color3.fromRGB(178, 178, 178)}
                                TextSize={objectTextSize}
                                TextXAlignment={Enum.TextXAlignment.Left}
                            /> */}
                        </frame>
                    </frame>
                </frame>
            </canvasgroup>
        </>
    )
}
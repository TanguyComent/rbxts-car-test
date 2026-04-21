import React from "@rbxts/react";
import { useEffect } from "@rbxts/react";
import { RunService } from "@rbxts/services";

interface AnimatedTextLabelProps extends React.InstanceProps<TextLabel> {
    lettersPerSecond?: number;
    onFinished?: () => void;
}

export function AnimatedTextLabel(props: AnimatedTextLabelProps) {
    const [displayedText, setDisplayedText] = React.useState("");
    const lettersPerSecond = props.lettersPerSecond ?? 10;
    delete props.lettersPerSecond;

    const onFinished = props.onFinished;
    delete props.onFinished;

    useEffect(() => {
        const delayBetweenLetters = 1 / lettersPerSecond;
        let passedTime = 0
        let currentTextLength = 0;
        const text = props.Text ? tostring(props.Text) : "";

        const runServiceConnection = RunService.RenderStepped.Connect((delta) => {
            if (!props.Text) return;
            passedTime += delta;
            if (passedTime >= delayBetweenLetters) {
                passedTime = 0;
                currentTextLength += 1;
                setDisplayedText(string.sub(text, 1, currentTextLength));

                if (currentTextLength >= text.size()) {
                    runServiceConnection.Disconnect();
                    onFinished?.();
                }
            }
        })

        return () => runServiceConnection.Disconnect();
    }, [props.Text, setDisplayedText])

    return (
        <textlabel 
            {...props}
            Text={displayedText}
        />
    )
}
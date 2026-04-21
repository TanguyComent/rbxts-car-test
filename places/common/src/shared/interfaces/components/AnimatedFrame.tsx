import { deepCopy } from "@rbxts/object-utils";
import { useMountEffect } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { TweenService } from "@rbxts/services";

interface AnimatedFrameProps extends React.InstanceProps<Frame> {
    animationInfo?: TweenInfo;
}

export function AnimatedFrame(props: AnimatedFrameProps) {
    const usableProps = deepCopy(props);
    const scaleRef = React.useRef<UIScale>(undefined);
    
    const children = usableProps.children;
    delete usableProps.children;

    const animationInfo = usableProps.animationInfo;
    delete usableProps.animationInfo;

    useMountEffect(() => {
        if (scaleRef.current) {
            const tween = TweenService.Create(
                scaleRef.current,
                animationInfo ?? new TweenInfo(0.22, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
                { Scale: 1 },
            );
            tween.Play();
        }
    })

    return (
        <frame
            {...usableProps}
        >
            <uiscale Scale={0} ref={scaleRef} />
            {children}
        </frame>
    )
}
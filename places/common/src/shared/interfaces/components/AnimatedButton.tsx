import { Dependency } from "@flamework/core";
import React from "@rbxts/react";
import { TweenService } from "@rbxts/services";
import { usePx } from "../hooks/usePx"

interface AnimatedButtonProps extends React.InstanceProps<TextButton> {
	borderSize?: number;
	borderColor?: Color3;
	hoverScale?: number;
}

export function AnimatedButton(props: AnimatedButtonProps) {
	const scaleRef = React.useRef<UIScale>();
	const px = usePx();

	const children = props.children;
	delete props.children;

	const borderSize = props.borderSize;
	delete props.borderSize;

	const borderColor = props.borderColor;
	delete props.borderColor;

	const BackgroundColor3 = props.BackgroundColor3;
	delete props.BackgroundColor3;

	const hoverScale = props.hoverScale ?? 1.03;
	delete props.hoverScale;

	const tweenScale = (target: number, time = 0.15) => {
		const s = scaleRef.current;
		if (!s) return;
		TweenService.Create(s, new TweenInfo(time, Enum.EasingStyle.Quad), { Scale: target }).Play();
	};

	return (
		<textbutton
			{...props}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Text={""}
			Event={{
				MouseEnter: () => tweenScale(hoverScale),
				MouseLeave: () => tweenScale(1),
				MouseButton1Up: () => tweenScale(1),
				MouseButton1Down: (rbx: TextButton, x: number, y: number) => {
					tweenScale(0.95, 0.2);
					props.Event?.MouseButton1Down?.(rbx, x, y);
				},
				...props.Event,
			}}
		>
			<frame 
				Size={UDim2.fromScale(1, 1)}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={props.BackgroundTransparency ?? 0}
				BorderSizePixel={0}
				BackgroundColor3={BackgroundColor3}
			>
				<uiscale ref={scaleRef} Scale={1} />
				<uistroke
					Color={borderColor ?? new Color3(0, 0, 0)}
					Thickness={borderSize ?? px(5)}
					BorderStrokePosition={Enum.BorderStrokePosition.Inner}
				/>
				{children}
			</frame>
		</textbutton>
	);
}
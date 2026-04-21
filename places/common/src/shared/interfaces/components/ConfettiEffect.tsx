import { GenerateUUID } from "@common/shared/utils/GenerateUUID.utils";
import React from "@rbxts/react";
import { useEffect } from "@rbxts/react";
import { RunService } from "@rbxts/services";

interface ConfettiProps {
	startDelay: number;
	rotationSpeed: number;
	color: Color3;
	size: number;
	ZIndex?: number;

	startScalePosition: Vector2;
	direction: Vector2; // When gravity is enabled, this becomes the gravity direction

	gravityEnabled?: boolean; // Default false
	throwForce?: Vector2;

	speed: number;
	shape: string; // ImageId
	onFinish: () => void; // Cleanup the confetti
}

function Confetti({
	startDelay,
	rotationSpeed,
	color,
	size,
	speed,
	startScalePosition,
	direction,
	gravityEnabled = false,
	throwForce = new Vector2(0, 0),
	shape,
	ZIndex,
	onFinish,
}: ConfettiProps) {
	const frameRef = React.useRef<ImageLabel>();
	const connectionRef = React.useRef<RBXScriptConnection>();

	const startMovement = () => {
		if (!frameRef.current) {
			onFinish();
			return;
		}

		let position = startScalePosition;
		let velocity = direction.Unit.mul(speed);

		let gravity = new Vector2(0, 0);
		if (gravityEnabled) {
			gravity = direction.mul(0.98);
		}

		let rotation = 0;
		const rotationDirection = math.random(0, 1) === 0 ? -1 : 1;

		const cleanup = () => {
			if (connectionRef.current) connectionRef.current.Disconnect();
			onFinish();
		};

		frameRef.current.Visible = true;
		connectionRef.current = RunService.RenderStepped.Connect((dt) => {
			let tickVelocity = new Vector2(0, 0);
			if (gravityEnabled) {
				tickVelocity = tickVelocity.add(throwForce.mul(dt));
				throwForce = throwForce.sub(throwForce.mul(dt));

				tickVelocity = tickVelocity.add(gravity.mul(dt));
				gravity = gravity.add(gravity.mul(dt));
			} else {
				tickVelocity = tickVelocity.add(velocity.mul(dt));
			}
			position = position.add(tickVelocity);

			if (frameRef.current) {
				frameRef.current.Position = UDim2.fromScale(position.X, position.Y);

				if (rotationSpeed > 0) {
					rotation += rotationDirection * rotationSpeed * dt;
					frameRef.current.Rotation = rotation % 360;
				}
			}

			if (position.Y < -0.2 || position.Y > 1.2 || position.X < -0.2 || position.X > 1.2) {
				cleanup();
			}
		});
	};

	useEffect(() => {
		task.delay(startDelay, () => startMovement());
	}, []);

	return (
		<imagelabel
			ref={frameRef}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(startScalePosition.X, startScalePosition.Y)}
			Size={UDim2.fromOffset(size, size)}
			BackgroundTransparency={1}
			ZIndex={ZIndex}
			BorderSizePixel={0}
			ImageColor3={color}
			Image={shape}
			Visible={false}
		/>
	);
}

interface ConfettiManagerProps {
	onReady: (manager: IConfettiManager) => void;
}

export interface IConfettiManager {
	launchRandomConfetties: (howMany: number, bornes: ConfettiesBornes) => void;
}

export interface ConfettiesBornes {
	speed: {
		min: number;
		max: number;
	};
	size: {
		min: number;
		max: number;
	};
	rotationSpeed: {
		min: number;
		max: number;
	};
	delay: {
		min: number;
		max: number;
	};
	startScalePosition: {
		min: Vector2;
		max: Vector2;
	};
	direction: {
		min: Vector2;
		max: Vector2;
	};
	throwForce?: {
		min: Vector2;
		max: Vector2;
	};
	gravityEnabled: boolean;
	colors: Color3[];
	shapes: string[]; // Images ids
	zindex?: number;
}

export function ConfettiesManager({ onReady }: ConfettiManagerProps) {
	const [confetties, setConfetties] = React.useState<
		{
			confetti: Omit<ConfettiProps, "onFinish">;
			uniqueId: string;
		}[]
	>([]);

	const launchRandomConfetties = (howMany: number, bornes: ConfettiesBornes) => {
		const newConfetties: {
			confetti: Omit<ConfettiProps, "onFinish">;
			uniqueId: string;
		}[] = [];

		for (let i = 0; i < howMany; i++) {
			const confetto: Omit<ConfettiProps, "onFinish"> = {
				color: bornes.colors[math.random(0, bornes.colors.size() - 1)],
				shape: bornes.shapes[math.random(0, bornes.shapes.size() - 1)],

				size: math.random(bornes.size.min * 100_000, bornes.size.max * 100_000) / 100_000,
				speed: math.random(bornes.speed.min * 100_000, bornes.speed.max * 100_000) / 100_000,
				rotationSpeed:
					math.random(bornes.rotationSpeed.min * 100_000, bornes.rotationSpeed.max * 100_000) / 100_000,
				startDelay: math.random(bornes.delay.min * 100_000, bornes.delay.max * 100_000) / 100_000,

				direction: new Vector2(
					math.random(bornes.direction.min.X * 100_000, bornes.direction.max.X * 100_000) / 100_000,
					math.random(bornes.direction.min.Y * 100_000, bornes.direction.max.Y * 100_000) / 100_000,
				),
				startScalePosition: new Vector2(
					math.random(bornes.startScalePosition.min.X * 100_000, bornes.startScalePosition.max.X * 100_000) /
						100_000,
					math.random(bornes.startScalePosition.min.Y * 100_000, bornes.startScalePosition.max.Y * 100_000) /
						100_000,
				),
				throwForce: bornes.throwForce
					? new Vector2(
							math.random(bornes.throwForce.min.X * 100_000, bornes.throwForce.max.X * 100_000) / 100_000,
							math.random(bornes.throwForce.min.Y * 100_000, bornes.throwForce.max.Y * 100_000) / 100_000,
						)
					: new Vector2(0, 0),
				gravityEnabled: bornes.gravityEnabled,
				ZIndex: bornes.zindex ?? 500,
			};

			newConfetties.push({ confetti: confetto, uniqueId: GenerateUUID.generateHexSegment(16) });
		}

		setConfetties((old) => [...old, ...newConfetties]);
	};

	useEffect(() => {
		onReady({ launchRandomConfetties });
	}, []);

	return (
		<>
			{confetties.map((confettiProps) => {
				return (
					<Confetti
						key={confettiProps.uniqueId}
						{...confettiProps.confetti}
						onFinish={() =>
							setConfetties((old) => {
								return old.filter((c) => c.uniqueId !== confettiProps.uniqueId);
							})
						}
					/>
				);
			})}
		</>
	);
}
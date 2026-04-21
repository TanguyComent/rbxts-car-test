export namespace RagdollUtils {
	export function enableRagdoll(character: Model) {
		const humanoid = character.FindFirstChildOfClass("Humanoid");
		if (!humanoid) return;

		humanoid.PlatformStand = true;
		humanoid.AutoRotate = false;
		humanoid.EvaluateStateMachine = false;
		humanoid.RequiresNeck = false;
		humanoid.ChangeState(Enum.HumanoidStateType.Physics);

        for (const part of character.GetChildren()) {
            if (part.IsA("BasePart")) {
                part.Anchored = false;
                part.CanCollide = true;
                part.CollisionGroup = "ragdoll-part";
            }
        }

		for (const joint of character.GetDescendants()) {
			if (joint.IsA("Motor6D")) {
				const part0 = joint.Part0;
				const part1 = joint.Part1;
				if (!part0 || !part1) continue;

				const a0 = new Instance("Attachment");
				a0.CFrame = joint.C0;
				a0.Parent = part0;

				const a1 = new Instance("Attachment");
				a1.CFrame = joint.C1;
				a1.Parent = part1;

				const socket = new Instance("BallSocketConstraint");
				socket.Attachment0 = a0;
				socket.Attachment1 = a1;

				socket.LimitsEnabled = true;
				socket.UpperAngle = 55;
				socket.TwistLimitsEnabled = true;
				socket.TwistLowerAngle = -45;
				socket.TwistUpperAngle = 45;
				socket.MaxFrictionTorque = 2;
				socket.Restitution = 0;

				socket.Parent = character;

				joint.Enabled = false;
			}
		}
	}

	export function disableRagdoll(character: Model) {
		const humanoid = character.FindFirstChildOfClass("Humanoid");
		if (!humanoid) return;

		const root = character.PrimaryPart;

		if (root) {
			root.AssemblyLinearVelocity = Vector3.zero;
			root.AssemblyAngularVelocity = Vector3.zero;
			root.CFrame = new CFrame(root.Position.add(new Vector3(0, 2, 0)));
		}

		for (const part of character.GetDescendants()) {
			if (part.IsA("BasePart")) {
				part.CollisionGroup = "Player";
			}

			if (part.IsA("BallSocketConstraint")) {
				part.Attachment0?.Destroy();
				part.Attachment1?.Destroy();
				part.Destroy();
			}

			if (part.IsA("Motor6D")) {
				part.Enabled = true;
			}
		}

		humanoid.PlatformStand = false;
		humanoid.AutoRotate = true;
		humanoid.EvaluateStateMachine = true;
		humanoid.RequiresNeck = true;

		humanoid.ChangeState(Enum.HumanoidStateType.Landed);
		task.delay(0.05, () => {
			humanoid.ChangeState(Enum.HumanoidStateType.GettingUp);
			task.delay(0.1, () => {
				humanoid.ChangeState(Enum.HumanoidStateType.Running);
			});
		});

		/// Hack to force the humanoid to update its state properly
		task.delay(0.15, () => {
			const decoy = new Instance("Part");
			decoy.Size = new Vector3(1, 1, 1);
			decoy.Anchored = true;
			decoy.CanCollide = false;
			decoy.Transparency = 1;
			decoy.Parent = character;
			task.delay(0.1, () => decoy.Destroy());
		});
	}
}

import { DestroyableComponent } from "@common/shared/components/BaseComponents";
import { Tags } from "@common/shared/Tags";
import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import { Workspace } from "@rbxts/services";

interface CarAttributes {
    suspensionStiffness: number;
    suspensionDamping: number;
    suspensionRestLength: number;
}

interface CarInstance extends Model {
    Wheels: Folder;
    Body: BasePart;
}

@Component({
    tag: Tags.CAR_TAG,
    defaults: {
        suspensionStiffness: 2500,
        suspensionDamping: 250,
        suspensionRestLength: 4,
    }
})
export class CarComponent extends DestroyableComponent<CarAttributes, CarInstance> implements OnStart, OnTick {
    private suspensionLength: number = 0; /// Basically the size of a wheel
    private wheelInfos: Map<BasePart, {
        attachment: Attachment;
        vectorForce: VectorForce;
    }> = new Map();

    onStart(): void {
        for (const wheel of this.instance.Wheels.GetChildren()) {
            if (!wheel.IsA("BasePart")) continue;
            this.suspensionLength = math.max(this.suspensionLength, wheel.Size.Y, wheel.Size.Z, wheel.Size.X);
            this.initWheel(wheel);
        }
    }

    onTick(dt: number): void {
        for (const [wheel, { attachment, vectorForce }] of this.wheelInfos) {
            this.applySuspensionForce(wheel, attachment, vectorForce, dt);
        }
    }

    private applySuspensionForce(wheel: BasePart, wheelAttachment: Attachment, wheelVectorForce: VectorForce, dt: number) {
        const down = wheelAttachment.WorldCFrame.UpVector.mul(-1);

        const raycastPostion = wheelAttachment.WorldPosition;
        const raycastDirection = down.mul(this.suspensionLength + this.attributes.suspensionRestLength);

        const raycastParams = new RaycastParams();
        raycastParams.FilterDescendantsInstances = [this.instance];
        raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
        raycastParams.RespectCanCollide = true;

        const result = Workspace.Raycast(raycastPostion, raycastDirection, raycastParams);
        if (!result) {
            wheelVectorForce.Force = Vector3.zero;
            return;
        }

        const length = result.Distance - this.suspensionLength;
        const displacement = this.attributes.suspensionRestLength - length;

        const velocityAtWheel = this.instance.Body.AssemblyLinearVelocity.add(this.instance.Body.AssemblyAngularVelocity.Cross(wheel.Position.sub(this.instance.Body.Position)));
        const verticalSpeed = this.instance.Body.CFrame.VectorToWorldSpace(Vector3.yAxis).Dot(velocityAtWheel);

        const springForce = displacement * this.attributes.suspensionStiffness;
        const dampingForce = verticalSpeed * this.attributes.suspensionDamping;

        const totalForce = springForce - dampingForce;
        wheelVectorForce.Force = Vector3.yAxis.mul(totalForce);
    }

    private initWheel(wheel: BasePart) {
        const attachment = new Instance("Attachment");
        attachment.Parent = this.instance.Body
        attachment.WorldPosition = wheel.Position;

        const vectorForce = new Instance("VectorForce");
        vectorForce.Force = Vector3.zero;
        vectorForce.Attachment0 = attachment;
        vectorForce.Parent = attachment;

        this.wheelInfos.set(wheel, {
            attachment,
            vectorForce,
        });
    }
}
import { BaseInterface } from "@common/shared/interfaces/components/BaseInterface";
import { Controller, OnStart } from "@flamework/core";
import { MessagesHandler } from "../interfaces/messages-handler";
import { EInterfaces } from "@PLACE_NAME/shared/data/interfaces/EInterfaces";
import { CameraController } from "./Camera.controller";
import { CommonEvents } from "@common/client/Networking";

@Controller()
export class UserInterfaceController implements OnStart {
    public readonly messagesHandler: MessagesHandler = new MessagesHandler();

    private openedInterface?: {
        name: EInterfaces,
        instance: BaseInterface
    }

    private interfacesConstructors: Record<EInterfaces, () => BaseInterface> = {
        
    }

    constructor(
        private cameraController: CameraController,
    ) {}
    
    onStart(): void {
        CommonEvents.onProfileLoaded.connect((session) => {
            /// Create HUD and any default interfaces here
        })
    }

    public openInterface(interfaceName: EInterfaces, options?: {fovFactor?: number; blurSize?: number}) {
        if (this.openedInterface?.name === interfaceName) return; /// Already opened
        if (this.openedInterface) this.closeCurrentInterface(); /// Close current interface if any

        const interfaceConstructor = this.interfacesConstructors[interfaceName];
        this.openedInterface = {
            name: interfaceName,
            instance: interfaceConstructor(),
        }
        
        this.cameraController.setInInterfaceMode(true, options);
    }

    public closeCurrentInterface(specificInterface?: EInterfaces) {
        if (!this.openedInterface) return;
        if (specificInterface && this.openedInterface.name !== specificInterface) return;

        this.openedInterface.instance.destroy();
        this.openedInterface = undefined;

        this.cameraController.setInInterfaceMode(false);
    }
}
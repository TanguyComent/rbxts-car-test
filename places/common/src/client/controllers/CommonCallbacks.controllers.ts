import { Controller, OnStart } from "@flamework/core";
import { CommonFunctions } from "../Networking";

@Controller()
export class CommonCallbacksController implements OnStart {
    onStart() {
        CommonFunctions.getUtcOffset.setCallback(() => this.getUtcOffset());
    }

    /**
     * @returns the client's offset from UTC in minutes 
     * The result MUST be clamped to the range [-720, 840] by the server
     */
    private getUtcOffset(): number {
        const utcTime = os.time(os.date('!*t'))
        const localTime = os.time(os.date('*t'))

        const offsetInSeconds = localTime - utcTime
        return offsetInSeconds / 60
    }
}
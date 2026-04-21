import { Networking } from "@flamework/networking"
import { IUserSession } from "../profileStore/model/IUserSession";

interface CommonClientToServerEvents {

}

interface CommonServerToClientEvents {
    onProfileLoaded(session: IUserSession): void;
    onFieldUpdated(field: string[], value: unknown): void;
    onFieldsUpdated(fields: Array<{ field: string[], value: unknown }>): void;
}

interface CommonClientToServerFunctions {
    isProfileLoaded(): boolean;
    getSession(): IUserSession | undefined;
}

interface CommonServerToClientFunctions {
    getUtcOffset(): number
}

export const CommonEventsDeclaration = Networking.createEvent<CommonClientToServerEvents, CommonServerToClientEvents>()
export const CommonFunctionsDeclaration = Networking.createFunction<CommonClientToServerFunctions, CommonServerToClientFunctions>()
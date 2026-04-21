import { Controller, OnStart } from "@flamework/core";
import { CommonEvents, CommonFunctions } from "../Networking";
import { LocalSessionAtom } from "../states/CommonClient.atom";
import { PathsUtils } from "@common/shared/utils/Paths.utils";
import { IUserSession } from "@common/shared/profileStore/model/IUserSession";
import { computed, subscribe } from "@rbxts/charm";
import Object from "@rbxts/object-utils";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";

@Controller()
export class LocalSessionController implements OnStart {

    onStart(): void {
        CommonEvents.onProfileLoaded.connect((session) => this.setSession(session));
        CommonEvents.onFieldUpdated.connect((field, value) => this.onFieldUpdated(field as PathsUtils.AnySessionPath, value as PathsUtils.AnySessionPathValue));
        CommonEvents.onFieldsUpdated.connect((fields) => this.onFieldsUpdated(fields as Array<{ field: PathsUtils.AnySessionPath, value: PathsUtils.AnySessionPathValue }>));
    }

    private onFieldsUpdated<P extends PathsUtils.Path<IUserSession>>(
        fields: Array<{
            field: P, 
            value: PathsUtils.PathValue<IUserSession, P> 
        }>
    ) {
        LocalSessionAtom(prev => {
            const newSession = { ...prev }
            fields.forEach(({ field, value }) => {
                PathsUtils.set(newSession, field, value)
            })
            return newSession;
        })
    }

    private onFieldUpdated<P extends PathsUtils.Path<IUserSession>>(
        field: P, 
        value: PathsUtils.PathValue<IUserSession, P>
    ) {
        LocalSessionAtom(prev => {
            const newSession = { ...prev }
            PathsUtils.set(newSession, field, value)
            return newSession;
        })
    }

    private setSession(session: IUserSession) {
        session.boughtGamePasses = Object.entries(session.boughtGamePasses).reduce((acc, [gamePass, data]) => {
            acc[tonumber(gamePass) as EGamePasses] = data;
            return acc;
        }, {} as Partial<Record<string, { owned: boolean }>>);

        LocalSessionAtom(session);
    }
}
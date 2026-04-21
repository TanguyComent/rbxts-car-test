import { Janitor } from "@rbxts/janitor";
import ProfileStore from "@rbxts/profile-store";
import { MarketplaceService, Players } from "@rbxts/services";
import { UserTemplate } from "@common/shared/profileStore/UserTemplate";
import Signal from "@rbxts/signal"
import { IS_DEVELOP } from "@common/shared/GlobalConfig"
import { CommonEvents, CommonFunctions } from "../Networking"
import { OnStart, OnTick, Service } from "@flamework/core"
import { LastRemoteDataType, Migrator } from "../migrations/MigrationManager";
import Object, { deepCopy } from "@rbxts/object-utils";
import { IUserSession } from "@common/shared/profileStore/model/IUserSession";
import { PathsUtils } from "@common/shared/utils/Paths.utils";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";

@Service()
export class ProfilesService implements OnStart, OnTick {
    janitor = new Janitor()
    userStore = ProfileStore.New(`${IS_DEVELOP ? "DEVELOP" : "RELEASE"}-User-Profiles`, UserTemplate);
    profiles = new Map<number, ProfileStore.Profile<LastRemoteDataType, object>>()
    playerSessionMap = new Map<number, IUserSession>();
    onLastSave = new Signal<(player: Player, reason: "Manual" | "External" | "Shutdown") => void>();

    onProfileLoaded = new Signal<(player: Player) => void>();
    onProfileUpdated = new Signal<(player: Player, newProfile: IUserSession) => void>();

    onStart() {
        for (const player of Players.GetPlayers()) {
            this.onPlayerAdded(player);
        }

        const playerAdded = Players.PlayerAdded.Connect((player) => this.onPlayerAdded(player));
        const playerRemoving = Players.PlayerRemoving.Connect((player) => this.onPlayerRemoved(player));

        this.janitor.Add(playerAdded, "Disconnect");
        this.janitor.Add(playerRemoving, "Disconnect");

        CommonFunctions.isProfileLoaded.setCallback((player) => this.isProfileLoaded(player))
        CommonFunctions.getSession.setCallback((player) => this.getPlayerSession(player.UserId))
    }

    onTick(dt: number): void {
        for (const [userId] of this.playerSessionMap) {
            this.updateField(userId, ["globalStats", "playTime"], (playTime) => playTime + dt, false)
        }
    }

    private transformRemoteDataToSession(remoteData: LastRemoteDataType): IUserSession {
        return {
            currency: remoteData.currency,
            UtcLastConnection: remoteData.UtcLastConnection,
            UtcOffset: remoteData.UtcOffset,
            dailyStats: remoteData.dailyStats,
            globalStats: remoteData.globalStats,
            boughtGamePasses: remoteData.boughtGamePasses,
            purchases: remoteData.purchases
        }
    }

    private transformSessionToRemoteData(session: IUserSession): LastRemoteDataType {
        return {
            currentVersion: 1,
            currency: session.currency,
            UtcLastConnection: session.UtcLastConnection,
            UtcOffset: session.UtcOffset,
            dailyStats: session.dailyStats,
            globalStats: session.globalStats,
            boughtGamePasses: session.boughtGamePasses,
            purchases: session.purchases,
        }
    }

    private onPlayerAdded(player: Player) {
        if (this.profiles.has(player.UserId)) return;
        const profile = this.userStore.StartSessionAsync(tostring(player.UserId), {Cancel: () => player.Parent !== Players});
        const profileJanitor = new Janitor();
        if (!profile) {
            warn(`Failed to load profile for player ${player.Name} (${player.UserId})`);
            player.Kick("Failed to load profile.");
            return
        }

        profile.AddUserId(player.UserId);
        profile.Data = Migrator.migrate(profile.Data);
        const lastSaveConnection = profile.OnLastSave.Connect((reason) => this.onLastSave.Fire(player, reason))
        profileJanitor.Add(lastSaveConnection, "Disconnect")
        this.profiles.set(player.UserId, profile);
        
        const sessionEndConnection = profile.OnSessionEnd.Connect(() => {
            this.onSessionEnd(player)
            profileJanitor.Destroy();
        })
        profileJanitor.Add(sessionEndConnection, "Disconnect")

        const saveConnection = profile.OnSave.Connect(() => this.beforeProfileSave(player))
        profileJanitor.Add(saveConnection, "Disconnect")

        if (player.Parent !== Players) {
            profile.EndSession()
        }
        
        this.setPlayerSession(player.UserId, this.transformRemoteDataToSession(profile.Data))
        
        const playerSession = this.getPlayerSession(player.UserId)
        if (!playerSession) {
            player.Kick("Failed to initialize session.");
            return;
        }
        
        this.tryResetDailyStats(player);
        this.reloadOwnedGamePasses(player);
        this.onProfileLoaded.Fire(player);
        print(`Profile loaded for player ${player.Name}`);
        CommonEvents.onProfileLoaded.fire(player, playerSession)
    }


    private onPlayerRemoved(player: Player) {
        const profile = this.profiles.get(player.UserId);
        
        if (profile) {
            profile.EndSession();
            this.profiles.delete(player.UserId);
        }
    }

    private beforeProfileSave(player: Player) {
        const profile = this.profiles.get(player.UserId);
        if (!profile) return;

        const session = this.getPlayerSession(player.UserId)
        if (!session) return;

        profile.Data = this.transformSessionToRemoteData(session);
    }

    private onSessionEnd(player: Player) {
        this.tryResetDailyStats(player)
        const profile = this.profiles.get(player.UserId);
        
        if (profile) {
            profile.EndSession();
        }

        this.playerSessionMap.delete(player.UserId);
    }

    isProfileLoaded(player: Player): boolean {
        return this.playerSessionMap.has(player.UserId);
    }

    setPlayerSession(playerId: number, data: IUserSession) {
        this.playerSessionMap.set(playerId, data);
    }

    getPlayerSession(playerId: number): IUserSession | undefined {
        const session = this.playerSessionMap.get(playerId) ? deepCopy(this.playerSessionMap.get(playerId)!) : undefined;
        return session;
    }

    updateField<P extends PathsUtils.Path<IUserSession>>(
        playerId: number,
        path: P,
        provider: (value: PathsUtils.PathValue<IUserSession, P>) => PathsUtils.PathValue<IUserSession, P>,
        refreshClient = true
    ) {
        const data = this.getPlayerSession(playerId);
        if (!data) return false;

        const currentValue = PathsUtils.get(data, path);
        const newValue = provider(currentValue);
        PathsUtils.set(data, path, newValue);
        this.setPlayerSession(playerId, data);

        if (refreshClient) {
            const player = Players.GetPlayerByUserId(playerId);
            if (!player) return false;
            CommonEvents.onFieldUpdated.fire(player, path as string[], newValue);
        }
        
        return true
    }

    updateFields<P extends PathsUtils.Path<IUserSession>>(
        playerId: number,
        fields: Array<{
            path: P,
            provider: (value: PathsUtils.PathValue<IUserSession, P>) => PathsUtils.PathValue<IUserSession, P>
        }>,
        refreshClient = true
    ) {
        const data = this.getPlayerSession(playerId);
        if (!data) return false;

        for (const { path, provider } of fields) {
            const currentValue = PathsUtils.get(data, path);
            const newValue = provider(currentValue);
            PathsUtils.set(data, path, newValue);
        }

        this.setPlayerSession(playerId, data);

        if (refreshClient) {
            const player = Players.GetPlayerByUserId(playerId);
            if (!player) return false;
            CommonEvents.onFieldsUpdated.fire(player, fields.map(({ path }) => {
                return {
                    field: path as string[],
                    value: PathsUtils.get(data, path)!
                }
            }));
        }
        
        return true;
    }

    setField<P extends PathsUtils.Path<IUserSession>>(
        playerId: number,
        field: P,
        value: PathsUtils.PathValue<IUserSession, P>,
        refreshClient = true
    ) {
        return this.updateField(playerId, field, () => value, refreshClient);
    }

    setFields<P extends PathsUtils.Path<IUserSession>>(
        playerId: number,
        fields: Array<{
            field: P,
            value: PathsUtils.PathValue<IUserSession, P>
        }>,
        refreshClient = true
    ) {
        return this.updateFields(playerId, fields.map(({ field, value}) => {
            return {
                path: field,
                provider: () => value
            }
        }), refreshClient);
    }

    getField<P extends PathsUtils.Path<IUserSession>>(
        playerId: number,
        field: P
    ): PathsUtils.PathValue<IUserSession, P> | undefined {
        const data = this.getPlayerSession(playerId);
        if (!data) return undefined;
        return PathsUtils.get(data, field);
    }

    private reloadOwnedGamePasses(player: Player) {
        const playerSession = this.getPlayerSession(player.UserId);
        if (!playerSession) return;

        for (const gamePassId of Object.values(EGamePasses)) {
            const hasPass = playerSession.boughtGamePasses[gamePassId as EGamePasses]?.owned === true;
            if (hasPass) continue; /// The player already has the pass, no need to check with Roblox API
            
            const ownsPass = MarketplaceService.UserOwnsGamePassAsync(player.UserId, gamePassId);
            if (ownsPass) {
                this.updateField(player.UserId, ["boughtGamePasses"], (prev) => {
                    return {
                        ...prev,
                        [gamePassId as EGamePasses]: {
                            owned: true
                        }
                    }
                });
            }
        }
    }

    private tryResetDailyStats(player: Player) {        
        const utcLastConnection = this.getField(player.UserId, ["UtcLastConnection"]) 
        if (utcLastConnection === undefined) {
            this.actualizeUtcOffset(player.UserId)
            this.actualizeLastConnectionDate(player.UserId)
            return
        }

        const utcOffset = this.getField(player.UserId, ["UtcOffset"])
        if (utcOffset === undefined) {
            this.actualizeUtcOffset(player.UserId)
            this.actualizeLastConnectionDate(player.UserId)
            return
        }

        const offsetInSeconds = utcOffset * 60
        const localizedLastConnectionDate = DateTime.fromUnixTimestamp(utcLastConnection + offsetInSeconds).ToUniversalTime()
        const currentLocalizedDate = DateTime.fromUnixTimestamp(DateTime.now().UnixTimestamp + offsetInSeconds).ToUniversalTime()

        const normalizedLastConnectionTimeStamp = DateTime.fromUniversalTime(localizedLastConnectionDate.Year, localizedLastConnectionDate.Month, localizedLastConnectionDate.Day, 0, 0, 0)
        const normalizedCurrentTimeStamp = DateTime.fromUniversalTime(currentLocalizedDate.Year, currentLocalizedDate.Month, currentLocalizedDate.Day, 0, 0, 0)

        this.actualizeLastConnectionDate(player.UserId)

        const hasBeenConnectedToday = normalizedLastConnectionTimeStamp.UnixTimestamp === normalizedCurrentTimeStamp.UnixTimestamp
        if (hasBeenConnectedToday) return

        const hasBrokenConnectionStreak = (normalizedCurrentTimeStamp.UnixTimestamp - 24 * 60 * 60) !== normalizedLastConnectionTimeStamp.UnixTimestamp
        if (hasBrokenConnectionStreak) {
            this.actualizeUtcOffset(player.UserId)
        }

        this.resetDailyStats(player.UserId)
    }

    private resetDailyStats(userId: number) {
        this.setField(userId, ["dailyStats"], deepCopy(UserTemplate.dailyStats));
    }

    private actualizeLastConnectionDate(userId: number) {
        this.setField(userId, ["UtcLastConnection"], os.time(os.date('!*t')));
    }

    private actualizeUtcOffset(playerId: number) {
        const player = Players.GetPlayerByUserId(playerId)
        if (player === undefined) return

        CommonFunctions.getUtcOffset(player).then((offset) => {
            const clampedOffset = math.clamp(offset, -720, 840)
            this.updateField(playerId, ["UtcOffset"], () => clampedOffset)
        })
    }
}
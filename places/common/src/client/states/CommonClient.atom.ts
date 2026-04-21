import { IUserSession } from "@common/shared/profileStore/model/IUserSession"
import { Atom, atom } from "@rbxts/charm"

const defaultProfile: IUserSession = {
    currency: 0,
    dailyStats: {},
    UtcLastConnection: 0,
    UtcOffset: 0,
    globalStats: {
        playTime: 0,
        totalCurrencyEarned: 0,
    },
    boughtGamePasses: {},
    purchases: []
}

export const LocalSessionAtom: Atom<IUserSession> = atom(defaultProfile)
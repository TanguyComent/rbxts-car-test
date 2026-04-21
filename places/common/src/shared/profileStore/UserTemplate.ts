import { LastRemoteDataType } from "@common/server/migrations/MigrationManager";

export const UserTemplate: LastRemoteDataType = {
    currentVersion: 1,
    currency: 0,
    UtcLastConnection: undefined,
    UtcOffset: undefined,
    dailyStats: {},
    globalStats: {
        totalCurrencyEarned: 0,
        playTime: 0
    },
    boughtGamePasses: {},
    purchases: []
}
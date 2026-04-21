import { EGamePasses } from "@common/shared/marketplace/EGamePasses";

export interface IRemoteUserDataV1 {
    currentVersion: 1;
    UtcLastConnection: number | undefined;
    UtcOffset: number | undefined;
    currency: number;
    dailyStats: IDailyStatsV1;
    globalStats: IGlobalStatsV1;
    boughtGamePasses: Partial<Record<EGamePasses, IBoughtGamePasseV1>>;
    purchases: IPurchaseV1[];
}

export interface IDailyStatsV1 {
    
}

export interface IGlobalStatsV1 {
    totalCurrencyEarned: number;
    playTime: number;
}

export interface IBoughtGamePasseV1 {
    owned: boolean;
}

export interface IPurchaseV1 {
    productId: number;
    robuxSpent: number;
    success: boolean;
}
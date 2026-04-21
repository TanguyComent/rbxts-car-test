import { EGamePasses } from "@common/shared/marketplace/EGamePasses";

export interface IUserSession {
    UtcLastConnection: number | undefined;
    UtcOffset: number | undefined;
    currency: number;
    dailyStats: IDailyStats;
    globalStats: IGlobalStats;
    boughtGamePasses: Partial<Record<EGamePasses, IBoughtGamePasse>>;
    purchases: IPurchase[];
}

export interface IDailyStats {

}

export interface IGlobalStats {
    totalCurrencyEarned: number;
    playTime: number;
}

export interface IBoughtGamePasse {
    owned: boolean;
}

export interface IPurchase {
    productId: number;
    robuxSpent: number;
    success: boolean;
}
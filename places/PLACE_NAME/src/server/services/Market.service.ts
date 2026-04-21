import { OnStart, Service } from "@flamework/core";
import { PlayerService } from "./Player.service";
import { MarketplaceService, Players } from "@rbxts/services";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";

@Service()
export class MarketService implements OnStart {
    
    private purchaseCallbacks: Record<number, (player: Player, receiptInfo: ReceiptInfo) => Enum.ProductPurchaseDecision> = {

    } 

    constructor(
        private playerService: PlayerService
    ) {}

    onStart(): void {
        MarketplaceService.ProcessReceipt = (receiptInfo) => this.processPurchase(receiptInfo);
        MarketplaceService.PromptGamePassPurchaseFinished.Connect((player, gamePassId, wasPurchased) => {
            if (!wasPurchased) return;
            this.playerService.addGamePass(player.UserId, gamePassId as EGamePasses)
        })
    } 

    /* Award callbacks definitions */



    /* Utility */

    private validatePurchase(receiptInfo: ReceiptInfo, success: boolean): Enum.ProductPurchaseDecision {
        this.playerService.logPurchase(receiptInfo.PlayerId, receiptInfo.ProductId, receiptInfo.CurrencySpent, success);
        if (success) {
            return Enum.ProductPurchaseDecision.PurchaseGranted;
        } else {
            return Enum.ProductPurchaseDecision.NotProcessedYet;
        }
    }

    private processPurchase(receiptInfo: ReceiptInfo): Enum.ProductPurchaseDecision {
        try {
            const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);
            if (!player) return this.validatePurchase(receiptInfo, false);

            const callback = this.purchaseCallbacks[receiptInfo.ProductId];
            if (callback) return callback(player, receiptInfo);

            warn(`The product with the id ${receiptInfo.ProductId} is not treated in the receipt processor.`);
			return this.validatePurchase(receiptInfo, false);
        } catch (e) {
            warn(`Error processing purchase for product ${receiptInfo.ProductId}: ${tostring(e)}`)
            return this.validatePurchase(receiptInfo, false);
        }
    }
}
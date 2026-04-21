import { OnStart, Service } from "@flamework/core";
import { ProfilesService } from "./Profile.service";
import Object, { values } from "@rbxts/object-utils";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";
import { MarketplaceService } from "@rbxts/services";
import { IPurchase } from "@common/shared/profileStore/model/IUserSession";

@Service()
export class PlayerService implements OnStart {
    
    constructor(
        private profileService: ProfilesService
    ) {}

    onStart(): void {}

    public logPurchase(userId: number, productId: number, robuxSpent: number, success: boolean) {
        return this.profileService.updateField(userId, ["purchases"], (prev) => {
            const newPurchase: IPurchase = { productId, robuxSpent, success }
            return [ ...prev, newPurchase ]
        }, false)
    }

    public addGamePass(userId: number, gamePass: EGamePasses) {
        return this.profileService.updateField(userId, ["boughtGamePasses", gamePass], (prev) => {
            return {
                owned: true
            }
        })
    }
}
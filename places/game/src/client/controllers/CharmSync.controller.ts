import { GamePassPricesAtom } from "@common/shared/atom/GamePassPrices.atom";
import { DevProductsPricesAtom } from "@common/shared/atom/ProductPrices.atom";
import { EDevProducts } from "@common/shared/marketplace/EDevProducts";
import { EGamePasses } from "@common/shared/marketplace/EGamePasses";
import { Controller, OnStart } from "@flamework/core";
import { Events } from "@game/client/Networking";
import { sharedAtoms } from "@game/shared/atoms/SharedAtoms";
import CharmSync from "@rbxts/charm-sync";
import Object from "@rbxts/object-utils";

@Controller()
export class CharmSyncController implements OnStart {
    public onStart(): void {
        const syncer = CharmSync.client({
            atoms: sharedAtoms
        })
        
        Events.dispatch.connect((payload) => {
            syncer.sync(payload as any)
            this.onProductPriceUpdate();
            this.onGamePassPriceUpdate();
        })
        
        Events.syncerLoaded.fire()
    }

    private onProductPriceUpdate() {
        DevProductsPricesAtom((old) => {
            return Object.entries(old).reduce((acc, [devProduct, priceInfo]) => {
                acc[tonumber(devProduct) as EDevProducts] = priceInfo;
                return acc;
            }, {} as Record<EDevProducts, { price: number; initialized: boolean }>)
        })
    }

    private onGamePassPriceUpdate() {
        GamePassPricesAtom((old) => {
            return Object.entries(old).reduce((acc, [gamePass, priceInfo]) => {
                acc[tonumber(gamePass) as EGamePasses] = priceInfo;
                return acc;
            }, {} as Record<EGamePasses, { price: number; initialized: boolean }>)
        })
    }
}

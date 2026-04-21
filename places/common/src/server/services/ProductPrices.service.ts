import { EDevProducts } from "@common/shared/marketplace/EDevProducts"
import { OnTick, Service } from "@flamework/core"
import { peek } from "@rbxts/charm"
import Object from "@rbxts/object-utils"
import { MarketplaceService } from "@rbxts/services"
import { EGamePasses } from "@common/shared/marketplace/EGamePasses"
import { DevProductsPricesAtom } from "@common/shared/atom/ProductPrices.atom"
import { GamePassPricesAtom } from "@common/shared/atom/GamePassPrices.atom"

@Service()
export class ProductPricesService implements OnTick {
    private allProductFetched: boolean = false;
    private allPassesFetched: boolean = false;

    private fetchInterval: number = 30; // seconds
    private lastFetchAttempt: number = this.fetchInterval;

    onTick(dt: number): void {
        if (this.allPassesFetched && this.allProductFetched) return;
        this.lastFetchAttempt += dt;

        if (this.lastFetchAttempt >= this.fetchInterval) {
            this.lastFetchAttempt = 0;
            
            if (!this.allProductFetched) {
                this.fetchProductsPrices();
            }

            if (!this.allPassesFetched) {
                this.fetchPassesPrices();
            }
        }
    }

    private fetchProductsPrices() {
        const productsInfo = peek(DevProductsPricesAtom)
        let allProductInitialized = true;

        for (const devProduct of Object.values(EDevProducts)) {
            if (productsInfo[devProduct].initialized) continue;
            try {
                const productInfo = MarketplaceService.GetProductInfo(devProduct, Enum.InfoType.Product);
                if (productInfo.PriceInRobux !== undefined) {
                    const price = productInfo.PriceInRobux;
                    DevProductsPricesAtom((old) => {
                        return {
                            ...old,
                            [devProduct]: {
                                price: price,
                                initialized: true,
                            }
                        }
                    })
                } else {
                    allProductInitialized = false;
                }
            } catch {
                print(`Failed to fetch product info for dev product id ${devProduct}`);
                allProductInitialized = false;
            }
        }

        this.allProductFetched = allProductInitialized;
    }

    private fetchPassesPrices() {
        const passesInfo = peek(GamePassPricesAtom)
        let allPassesInitialized = true;

        for (const devProduct of Object.values(EGamePasses)) {
            if (passesInfo[devProduct].initialized) continue;
            try {
                const productInfo = MarketplaceService.GetProductInfo(devProduct, Enum.InfoType.GamePass);
                if (productInfo.PriceInRobux !== undefined) {
                    const price = productInfo.PriceInRobux;
                    GamePassPricesAtom((old) => {
                        return {
                            ...old,
                            [devProduct]: {
                                price: price,
                                initialized: true,
                            }
                        }
                    })
                } else {
                    allPassesInitialized = false;
                }
            } catch {
                print(`Failed to fetch product info for game pass id ${devProduct}`);
                allPassesInitialized = false;
            }
        }

        this.allPassesFetched = allPassesInitialized;
    }
}
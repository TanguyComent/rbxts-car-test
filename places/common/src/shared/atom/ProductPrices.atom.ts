import Object from "@rbxts/object-utils"
import { EDevProducts } from "../marketplace/EDevProducts"
import { atom, Atom } from "@rbxts/charm"

interface IDevProductPrice {
    price: number;
    initialized: boolean;
}

function createDefaultDevProductPrices(): Record<EDevProducts, IDevProductPrice> {
    return Object.values(EDevProducts).reduce((acc, devProduct) => {
        acc[devProduct] = {
            price: 99,
            initialized: false,
        }

        return acc;
    }, {} as Record<EDevProducts, IDevProductPrice>);
}

export const DevProductsPricesAtom: Atom<Record<EDevProducts, IDevProductPrice>> = atom(createDefaultDevProductPrices());
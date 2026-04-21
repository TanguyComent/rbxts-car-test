import Object from "@rbxts/object-utils"
import { EGamePasses } from "../marketplace/EGamePasses"
import { atom, Atom } from "@rbxts/charm"

interface IGamePassPrice {
    price: number;
    initialized: boolean;
}

function createDefaultGamePassPrices(): Record<EGamePasses, IGamePassPrice> {
    return Object.values(EGamePasses).reduce((acc, gamePass) => {
        acc[gamePass] = {
            price: 99,
            initialized: false,
        }

        return acc;
    }, {} as Record<EGamePasses, IGamePassPrice>);
}

export const GamePassPricesAtom: Atom<Record<EGamePasses, IGamePassPrice>> = atom(createDefaultGamePassPrices());
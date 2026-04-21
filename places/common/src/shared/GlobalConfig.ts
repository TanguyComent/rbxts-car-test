import { RunService } from "@rbxts/services"

export const RELEASE_PLACE_ID = -1 /// Replace with your actual release place ID
export const DEVELOP_PLACE_ID = -1 /// Replace with your actual develop place ID

export const GAME_VERSION = "0.0.1"

export const IS_STUDIO = RunService.IsStudio()
export const IS_RELEASE = !IS_STUDIO && (game.PlaceId === RELEASE_PLACE_ID)
export const IS_DEVELOP = IS_STUDIO || (game.PlaceId === DEVELOP_PLACE_ID)

export const BACKPACK_CAPACITY = 300;
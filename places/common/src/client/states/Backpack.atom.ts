import { atom, computed } from "@rbxts/charm"
import React from "@rbxts/react"

export interface IBackpackItem {
    uuid: string;
    tool: Tool;
}

export interface IBackpackState {
    dragContext: "hotbar" | "inventory" | undefined;
    isOpened: boolean;
    items: IBackpackItem[];
    hotBarItems: (IBackpackItem | "empty")[];
    equippedItem?: IBackpackItem;
    searchbarText?: string;

    draggedItem?: {
        item: IBackpackItem;
        dragInitialPosition: Vector2;
        dragOffset: UDim2;
        draggedItemChildren: React.ReactNode;
    }

    hoveredItem?: {
        item: IBackpackItem;
        instance: GuiObject;
    }
} 

const defaultState: IBackpackState = {
    dragContext: undefined,
    isOpened: false,
    items: [],
    hotBarItems: [],
}

export const BackpackAtom = atom<IBackpackState>(defaultState);

export const backpackSearchbarTextSelector = computed(() => BackpackAtom().searchbarText);
export const backpackHoveredItemSelector = computed(() => BackpackAtom().hoveredItem);
export const backpackDragInformationsSelector = computed(() => BackpackAtom().draggedItem);
export const backpackDragContextSelector = computed(() => BackpackAtom().dragContext);
export const backpackHotbarItemsSelector = computed(() => BackpackAtom().hotBarItems);
export const backpackItemsSelector = computed(() => BackpackAtom().items);
export const backpackOpenedSelector = computed(() => BackpackAtom().isOpened);
export const backpackEquippedItemSelector = computed(() => BackpackAtom().equippedItem);
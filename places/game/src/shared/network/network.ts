import { Networking } from "@flamework/networking"

interface ClientToServerEvents {
    syncerLoaded: () => void
}

interface ServerToClientEvents {
    dispatch: (payload: unknown) => void,
}

interface ClientToServerFunctions {

}

interface ServerToClientFunctions {

}

export const EventsDeclaration = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>()
export const FunctionsDeclaration = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>()

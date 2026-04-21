import { OnStart, Service } from "@flamework/core"
import { sharedAtoms } from "@game/shared/atoms/SharedAtoms"
import CharmSync from "@rbxts/charm-sync"
import { Events } from "../Networking"

@Service()
export class CharmSyncService implements OnStart {
    onStart(): void {
        const syncer = CharmSync.server({
            atoms: sharedAtoms,
            preserveHistory: false,
        })

        syncer.connect((player, payload) => {
            Events.dispatch.fire(player, payload)
        })

        Events.syncerLoaded.connect((player) => {
            syncer.hydrate(player)
        })
    }
}

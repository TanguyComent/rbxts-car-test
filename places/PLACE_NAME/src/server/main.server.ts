import { Flamework } from "@flamework/core"
import { GAME_VERSION } from "@common/shared/GlobalConfig";

print(`Server stating in version ${GAME_VERSION}`)

/// Flamework initialization
Flamework.addPaths("places/PLACE_NAME/src/server/services")
Flamework.addPaths("places/PLACE_NAME/src/server/components")
Flamework.addPaths("places/common/src/server/services")
Flamework.addPaths("places/common/src/server/components")
Flamework.addPaths("places/common/src/shared/components")

Flamework.ignite()

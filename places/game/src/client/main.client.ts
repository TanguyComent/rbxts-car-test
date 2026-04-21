import { Flamework } from "@flamework/core"

/// Flamework initialization
Flamework.addPaths("places/game/src/client/controllers")
Flamework.addPaths("places/game/src/client/components")
Flamework.addPaths("places/common/src/client/controllers")
Flamework.addPaths("places/common/src/client/components")
Flamework.addPaths("places/common/src/shared/components")

Flamework.ignite()

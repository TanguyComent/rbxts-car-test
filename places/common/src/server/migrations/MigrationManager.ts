import { IRemoteUserDataV1 } from "@common/server/migrations/V1/IUserDataV1"
import { MigrationManager } from "./MigrationManager.class"

export type LastRemoteDataType = IRemoteUserDataV1;
export const Migrator = new MigrationManager<LastRemoteDataType>();
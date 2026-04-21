import { values } from "@rbxts/object-utils";

export interface IMigratable {
    currentVersion: number;
}

export type Migration<From extends IMigratable, To extends IMigratable> = {
    from: number;
    migrate: (data: From) => To;
};

export class MigrationManager<FinalData extends IMigratable> {
    private migrations = new Map<number, Migration<IMigratable, IMigratable>>();

    register<From extends IMigratable, To extends IMigratable>(
        migration: Migration<From, To>
    ) {
        if (this.migrations.has(migration.from)) {
            throw `Migration already registered for version ${migration.from}`;
        }

        this.migrations.set(
            migration.from,
            migration as unknown as Migration<IMigratable, IMigratable>
        );
    }

    migrate(data: IMigratable): FinalData {
        let current: IMigratable = data;

        while (true) {
            const migration = this.migrations.get(current.currentVersion);
            if (!migration) break;

            current = migration.migrate(current);
        }

        return current as FinalData;
    }

    getLastDataVersion(): number {
        let version = 0;
        
        for (const migration of values(this.migrations)) {
            if (migration.from > version) {
                version = migration.from;
            }
        }

        return version;
    }
}

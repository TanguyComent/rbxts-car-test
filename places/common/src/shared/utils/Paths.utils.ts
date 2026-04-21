import { IUserSession } from "../profileStore/model/IUserSession";

export namespace PathsUtils {
    export type AnySessionPath = Path<IUserSession>;
    export type AnySessionPathValue = PathValue<IUserSession, AnySessionPath>;

	export type Path<T> =
		T extends object
			? {
                [K in keyof T]:
                    [K] | [K, ...Path<T[K]>]
			  }[keyof T]
			: [];

    export type PathValue<T, P> =
        P extends [infer K, ...infer R]
            ? K extends keyof T
                ? R extends []
                    ? T[K]
                    : PathValue<T[K], R>
                : never
            : never;

    export function set<
        T,
        P extends Path<T>
    >(
        root: T,
        path: P,
        value: PathValue<T, P>
    ) {
        let obj: unknown = root;

        for (let i = 0; i < path.size() - 1; i++) {
            const key = path[i] as keyof typeof obj;
            obj = (obj as {})[key];
        }

        const lastKey = path[path.size() - 1] as keyof typeof obj;
        (obj as any)[lastKey] = value;
    }

	export function get<T, P extends PathsUtils.Path<T>>(
        root: T,
        path: P
    ): PathsUtils.PathValue<T, P> {

        let obj: unknown = root;

        for (const key of path as (string | number)[]) {
            const k = key as unknown as keyof typeof obj;
            obj = (obj as {})[k];
        }

        return obj as PathsUtils.PathValue<T, P>;
    }
}
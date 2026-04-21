import { Janitor } from "@rbxts/janitor";
import React from "@rbxts/react";

interface EmptyParentGetterProps<ParentClassName extends keyof Objects> {
    enabled?: boolean;
    parentClassName: ParentClassName;
    onReady: (parent: Objects[ParentClassName], janitor: Janitor) => void;
}

export function EmptyParentGetter<ParentClassName extends keyof Objects>({ enabled, parentClassName, onReady }: EmptyParentGetterProps<ParentClassName>) {
    const ref = React.useRef<Folder>();

    React.useEffect(() => {
        if (!enabled) return;
        if (!ref.current) return;

        const janitor = new Janitor();
        const parent = ref.current.Parent;
        if (parent && parent.IsA(parentClassName)) {
            onReady(parent, janitor);
        }

        return () => janitor.Destroy()
    }, [ref.current, enabled, parentClassName])

    return (<folder ref={ref} />)
}
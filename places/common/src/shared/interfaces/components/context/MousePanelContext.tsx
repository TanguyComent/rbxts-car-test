import { useMouse } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import ReactRoblox, { createRoot } from "@rbxts/react-roblox";

export interface MousePanelContextApi {
    setMountedTree: (key: string, tree: React.InstanceProps<Frame>, zIndex?: number) => void;
    clearMountedTree: (key: string) => void;
    destroy: () => void;
}

export function createMousePanelContextApi(container: Instance): MousePanelContextApi {
    let mountedTreeKey: string | undefined = undefined;
    const root: ReactRoblox.Root = createRoot(container);

    const setMountedTree = (key: string, tree: React.InstanceProps<Frame>, zIndex?: number) => {
        if (mountedTreeKey === key) return;
        
        mountedTreeKey = key;
        root.unmount();
        root.render((
            <MousePanelComponent {...tree} />
        ));
    }

    const clearMountedTree = (key: string) => {
        if (mountedTreeKey !== key) return;

        mountedTreeKey = undefined;
        root.unmount();
    }

    const destroy = () => {
        mountedTreeKey = undefined;
        root.unmount();
    }

    return {
        setMountedTree,
        clearMountedTree,
        destroy,
    }
}

interface MousePanelComponentProps extends React.InstanceProps<Frame> {}
function MousePanelComponent(props: MousePanelComponentProps) {
    const usableProps = { ...props };
    const mousePosition = useMouse();

    const children = usableProps.children;
    delete usableProps.children;

    const ZIndex = props.ZIndex ?? 100_000
    delete usableProps.ZIndex;

    return (
        <frame
            {...usableProps}
            Position={mousePosition.map(value => new UDim2(0, value.X, 0, value.Y))}
            ZIndex={ZIndex}
        >
            {children}
        </frame>
    )
}
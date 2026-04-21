import React, { useEffect } from "@rbxts/react";
import { createScaleApi, ScaleApi } from "./ScaleContext";
import { useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { createRotationApi, RotationApi } from "./RotationContext";
import { createMousePanelContextApi, MousePanelContextApi } from "./MousePanelContext";

export interface EffectsContextValue {
    getScaleApi: (parent: GuiObject) => ScaleApi;
    getRotationApi: (parent: GuiObject) => RotationApi;
    mousePanelApi?: MousePanelContextApi;
}

export const EffectsContext = React.createContext<EffectsContextValue | undefined>(undefined);
interface EffectsProviderProps extends React.PropsWithChildren {
    container: GuiBase;
}

export function EffectsProvider(props: EffectsProviderProps) {
    const scaleApisRef = React.useRef<Map<GuiObject, ScaleApi>>(new Map());
    const rotationApisRef = React.useRef<Map<GuiObject, RotationApi>>(new Map());
    const [mousePanelApi, setMousePanelApi] = React.useState<MousePanelContextApi>();

    useEffect(() => {
        const mousePanelMount = new Instance("Folder");
        mousePanelMount.Name = "MousePanelMount";
        mousePanelMount.Parent = props.container;

        const mousePanelContextApi = createMousePanelContextApi(mousePanelMount);
        setMousePanelApi(mousePanelContextApi);

        return () => {
            mousePanelContextApi.destroy();
            setMousePanelApi(undefined);
            mousePanelMount.Destroy();
        };
    }, [props.container]);

    const getScaleApi = React.useCallback((parent: GuiObject): ScaleApi => {
        const scaleApis = scaleApisRef.current;
        let api = scaleApis.get(parent);

        if (!api) {
            const newApi = createScaleApi(parent);
            api = newApi;
            scaleApis.set(parent, newApi);

            parent.Destroying.Connect(() => {
                scaleApisRef.current.delete(parent);
            })
        }

        return api;
    }, [])

    const getRotationApi = React.useCallback((parent: GuiObject): RotationApi => {
        const rotationApis = rotationApisRef.current;
        let api = rotationApis.get(parent);

        if (!api) {
            const newApi = createRotationApi(parent);
            api = newApi;
            rotationApis.set(parent, newApi);

            parent.Destroying.Connect(() => {
                rotationApisRef.current.delete(parent);
            })
        }

        return api;
    }, [])

    useUnmountEffect(() => {
        scaleApisRef.current.clear();
        rotationApisRef.current.clear();
    })

    const contextValue: EffectsContextValue = React.useMemo(() => {
        return {
            getScaleApi,
            getRotationApi,
            mousePanelApi,
        }
    }, [getScaleApi, getRotationApi, mousePanelApi]);

    return (
        <EffectsContext.Provider value={contextValue}>
            {props.children}
        </EffectsContext.Provider>
    )
}
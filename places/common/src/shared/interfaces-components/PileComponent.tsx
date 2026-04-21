import React, { Fragment } from "@rbxts/react";
import { GenerateUUID } from "../utils/GenerateUUID.utils"
import { DestroyMethod } from "../utils/TypeWrapper.utils"

export interface PileManager<ChildInterface> {
    createChild: (childDatum: ChildInterface) => DestroyMethod
}

interface PileComponentProps<ChildInterface> {
    parentComponent: (children: React.ReactNode) => React.ReactElement;
    childComponent: (childDatum: ChildInterface & { index: number, childrenCount: number }, destroySelf: DestroyMethod) => React.ReactElement;
    onReady: (manager: PileManager<ChildInterface>) => void;
}

export function PileComponent<ChildInterface extends {}>(
    { parentComponent, childComponent, onReady }: PileComponentProps<ChildInterface>
) {
    const [children, setChildren] = React.useState<{
        id: string;
        childDatum: ChildInterface;
    }[]>([])

    React.useEffect(() => {
        onReady({
            createChild: (childDatum: ChildInterface) => {
                const id = GenerateUUID.generateHexSegment(16);
                setChildren((oldChildren) => [...oldChildren, {id, childDatum}]);
                return () => {
                    setChildren((oldChildren) => oldChildren.filter(c => c.id !== id))
                }
            }
        })
    }, [])

    return (
        parentComponent(
            children.map(({id, childDatum}, index) => {
                return <Fragment key={id} >
                    {childComponent({...childDatum, index, childrenCount: children.size()}, () => {
                        setChildren((oldChildren) => oldChildren.filter(c => c.id !== id))
                    })}
                </Fragment>
            })
        )
    )
}
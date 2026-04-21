import { GenerateUUID } from "@common/shared/utils/GenerateUUID.utils";
import { DestroyMethod } from "@common/shared/utils/TypeWrapper.utils";
import React, { Fragment } from "@rbxts/react";

export interface PileManager<ChildInterface> {
	createChild: (childDatum: ChildInterface) => DestroyMethod;
	shiftChildren: (amount?: number) => void;
	getItemsCount: () => number;
}

interface ChildEntry<ChildInterface> {
	id: string;
	childDatum: ChildInterface;
	destroyAnimation?: () => Promise<void>;
}

interface PileComponentProps<ChildInterface> {
	parentComponent: (children: React.ReactNode) => React.ReactElement;
	childComponent: (
		childDatum: ChildInterface & { index: number; childrenCount: number },
		destroySelf: DestroyMethod,
		setDestroyAnimation: (animation: () => Promise<void>) => void
	) => React.ReactElement;
	onReady: (manager: PileManager<ChildInterface>) => void;
}

export function PileComponent<ChildInterface extends {}>({
	parentComponent,
	childComponent,
	onReady,
}: PileComponentProps<ChildInterface>) {
	const [children, setChildren] = React.useState<ChildEntry<ChildInterface>[]>([]);
	const childrenRef = React.useRef(children);

	const updateChildren = React.useCallback(
		(updater: (old: ChildEntry<ChildInterface>[]) => ChildEntry<ChildInterface>[]) => {
			setChildren((oldChildren) => {
				const nextChildrens = updater(oldChildren);
				childrenRef.current = nextChildrens;
				return nextChildrens;
			});
		},
		[],
	);

	const removeChild = React.useCallback((id: string) => {
		updateChildren((old) => old.filter((c) => c.id !== id));
	}, []);

	React.useEffect(() => {
		onReady({
			createChild: (childDatum: ChildInterface) => {
				const id = GenerateUUID.generateHexSegment();

				updateChildren((old) => [...old, { id, childDatum }]);

				return () => removeChild(id);
			},

			shiftChildren: (amount: number = 1) => {
				updateChildren((old) => {
					const nextChildrens = [...old];
					const childsAmount = nextChildrens.size();
					for (let i = childsAmount - 1 - (childsAmount - amount); i >= 0; i--) {
						const child = nextChildrens[i];
						(child.destroyAnimation?.() ?? Promise.resolve()).then(() => {
							updateChildren((current) => current.filter((c) => c.id !== child.id));
						})
						
					}
					return nextChildrens;
				});
			},

			getItemsCount: () => {
				return childrenRef.current.size();
			},
		});
	}, [onReady, updateChildren, removeChild]);

	return parentComponent(
		children.map((child, index) => {
			const { id, childDatum, destroyAnimation } = child;

			const destroySelf = () => {
				if (destroyAnimation) {
					destroyAnimation().then(() => removeChild(id));
				} else {
					removeChild(id);
				}
			};

			const setDestroyAnimation = (animation: () => Promise<void>) => {
				updateChildren((old) =>
					old.map((c) =>
						c.id === id
							? {
									...c,
									destroyAnimation: animation,
							  }
							: c,
					),
				);
			};

			return (
				<Fragment key={id}>
					{childComponent(
						{
							...childDatum,
							index,
							childrenCount: children.size(),
						},
						destroySelf,
						setDestroyAnimation,
					)}
				</Fragment>
			);
		}),
	);
}
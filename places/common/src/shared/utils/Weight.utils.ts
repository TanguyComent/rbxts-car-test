export namespace WeightUtils {
	export interface WeightOptions<T> {
		luck?: number;
		isBetter?: (a: T, b: T) => boolean;
		seed?: number;
	}

	export function getTotalWeight<T extends { weight: number }>(elements: T[]): number {
		let totalWeight = 0;
		for (const element of elements) {
			totalWeight += element.weight;
		}
		return totalWeight;
	}

	export function getRandomDraw<T extends { weight: number }>(
		elements: T[],
		options?: WeightOptions<T>
	): T {
		const luck = options?.luck ?? 1;
		const isBetter = options?.isBetter ?? ((a, b) => a.weight > b.weight);
		const random = options?.seed ? new Random(options.seed) : new Random();

		const totalWeight = getTotalWeight(elements);
		const totalDraws = math.floor(luck) + (random.NextNumber() < (luck - math.floor(luck)) ? 1 : 0);

		let bestDraw: T | undefined = undefined;
		for (let i = 0; i < totalDraws; i++) {
			let randomWeight = random.NextNumber() * totalWeight;

			for (const element of elements) {
				if (randomWeight <= element.weight) {
					if (!bestDraw || isBetter(element, bestDraw)) {
						bestDraw = element;
					}
					break;
				}

				randomWeight -= element.weight;
			}
		}

		assert(bestDraw !== undefined, "No element drawn");
		return bestDraw;
	}

	export function getWeightedPercentage<T extends { weight: number }>(elements: T[], element: T): number {
		const totalWeight = getTotalWeight(elements);
		return (element.weight / totalWeight) * 100;
	}
}

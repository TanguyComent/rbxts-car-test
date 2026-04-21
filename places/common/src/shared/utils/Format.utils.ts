export namespace FormatUtils {
    export function formatCurrency(currency: number): string {
		// Gestion des nombres négatifs
		const isNegative = currency < 0;
		const absValue = math.abs(currency);

		// Si le nombre est inférieur à 1000, retourner tel quel
		if (absValue < 1000) {
			return tostring(math.floor(currency));
		}

		// Format avec suffixes K, M, B, T
		if (absValue < 1000000) {
			// Milliers (K)
			const thousands = absValue / 1000;
			const formatted =
				thousands % 1 === 0 ? tostring(math.floor(thousands)) : tostring(math.floor(thousands * 10) / 10);
			return (isNegative ? "-" : "") + formatted + "k";
		} else if (absValue < 1000000000) {
			// Millions (M)
			const millions = absValue / 1000000;
			const formatted =
				millions % 1 === 0 ? tostring(math.floor(millions)) : tostring(math.floor(millions * 10) / 10);
			return (isNegative ? "-" : "") + formatted + "M";
		} else if (absValue < 1000000000000) {
			// Milliards (B)
			const billions = absValue / 1000000000;
			const formatted =
				billions % 1 === 0 ? tostring(math.floor(billions)) : tostring(math.floor(billions * 10) / 10);
			return (isNegative ? "-" : "") + formatted + "B";
		} else if (absValue < 1000000000000000) {
			// Billions (T)
			const trillions = absValue / 1000000000000;
			const formatted =
				trillions % 1 === 0 ? tostring(math.floor(trillions)) : tostring(math.floor(trillions * 10) / 10);
			return (isNegative ? "-" : "") + formatted + "T";
		} else {
			// Billions (Q)
			const quadrillions = absValue / 1000000000000000;
			const formatted =
				quadrillions % 1 === 0
					? tostring(math.floor(quadrillions))
					: tostring(math.floor(quadrillions * 10) / 10);
			return (isNegative ? "-" : "") + formatted + "Q";
		}
	}

	export function formatTime(seconds: number): string {
		const hrs = math.floor(seconds / 3600);
		const mins = math.floor((seconds % 3600) / 60);
		const secs = math.floor(seconds % 60);

		if (hrs > 0) {
			return `${hrs}h ${mins}m ${secs}s`;
		} else if (mins > 0) {
			return `${mins}m ${secs}s`;
		} else {
			return `${secs}s`;
		}
	}
}
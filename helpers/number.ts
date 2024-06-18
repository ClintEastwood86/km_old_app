export const numberCutting = (number: number): string | number => {
	const short = number / 1000;
	if (short >= 1) {
		const num = short.toString();
		return `${num.substring(0, num.indexOf('.') + 2)}K`;
	}
	return number;
};

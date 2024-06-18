export const getCorrectDeclination = (num: number, array: [string, string, string]) => {
	const numStr = num.toString();
	if (Number(numStr.at(-1)) > 1 && Number(numStr.at(-1)) < 5) return array[1];
	if (num >= 5 && num <= 20) {
		return array[2];
	}
	if (numStr.at(-1) == '1') return array[0];
	return array[2];
};

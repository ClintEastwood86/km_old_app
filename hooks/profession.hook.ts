export const useProfession = (enumId: number) => {
	const professions = ['Продюсер', 'Актёр', 'Режиссёр'];
	if (enumId > 2) {
		return professions[1];
	}
	return professions[enumId];
};

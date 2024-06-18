interface ISortItem {
	value: number;
	name: string;
}

export const sortConfig: ISortItem[] = [
	{ value: 0, name: 'По премьере' },
	{ value: 2, name: 'По рейтингу КП' },
	{ value: 4, name: 'По рейтингу IMDB' },
	{ value: 6, name: 'По ограничению' },
	{ value: 8, name: 'По длительности' }
];

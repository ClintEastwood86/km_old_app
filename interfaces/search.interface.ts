export interface ISearchParams {
	date_start?: number;
	date_end?: number;
	genre?: number[];
	country?: number[];
	type?: 'Serial' | 'Film';
	q?: string;
	sort?: SortEnumId;
}

export const isSeachParameterKey = (key: string): key is keyof ISearchParams => {
	const array = ['date_start', 'date_end', 'genre', 'country', 'type', 'q', 'sort'];
	if (array.includes(key)) {
		return true;
	}
	return false;
};

export interface ISearchDto extends Omit<ISearchParams, 'date_end' | 'date_start'> {
	date_start?: string;
	date_end?: string;
}

export enum SortEnumId {
	PremiereAsc,
	PremiereDesc,
	RatingKpAsc,
	RatingKpDesc,
	RatingImdbAsc,
	RatingImdbDesc,
	AgeRestrictionAsc,
	AgeRestrictionDesc,
	TimeMinutesAsc,
	TimeMinutesDesc
}

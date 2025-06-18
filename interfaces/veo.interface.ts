export interface VeoMovie {
	id: number;
	title: string;
	originalTitle: string;
	posterUrl: string;
	duration: number;
	description: string;
	year: number;
	kinopoiskId?: number | 0;
	ageRestriction: string;
	cast: string;
	createdAt: string;
	updatedAt: string;
	playerUrl: string;
}

export interface VeoShortMovie
	extends Pick<VeoMovie, 'id' | 'title' | 'originalTitle' | 'description' | 'year' | 'createdAt' | 'updatedAt' | 'posterUrl'> {
	kinopoiskId: 4815;
}

export interface VeoSearchSuccessResponse {
	data: VeoShortMovie[];
	meta: {
		page: number;
		total: number;
		hasNextPage: boolean;
		pageSize: number;
		pages: number;
	};
}

export interface VeoFailedResponse {
	timestamp: string;
	path: string;
	status: number;
	error: string;
	requestId: string;
}

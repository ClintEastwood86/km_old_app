export interface CollapsMovie {
	id: number;
	name: string;
	type: string;
	age: string;
	quality: string;
	origin_name: string;
	year: number;
	activate_time: string;
	imdb: string;
	imdb_id: string;
	kinopoisk: string;
	kinopoisk_id: string;
	world_art: null;
	world_art_id: null;
	iframe_url: string;
	trailer: string;
	poster: string;
	genre: Record<string, string>;
	country: Record<string, string>;
	collection: Record<string, string>;
}

export interface CollapsSuccessResponse {
	total: number;
	prev_page: number | null;
	next_page: number | null;
	results: CollapsMovie[];
}

export interface CollapsFailedResponse {
	name: string;
	message: string;
	code: number;
	status: number;
}

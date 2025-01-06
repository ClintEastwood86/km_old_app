export interface VibixSuccessResponse {
	id: number;
	name: string;
	name_rus: string | null;
	name_eng: string | null;
	name_original: string;
	type: 'movie' | 'serial';
	year: string;
	kp_id: number;
	kinopoisk_id: number;
	imdb_id: string;
	kp_rating: string | null;
	imdb_rating: string | null;
	iframe_url: string;
	voiceovers: {
		id: number;
		name: string;
	}[];
	tags: {
		id: number;
		code: string;
		name: string;
	}[];
	poster_url: string;
	backdrop_url: string;
	quality: string;
	duration: number;
	genre: string[];
	country: string[];
	description: string;
	description_short: string;
	updated_at: string;
	uploaded_at: string;
}

export interface VibixFailedResponse {
	success: false;
	message: string;
	status: number;
}

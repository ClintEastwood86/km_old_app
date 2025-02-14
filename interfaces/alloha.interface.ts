export interface AllohaMovie {
	name: string;
	original_name: string;
	alternative_name: string | null;
	year: number;
	category: number;
	id_kp: number;
	alternative_id_kp: number | null;
	id_imdb: string | null;
	id_tmdb: number | null;
	token_movie: string;
	country: string;
	genre: string;
	actors: string;
	directors: string;
	producers: string;
	premiere_ru: null;
	premiere: string;
	age_restrictions: null;
	rating_mpaa: string;
	rating_kp: number;
	rating_imdb: number;
	time: string;
	tagline: string | null;
	poster: string;
	description: string;
	quality: string;
	translation: string;
	iframe: string;
	iframe_trailer: string;
	lgbt: boolean;
	uhd: boolean;
	available_directors_cut: boolean;
}

export interface AllohaSuccessResponse {
	status: 'success';
	data: AllohaMovie;
}

export interface AllohaFailedResponse {
	status: 'error';
	error_info: string;
}

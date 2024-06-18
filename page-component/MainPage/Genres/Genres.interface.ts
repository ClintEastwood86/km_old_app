import { MovieShort } from '@/interfaces/movie.interface';

export interface IGenreMovieRow {
	genreId: number;
	name: string;
	movies: MovieShort[];
}

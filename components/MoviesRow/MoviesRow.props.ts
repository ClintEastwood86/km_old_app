import { MovieShort } from '@/interfaces/movie.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface MoviesRowProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	movies: MovieShort[];
	setPosition?: boolean;
}

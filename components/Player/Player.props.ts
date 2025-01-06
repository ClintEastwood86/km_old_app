import { Movie } from '@/interfaces/movie.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface PlayerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	movie: Movie;
	isAuth: boolean;
}

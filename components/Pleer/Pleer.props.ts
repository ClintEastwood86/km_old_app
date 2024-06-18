import { Movie } from '@/interfaces/movie.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface PleerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	movie: Movie;
	isAuth: boolean;
}

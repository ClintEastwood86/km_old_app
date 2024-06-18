import { Movie } from '@/interfaces/movie.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface CharacteristicsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	data: Movie;
}

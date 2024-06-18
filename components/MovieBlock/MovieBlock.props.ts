import { Genre, MovieShort } from '@/interfaces/movie.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface MovieBlockProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	info?: MovieShort;
	genres: Genre[];
	direction?: 'row' | 'column';
	usePhrases?: boolean;
	generateNewMovie?: (...args: unknown[]) => unknown;
}

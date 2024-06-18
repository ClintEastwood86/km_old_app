import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ICommentsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	movieId: number;
}

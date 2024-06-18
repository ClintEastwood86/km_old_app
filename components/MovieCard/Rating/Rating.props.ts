import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface RatingProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	kp?: number;
	imdb?: number;
}

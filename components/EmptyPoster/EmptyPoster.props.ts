import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface EmptyPosterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	size?: 'small' | 'default';
	usePhrases?: boolean;
	appearance?: 'primary' | 'primaryLight';
}

import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ProgressbarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	value: number;
	limit: number | null;
}

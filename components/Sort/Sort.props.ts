import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface SortProps extends DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	sortId?: number;
	setSort: (sortId: number) => unknown;
}

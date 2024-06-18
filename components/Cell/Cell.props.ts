import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface CellProps extends DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	title?: string;
	children: ReactNode;
	inversion?: boolean;
	isActive?: boolean;
}

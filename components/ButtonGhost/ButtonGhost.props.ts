import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface ButtonGhostProps extends DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	children: ReactNode;
	appearance?: 'normal' | 'red';
	href?: string;
}

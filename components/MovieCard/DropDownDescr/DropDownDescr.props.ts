import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface DropDownDescrProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: ReactNode;
}

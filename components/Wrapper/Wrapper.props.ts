import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface WrapperProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: ReactNode;
}

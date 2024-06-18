import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface PProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
	color?: 'secondary' | 'gray' | 'white' | 'grayDark' | 'grayLight' | 'red' | 'black';
	size?: 's' | 'm' | 'l';
	children: ReactNode;
}

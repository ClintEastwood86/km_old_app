import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface HtagProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
	tag: 'h1' | 'h2' | 'h3';
	appearanceTag?: 'h1' | 'h2' | 'h3';
	color?: 'secondary' | 'gray' | 'white' | 'grayDark' | 'grayLight' | 'black';
	children: ReactNode;
}

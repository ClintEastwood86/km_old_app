import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface PreProps extends DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement> {
	children: ReactNode;
}

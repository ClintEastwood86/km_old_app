import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface AwardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	icon?: string;
}

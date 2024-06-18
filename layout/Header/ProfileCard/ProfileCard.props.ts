import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ProfileCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	login: string;
	icon?: string;
	avatar?: string;
	rank: string;
}

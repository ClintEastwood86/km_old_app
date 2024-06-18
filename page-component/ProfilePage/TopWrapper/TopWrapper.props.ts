import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface TopWrapperProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	avatar?: string;
	icon?: string;
	userId: number;
	login: string;
	selfProfile?: boolean;
}

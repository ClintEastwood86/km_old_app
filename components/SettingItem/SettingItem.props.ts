import { DetailedHTMLProps, HTMLAttributes, MouseEventHandler } from 'react';

export interface SettingItemProps extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onClick'> {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	link?: string;
	title: string;
	value: string;
	button?: string;
}

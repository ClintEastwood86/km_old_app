import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from 'react';

export interface SwitchProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	label?: string;
	id: string;
	defaultChecked?: boolean;
	setState: Dispatch<SetStateAction<boolean>>;
}

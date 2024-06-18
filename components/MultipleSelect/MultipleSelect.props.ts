/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from 'react';

interface IMultipleSelectOptions {
	label: string;
	value: any;
}

export interface MultipleSelectProps extends DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	options: IMultipleSelectOptions[];
	title: string;
	values: any[];
	onChoose: Dispatch<SetStateAction<any[]>>;
}

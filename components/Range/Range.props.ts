import { Dispatch, SetStateAction } from 'react';

export interface RangeProps {
	className?: string;
	setValues: Dispatch<SetStateAction<[number, number]>>;
	values: [number, number];
	min: number;
	max: number;
}

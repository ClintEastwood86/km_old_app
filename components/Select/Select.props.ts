import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface SelectQueryItem<T> {
	label: string;
	value: T;
}

export interface SelectProps<T> extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'onSelect'> {
	queries: SelectQueryItem<T>[];
	appearance?: 'small' | 'default';
	onSelect: (item: SelectQueryItem<T>) => void;
	onSelectClose?: boolean;
	defaultQuery?: SelectQueryItem<T>;
	outerClassName?: string;
}

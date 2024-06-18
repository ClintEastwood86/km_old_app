import { ITableHead } from '@/interfaces/table.interface';
import { DetailedHTMLProps, TableHTMLAttributes } from 'react';

export interface TableProps<T extends Record<keyof T[number], string | number | JSX.Element | JSX.Element[] | null>[]>
	extends DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
	data: T;
	head: ITableHead[];
	activeIndex?: number;
	short?: boolean;
	multicolor?: boolean;
	appearance?: 'primary' | 'light';
}

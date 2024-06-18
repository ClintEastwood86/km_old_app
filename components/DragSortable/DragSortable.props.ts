import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from 'react';

export interface DragSortableProps<T extends { id: number }> extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	setItems: Dispatch<SetStateAction<T[]>>;
	items: T[];
	constructItem: (item: T, index: number) => JSX.Element;
	onSwap?: (items: T[]) => unknown;
}

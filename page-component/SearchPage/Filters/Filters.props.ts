import { ISearchParams } from '@/interfaces/search.interface';
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from 'react';

export interface FiltersProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	setQueries: Dispatch<SetStateAction<ISearchParams>>;
	queries: ISearchParams;
}

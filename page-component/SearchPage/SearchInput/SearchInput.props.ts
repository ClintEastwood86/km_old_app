import { ISearchParams } from '@/interfaces/search.interface';
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from 'react';

export interface SearchInputProps extends DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	setQueries: Dispatch<SetStateAction<ISearchParams>>;
	value?: string;
}

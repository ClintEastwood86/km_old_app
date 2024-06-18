import { CollectionShort } from '@/interfaces/collection.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface CollectionRowProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	collections: CollectionShort[];
	wrapperClassName?: string;
}

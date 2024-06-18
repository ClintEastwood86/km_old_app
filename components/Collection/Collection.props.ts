import { CollectionShort } from '@/interfaces/collection.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface CollectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	info?: CollectionShort;
}

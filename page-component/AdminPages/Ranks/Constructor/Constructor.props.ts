import { IAward } from '@/interfaces/awards.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ConstructorProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	editableRankId?: number;
	nameDefault?: string;
	pointsDefault?: number;
	awardDefault?: IAward | null;
}

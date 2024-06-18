import { IAward } from '@/interfaces/awards.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface AwardsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	awards: IAward[];
	awardId?: number;
	selfProfile?: boolean;
}

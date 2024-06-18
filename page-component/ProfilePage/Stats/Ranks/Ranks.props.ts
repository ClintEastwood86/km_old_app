import { IAward } from '@/interfaces/awards.interface';
import { IRank } from '@/interfaces/rank.interface';

import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface RanksProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	ranks: IRank[];
	userRankId: number;
	userPoints: number;
	awards: IAward[];
}

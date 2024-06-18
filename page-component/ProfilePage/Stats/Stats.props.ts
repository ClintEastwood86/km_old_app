import { IAward } from '@/interfaces/awards.interface';
import { IPointsItem } from '@/interfaces/points.interface';
import { IRank } from '@/interfaces/rank.interface';
import { UserModel } from '@/interfaces/user.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface StatsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	user: UserModel;
	ranks: IRank[];
	pointsItems: IPointsItem[];
	awards: IAward[];
}

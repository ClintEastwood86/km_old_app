import { IPointsItem } from '@/interfaces/points.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface HistoryProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	pointsItems: IPointsItem[];
}

import { IPointsItem } from '@/interfaces/points.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface PointsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	pointsItems: IPointsItem[];
}

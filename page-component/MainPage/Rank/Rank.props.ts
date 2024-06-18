import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface RankProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	rankId: number;
	userPoints: number;
}

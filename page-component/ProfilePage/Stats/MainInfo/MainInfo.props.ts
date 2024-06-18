import { IRank } from '@/interfaces/rank.interface';

export interface MainInfoProps {
	id: number;
	ranks: IRank[];
	rankId: number;
	watchedMinutes: number;
	multiplier: number;
}

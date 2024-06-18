import { getEnumFromObject } from '@/types/global';

export const AwardCategory = {
	REGISTER: 'REGISTER',
	RANKS: 'RANKS',
	POINTS: 'POINTS'
} as const;

export interface IAward {
	id: number;
	category: getEnumFromObject<typeof AwardCategory>;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	icon: string;
	condition: string;
	description: string;
	isOpen: boolean;
	position: number;
}

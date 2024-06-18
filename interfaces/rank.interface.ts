import { ReactNode } from 'react';

export interface IRank {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	points: number;
	awardId?: number;
}

export interface IRankShort extends Pick<IRank, 'name' | 'points'> {}

interface HistoryItemMainProps {
	id: number;
	pointsAddedAt: Date;
	userModelId: number;
	userMultiplier: number;
}

export interface HistoryItemUsesTemplate extends HistoryItemMainProps {
	pointsItemId: number;
}

export interface HistoryItemNotUsedTemplate extends HistoryItemMainProps {
	name: string;
	addPoints: number;
}

export type HistoryItem = HistoryItemNotUsedTemplate | HistoryItemUsesTemplate;

export interface HistoryItemShort extends Omit<HistoryItemNotUsedTemplate, 'userModelId' | 'id'> {}

export type HistoryItemTableRow = {
	[Key in keyof Omit<HistoryItemShort, 'pointsAddedAt'> & { pointsAddedAt: string }]: ReactNode;
};

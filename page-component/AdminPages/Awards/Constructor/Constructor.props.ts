import { AwardCategory } from '@/interfaces/awards.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ConstructorProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	awardId?: number;
	nameDefault?: string;
	descriptionDefault?: string;
	conditionDefault?: string;
	iconDefault?: string;
	categoryDefault?: (typeof AwardCategory)[keyof typeof AwardCategory];
}

import { HtagProps } from '../Htag/Htag.props';

export interface SectionHeadProps {
	title: string;
	description?: string;
	tag?: HtagProps['tag'];
	appearanceTag?: HtagProps['appearanceTag'];
}

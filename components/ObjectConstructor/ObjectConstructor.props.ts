import { ChangeEvent, DetailedHTMLProps, HTMLAttributes } from 'react';

export type TypeConditionItemComponent = (onChange: (e: ChangeEvent<HTMLInputElement>) => void) => JSX.Element;

export type TypeConditionConfigItem = Record<string, object | TypeConditionItemComponent>;

export interface ObjectConstructorProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	options: TypeConditionConfigItem;
	index: number;
	setCondition: (data: Record<string, unknown>, index: number) => void;
}

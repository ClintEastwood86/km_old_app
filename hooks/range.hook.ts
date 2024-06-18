import { RangeProps } from '@/components/Range/Range.props';
import { HTMLAttributes, useMemo, useState } from 'react';
import { Range } from '@/components';

interface UseRangeReturnType {
	component: (props?: Pick<HTMLAttributes<HTMLDivElement>, 'className'>) => JSX.Element;
	values: [number, number];
}

export const useRange = ({
	defaultValues,
	max,
	min
}: Pick<RangeProps, 'max' | 'min'> & { defaultValues?: [number, number] }): UseRangeReturnType => {
	const [values, setValues] = useState<[number, number]>(defaultValues || [min, max]);

	const callFunctionForCreateComponent = (props?: Pick<HTMLAttributes<HTMLDivElement>, 'className'>): JSX.Element =>
		Range({ max, min, setValues, values, className: props?.className });

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const memoComponent = useMemo(() => callFunctionForCreateComponent, [min, max]);

	return {
		component: memoComponent,
		values
	};
};

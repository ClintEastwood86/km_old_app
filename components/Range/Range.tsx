import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap_white.css';
import { RangeProps } from './Range.props';
import { rangeStyles } from './Range.styles';

export const Range = ({ className, min, max, setValues, values }: RangeProps) => {
	const handleChange = (values: number[] | number) => {
		if (!Array.isArray(values)) return;
		setValues([values[0], values[1]]);
	};

	return (
		<Slider
			className={className}
			handleRender={(node, handleProps) => {
				return (
					<Tooltip
						showArrow={false}
						overlayInnerStyle={{
							background: 'var(--primary-light)',
							color: 'var(--secondary)',
							borderColor: 'var(--secondary)',
							fontFamily: 'var(--font-family)'
						}}
						overlay={handleProps.value}
						placement="bottom">
						{node}
					</Tooltip>
				);
			}}
			defaultValue={values}
			onChange={handleChange}
			railStyle={rangeStyles.rail}
			handleStyle={rangeStyles.handle}
			trackStyle={rangeStyles.track}
			range
			min={min}
			max={max}
		/>
	);
};

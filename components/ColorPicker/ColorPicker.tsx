import { ColorPickerProps } from './ColorPicker.props';
import cn from 'classnames';
import styles from './ColorPicker.module.css';
import { useState } from 'react';
import { IColorPickerItem } from './ColorPicker.interface';

export const ColorPicker = ({ className, onPickColor, defaultIndexItem, items, ...props }: ColorPickerProps) => {
	const [checked, setChecked] = useState<number>(defaultIndexItem ?? 0);

	const onClick = (item: IColorPickerItem, index: number) => {
		onPickColor(item);
		setChecked(index);
	};

	return (
		<div {...props} className={cn(className, styles.picker)}>
			{items.map((item, index) => (
				<button
					type="button"
					title={item.label}
					onClick={() => onClick(item, index)}
					key={item.hex}
					style={{ background: item.hex }}
					className={cn(styles.color, { [styles.checked]: index == checked })}
				/>
			))}
		</div>
	);
};

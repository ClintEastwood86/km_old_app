import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { IColorPickerItem } from './ColorPicker.interface';

export interface ColorPickerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	onPickColor: (hex: IColorPickerItem) => unknown;
	items: IColorPickerItem[];
	defaultIndexItem?: number;
}

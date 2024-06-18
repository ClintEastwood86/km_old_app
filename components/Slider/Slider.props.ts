import Glide from '@glidejs/glide';
import { ReactNode } from 'react';

export interface SliderProps extends Partial<Glide.Options> {
	className?: string;
	children: ReactNode;
}

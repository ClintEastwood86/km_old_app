import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface BannerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	type: 'long' | 'fullscreen';
}

import { SliderProps } from './Slider.props';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import Glide from '@glidejs/glide';
import { useEffect, useRef } from 'react';

export const Slider = ({ children, className, ...props }: SliderProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		ref.current &&
			new Glide(ref.current, {
				perView: 4,
				touchRatio: 0.3,
				dragThreshold: 50,
				gap: 20,
				type: 'carousel',
				...props
			}).mount();
	}, [props]);

	return (
		<div ref={ref} className={`glide ${className}`}>
			<div data-glide-el="track" className={'glide__track'}>
				<div className={'glide__slides'}>{children}</div>
			</div>
		</div>
	);
};

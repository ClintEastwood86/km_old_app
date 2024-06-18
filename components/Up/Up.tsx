import Arrow from '@/public/arrow.svg';
import cn from 'classnames';
import { useState, useEffect } from 'react';
import styles from './Up.module.css';

export const Up = (): JSX.Element => {
	const [stateButtonUp, setStateButtonUp] = useState<'disable' | 'active'>('disable');

	const onScroll = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleScroll = () => {
		if (window.scrollY > 1000) {
			return setStateButtonUp('active');
		}
		setStateButtonUp('disable');
	};

	useEffect(() => {
		document.addEventListener('scroll', handleScroll);
		return () => document.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<button onClick={onScroll} className={cn(styles.up, styles[stateButtonUp])}>
			<Arrow />
		</button>
	);
};

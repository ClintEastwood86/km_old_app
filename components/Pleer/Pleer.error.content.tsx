import { ReactNode } from 'react';
import styles from './Pleer.module.css';
import Crown from './crown.svg';

export const PleerErrorContent = ({ children }: { children: ReactNode }): JSX.Element => {
	return (
		<div className={styles.pleerError}>
			<Crown />
			<div
				style={{
					fontWeight: 500,
					fontSize: '21px',
					lineHeight: '150.2%'
				}}>
				{children}
			</div>
		</div>
	);
};

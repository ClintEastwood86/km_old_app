import { ReactNode } from 'react';
import styles from './Player.module.css';
import Crown from './crown.svg';

export const PlayerErrorContent = ({ children }: { children: ReactNode }): JSX.Element => {
	return (
		<div className={styles.playerError}>
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

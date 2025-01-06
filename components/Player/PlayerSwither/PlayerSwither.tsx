import { P } from '@/components';
import styles from '../Player.module.css';
import { PlayerSwitherProps } from './PlayerSwither.props';
import cn from 'classnames';

export const PlayerSwither = ({ players, selectedPlayer, setPlayer }: PlayerSwitherProps): JSX.Element => {
	return (
		<div className={styles.playerSwither}>
			{players.map((p, i) => {
				const isSelectedPlayer = selectedPlayer?.name == p.name;
				return (
					<button
						className={cn(styles.playerButton, { [styles.opacity]: !isSelectedPlayer })}
						onClick={() => setPlayer(p)}
						key={p.name}>
						<P color={isSelectedPlayer ? 'white' : 'gray'} size="m">
							{i + 1} 👑 {p.name}
						</P>
					</button>
				);
			})}
		</div>
	);
};

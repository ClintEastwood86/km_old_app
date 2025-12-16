import styles from './ChristmasLights.module.css';

export const ChristmasLights = (): JSX.Element => {
	return (
		<ul className={styles.lightrope}>
			{new Array(60).fill(null).map((_, i) => (
				<li key={i} />
			))}
		</ul>
	);
};

import styles from './Loader.module.css';
import cn from 'classnames';

export const Loader = ({ className }: { className?: string }): JSX.Element => {
	return (
		<span className={cn(className, styles.loader)}>
			<svg xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
				<circle
					cx="50"
					cy="50"
					r="44"
					strokeWidth="5"
					stroke="#FCB74F"
					strokeDasharray="69.11503837897544 69.11503837897544"
					fill="none"
					strokeLinecap="round">
					<animateTransform
						attributeName="transform"
						type="rotate"
						repeatCount="indefinite"
						dur="1s"
						keyTimes="0;1"
						values="0 50 50;360 50 50"></animateTransform>
				</circle>
			</svg>
		</span>
	);
};

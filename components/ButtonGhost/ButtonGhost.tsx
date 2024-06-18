import { ButtonGhostProps } from './ButtonGhost.props';
import styles from './ButtonGhost.module.css';
import cn from 'classnames';
import Link from 'next/link';

export const ButtonGhost = ({ href, children, className, appearance = 'normal', ...props }: ButtonGhostProps): JSX.Element => {
	return href ? (
		<Link href={href} className={cn(className, styles.button, { [styles.red]: appearance == 'red' })}>
			{children}
		</Link>
	) : (
		<button {...props} className={cn(className, styles.button, { [styles.red]: appearance == 'red' })}>
			{children}
		</button>
	);
};

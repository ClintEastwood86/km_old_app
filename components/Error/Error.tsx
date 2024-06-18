import { ErrorProps } from './Error.props';
import styles from './Error.module.css';
import { P } from '..';
import cn from 'classnames';
import Mark from './exclamation-mark.svg';

export const Error = ({ children, className }: ErrorProps): JSX.Element => {
	return (
		<div className={cn(styles.error, className)}>
			<Mark className={styles.mark} />
			<P color="red" size="s">
				{children}
			</P>
		</div>
	);
};

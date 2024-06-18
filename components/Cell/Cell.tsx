import { CellProps } from './Cell.props';
import styles from './Cell.module.css';
import cn from 'classnames';
import { Htag, IsTruthy } from '..';

export const Cell = ({ inversion = false, title, children, isActive = false, className, ...props }: CellProps): JSX.Element => {
	return (
		<button {...props} className={cn(styles.cell, className, { [styles['isActive']]: isActive, [styles.inversion]: inversion })}>
			{children}
			<IsTruthy condition={!!title}>
				<Htag tag="h3">{title}</Htag>
			</IsTruthy>
		</button>
	);
};

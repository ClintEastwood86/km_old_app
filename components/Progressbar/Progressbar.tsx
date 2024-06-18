import { ProgressbarProps } from './Progressbar.props';
import styles from './Progressbar.module.css';
import cn from 'classnames';
import { Htag } from '..';

export const Progressbar = ({ value, limit, className, ...props }: ProgressbarProps): JSX.Element => {
	const percent = Math.floor((value / (limit || value)) * 100);
	return (
		<div {...props} className={cn(className, styles.wrapper)}>
			<div className={styles.info}>
				{!limit ? (
					<Htag style={{ display: 'block', margin: '0 auto' }} tag="h2">
						{value}
					</Htag>
				) : (
					<>
						<Htag tag="h3">{value}</Htag>
						<Htag tag="h2">{(percent || 0) + '%'}</Htag>
						<Htag tag="h3">{limit}</Htag>
					</>
				)}
			</div>
			<div className={styles.bar}>
				<span style={{ width: `${percent}%` }}></span>
			</div>
		</div>
	);
};

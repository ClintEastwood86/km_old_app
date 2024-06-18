import { ReadProgressProps } from './ReadProgress.props';
import styles from './ReadProgress.module.css';
import cn from 'classnames';

export const ReadProgress = ({ percent }: ReadProgressProps): JSX.Element => (
	<span style={{ width: `${percent}%` }} className={cn(styles.line)} />
);

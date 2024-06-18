import styles from './Separator.module.css';
import cn from 'classnames';

export const Separator = ({ className }: { className?: string }): JSX.Element => {
	return <span className={cn(className, styles.separator)} />;
};

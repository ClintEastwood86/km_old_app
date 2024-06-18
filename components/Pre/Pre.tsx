import { PreProps } from './Pre.props';
import cn from 'classnames';
import styles from './Pre.module.css';

export const Pre = ({ children, className, ...props }: PreProps): JSX.Element => {
	return (
		<pre {...props} className={cn(className, styles.pre)}>
			{children}
		</pre>
	);
};

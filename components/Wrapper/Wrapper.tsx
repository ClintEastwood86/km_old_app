import { WrapperProps } from './Wrapper.props';
import styles from './Wrapper.module.css';
import cn from 'classnames';

export const Wrapper = ({ children, className, ...props }: WrapperProps): JSX.Element => {
	return (
		<section {...props} className={cn(styles.wrapper, className)}>
			{children}
		</section>
	);
};

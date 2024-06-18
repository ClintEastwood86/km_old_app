import { PProps } from './P.props';
import styles from './P.module.css';
import cn from 'classnames';
import { ForwardedRef, forwardRef } from 'react';

export const P = forwardRef(
	({ color = 'gray', size = 'm', className, children, ...props }: PProps, ref: ForwardedRef<HTMLParagraphElement>): JSX.Element => {
		return (
			<p ref={ref} {...props} className={cn(className, styles.p, styles[size], styles[color])}>
				{children}
			</p>
		);
	}
);

import { CheckboxProps } from './Checkbox.props';
import styles from './Checkbox.module.css';
import cn from 'classnames';
import { ForwardedRef, forwardRef } from 'react';
import { Error } from '..';

export const Checkbox = forwardRef(
	({ title, error, className, children, id, ...props }: CheckboxProps, ref: ForwardedRef<HTMLInputElement>): JSX.Element => {
		return (
			<>
				<div className={cn(styles.checkbox, className)}>
					<input ref={ref} {...props} className={styles.input} type="checkbox" id={id} />
					<label title={title} className={cn(styles.label, { [styles.error]: error?.message })} htmlFor={id}>
						{children}
					</label>
				</div>
				{error && <Error>{error?.message}</Error>}
			</>
		);
	}
);

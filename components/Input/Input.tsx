import { InputProps } from './Input.props';
import cn from 'classnames';
import styles from './Input.module.css';
import { ForwardedRef, forwardRef, useState } from 'react';
import { Error } from '../Error/Error';
import { IsTruthy } from '..';

export const Input = forwardRef(
	(
		{ error, type, isPassword = false, id, placeholder, label, className, ...props }: InputProps,
		ref: ForwardedRef<HTMLInputElement>
	): JSX.Element => {
		const [isOpenEye, setIsOpenEye] = useState<boolean>(!isPassword);

		const setInputType = () => {
			if (type) {
				return type;
			}
			return 'text';
		};

		return (
			<>
				<div className={cn(className, styles.inputWrapper)}>
					<div className={styles.head}>
						<IsTruthy condition={!!label}>
							<label className={styles.label} htmlFor={id}>
								{label}
							</label>
						</IsTruthy>
					</div>
					<input
						ref={ref}
						autoComplete="off"
						id={id}
						{...props}
						className={cn(styles.input, { [styles.error]: error?.message })}
						type={isOpenEye ? setInputType() : 'password'}
						placeholder={placeholder}
					/>
					{isPassword && (
						<button
							tabIndex={-1}
							type="button"
							onClick={() => {
								setIsOpenEye((value) => !value);
							}}
							className={styles.eye}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M10.1482 1.00057C14.318 1.05166 17.7806 4.11226 19.6809 6.93707C19.8841 7.23918 19.8893 7.62963 19.698 7.93947C19.4566 8.33065 19.1033 8.87267 18.7628 9.28339C18.473 9.63282 18.1682 9.97324 17.8479 10.3025C17.6195 10.5369 17.3836 10.7651 17.1389 10.9869C14.9522 12.9703 11.8118 14.4498 8.49555 13.8754C5.02092 13.2734 2.15022 10.8141 0.319602 8.07653C0.116754 7.77318 0.111387 7.38145 0.30367 7.0713C0.546287 6.67995 0.901222 6.13811 1.24348 5.72815C1.51322 5.40468 1.79632 5.08987 2.09278 4.78444C2.31993 4.5504 2.55543 4.32214 2.79886 4.10036C4.73089 2.34203 7.20991 0.98831 10.1482 1.00057ZM10.1328 2.44301C7.67339 2.43507 5.62821 3.62111 4.01019 5.09348C3.79014 5.29362 3.57802 5.49989 3.37258 5.7112C3.10243 5.98959 2.84438 6.277 2.59844 6.57161C2.48779 6.704 2.37588 6.852 2.26802 7.00351C2.03552 7.3301 2.04536 7.76892 2.28721 8.08867C3.86893 10.1799 6.11261 11.9913 8.82417 12.4611C11.5646 12.936 14.1221 11.6313 15.9293 9.99235C16.1502 9.79221 16.3635 9.58558 16.5698 9.3739C16.8621 9.07352 17.1402 8.76303 17.4045 8.44389C17.5146 8.31102 17.6261 8.16259 17.7337 8.01073C17.9655 7.68347 17.9551 7.24487 17.7126 6.92549C16.0237 4.70156 13.3609 2.4864 10.1328 2.44301Z"
									fill="#FCB74F"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M9.99991 4.00049C12.0069 4.00049 13.6365 5.56909 13.6365 7.50049C13.6365 9.43232 12.0069 11.0005 9.99991 11.0005C7.99339 11.0005 6.36377 9.43232 6.36377 7.50049C6.36377 5.56909 7.99339 4.00049 9.99991 4.00049ZM9.99991 5.75071C11.0036 5.75071 11.8182 6.53479 11.8182 7.50049C11.8182 8.46662 11.0036 9.25071 9.99991 9.25071C8.99665 9.25071 8.18206 8.46662 8.18206 7.50049C8.18206 6.53479 8.99665 5.75071 9.99991 5.75071Z"
									fill="#FCB74F"
								/>
								{!isOpenEye && <path d="M1.5 13.5L18.5 1.50049" stroke="#FCB74F" strokeWidth="1.4" strokeLinecap="round" />}
							</svg>
						</button>
					)}
				</div>
				{error && <Error>{error.message}</Error>}
			</>
		);
	}
);

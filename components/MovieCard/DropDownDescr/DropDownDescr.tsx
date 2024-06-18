import { DropDownDescrProps } from './DropDownDescr.props';
import styles from './DropDownDescr.module.css';
import cn from 'classnames';
import { Htag, IsTruthy, P } from '@/components';
import { useEffect, useRef, useState } from 'react';

export const DropDownDescr = ({ children, className, ...props }: DropDownDescrProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const [isShowButton, setIsShowButton] = useState(false);
	const wrapperElement = useRef<HTMLDivElement>(null);
	const textElement = useRef<HTMLDivElement>(null);

	const openOrClose = () => {
		setIsOpen(!isOpen);
	};

	const showButton = () => {
		if (!wrapperElement.current || !textElement.current) {
			return;
		}
		setIsShowButton(wrapperElement.current.offsetHeight < textElement.current.offsetHeight);
	};

	useEffect(() => {
		showButton();
	}, []);

	return (
		<div {...props} className={cn(className, styles.wrapper)}>
			<Htag className={styles.title} tag="h3">
				Описание фильма:
			</Htag>
			<div ref={wrapperElement} className={cn(styles.description, { [styles.open]: isOpen })}>
				<P ref={textElement} size="m">
					{children}
				</P>
			</div>
			<IsTruthy condition={isShowButton}>
				<button onClick={openOrClose} className={styles.button}>
					{isOpen ? 'Свернуть' : 'Далее'}
				</button>
			</IsTruthy>
		</div>
	);
};

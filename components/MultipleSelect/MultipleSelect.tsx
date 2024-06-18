/* eslint-disable @typescript-eslint/no-explicit-any */
import { MultipleSelectProps } from './MultipleSelect.props';
import styles from './MultipleSelect.module.css';
import cn from 'classnames';
import Arrow from '@/public/arrow.svg';
import { Button, Checkbox, Htag, P } from '..';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

export const MultipleSelect = ({ options, onChoose, values, title, className, ...props }: MultipleSelectProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const trigger = useRef<HTMLButtonElement>(null);
	const context = useRef<HTMLDivElement>(null);

	const createDescription = (arrayValues: string[]) => {
		if (!arrayValues.length) {
			return 'Все';
		}
		if (arrayValues.length >= 2) {
			return `${arrayValues[0]} и ${arrayValues.length - 1} др.`;
		}
		return arrayValues[0];
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>, value: unknown) => {
		if (e.target.checked) {
			return onChoose((oldValue) => [...oldValue, value]);
		}
		onChoose((oldValue) => oldValue.filter((checkbox) => checkbox !== value));
	};

	const toggleAllCheckboxes = () => {
		if (options.length == values.length) {
			return onChoose([]);
		}
		onChoose(options.map((option) => option.value));
	};

	const closeContext = useCallback(
		(e: MouseEvent) => {
			if (!isOpen) {
				return;
			}
			if (!(e.target instanceof Node)) {
				return;
			}
			if (!trigger.current || !context.current) {
				return;
			}
			if (trigger.current.contains(e.target) || context.current.contains(e.target)) {
				return;
			}
			setIsOpen(false);
		},
		[isOpen]
	);

	useEffect(() => {
		document.addEventListener('mousedown', closeContext);
		return () => document.removeEventListener('mousedown', closeContext);
	}, [closeContext]);

	return (
		<>
			<button ref={trigger} {...props} onClick={() => setIsOpen((p) => !p)} className={cn(className, styles.trigger)}>
				<div className={styles.wrapper}>
					<Htag tag="h3" color="white">
						{title}
					</Htag>
					<P className={styles.description} size="s">
						{createDescription(values)}
					</P>
					<P className={styles.count} size="s">
						{values.length} выбрано
					</P>
				</div>
				<span style={{ transition: '.3s all ease', rotate: isOpen ? '180deg' : '0deg' }}>
					<Arrow />
				</span>
			</button>
			<div ref={context} className={cn(styles.context, { [styles.open]: isOpen })}>
				{options.map((el) => {
					return (
						<Checkbox
							title={el.label}
							key={el.value + Math.random()}
							checked={values.includes(el.label)}
							className={styles.checkboxes}
							onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e, el.value)}
							id={(el.value * Math.random() * 100).toString()}
							children={el.label}
						/>
					);
				})}
				<Button className={styles.button} onClick={toggleAllCheckboxes} stretch>
					{options.length == values.length ? 'Убрать все' : 'Установить все'}
				</Button>
			</div>
		</>
	);
};

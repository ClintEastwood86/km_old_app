import { SelectProps, SelectQueryItem } from './Select.props';
import styles from './Select.module.css';
import cn from 'classnames';
import { useRef, useState } from 'react';
import { IsTruthy, P } from '..';
import Arrow from '@/public/arrow.svg';
import { useOutsideClick } from '@/hooks/outsideClick.hook';

export const Select = <T extends string | number | boolean | unknown[] | undefined>({
	onSelect,
	defaultQuery,
	appearance = 'default',
	onSelectClose = true,
	queries,
	className,
	outerClassName,
	...props
}: SelectProps<T>): JSX.Element => {
	const [checkedItem, setCheckedItem] = useState<SelectQueryItem<T>>(defaultQuery ?? queries[0]);
	const body = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen, trigger] = useOutsideClick(body);

	const onClick = (item: SelectQueryItem<T>) => {
		setCheckedItem(item);
		onSelect(item);
	};

	return (
		<div className={cn(outerClassName, styles.component)}>
			<button
				onClick={() => setIsOpen((state) => !state)}
				ref={trigger}
				{...props}
				className={cn(className, styles.trigger, styles[appearance])}>
				<IsTruthy condition={appearance == 'small'}>
					<P size="m" color="secondary">
						{checkedItem.label}
					</P>
				</IsTruthy>
				<IsTruthy condition={appearance == 'default'}>
					<P size="m" color="secondary">
						{checkedItem.label}
					</P>
					<Arrow style={{ transform: `rotate(${isOpen ? '180deg' : '0deg'})` }} />
				</IsTruthy>
			</button>
			<IsTruthy condition={isOpen}>
				<div ref={onSelectClose ? undefined : body} className={styles.body}>
					{queries.map((item, i) => (
						<button onClick={() => onClick(item)} className={cn({ [styles.active]: item.label == checkedItem.label })} key={i}>
							<P size="m" color="grayLight">
								{item.label}
							</P>
						</button>
					))}
				</div>
			</IsTruthy>
		</div>
	);
};

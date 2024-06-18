import { TableProps } from './Table.props';
import styles from './Table.module.css';
import cn from 'classnames';

export const Table = <T extends Record<keyof T[number], string | JSX.Element | JSX.Element[] | number | null>[]>({
	multicolor,
	appearance = 'primary',
	short,
	activeIndex,
	data,
	head,
	className,
	...props
}: TableProps<T>): JSX.Element => {
	return (
		<div className={styles.wrapper}>
			<table {...props} className={cn(className, styles.table, { [styles.short]: short, [styles.tableLight]: appearance == 'light' })}>
				<thead>
					<tr style={{ borderBottom: '1px solid var(--gray-dark)' }}>
						{head.map((h) => (
							<th key={h.key}>{h.name}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((el, index) => (
						<tr key={index} className={cn({ [styles.active]: activeIndex == index || (multicolor && index % 2 == 1) })}>
							{Object.keys(el).map((key) => (
								<td key={Math.random()}>{el[key as keyof T[number]]}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

import { SearchInputProps } from './SearchInput.props';
import styles from './SearchInput.module.css';
import cn from 'classnames';
import { ChangeEvent } from 'react';
import { Select } from '@/components';
import { SelectQueryItem } from '@/components/Select/Select.props';

const selectQueriesType: SelectQueryItem<'Serial' | 'Film' | undefined>[] = [
	{ label: 'Все', value: undefined },
	{ label: 'Сериалы', value: 'Serial' },
	{ label: 'Фильмы', value: 'Film' }
];

export const SearchInput = ({ value, setQueries, className, ...props }: SearchInputProps): JSX.Element => {
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setQueries((queries) => ({
			...queries,
			q: e.target.value
		}));
	};

	const setType = (type: (typeof selectQueriesType)[number]) => {
		setQueries((queries) => ({
			...queries,
			type: type.value
		}));
	};

	return (
		<div className={styles.search}>
			<input
				autoFocus
				value={value || ''}
				onChange={onChange}
				placeholder="Шрэк Третий"
				{...props}
				className={cn(className, styles.input)}
			/>
			<Select<(typeof selectQueriesType)[number]['value']>
				outerClassName={styles.select}
				appearance="small"
				onSelect={setType}
				queries={selectQueriesType}
			/>
		</div>
	);
};

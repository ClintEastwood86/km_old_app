/* eslint-disable react-hooks/exhaustive-deps */
import { FiltersProps } from './Filters.props';
import cn from 'classnames';
import styles from './Filters.module.css';
import { P, MultipleSelect } from '@/components';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useGenres } from '@/hooks/genres.hook';
import { useCountries } from '@/hooks/countries.hook';
import { useRange } from '@/hooks/range.hook';
import { YEAR_PRODUCTION_END, YEAR_PRODUCTION_START } from '@/constants/filters.constants';
import { SearchPageContext } from '@/contexts/searchPage.context';

export const Filters = ({ queries, setQueries, className, ...props }: FiltersProps) => {
	const genres = useGenres();
	const countries = useCountries();
	const [checkedGenres, setCheckedGenres] = useState<number[]>([]);
	const [checkedCountries, setCheckedCountries] = useState<number[]>([]);
	const { clearButton } = useContext(SearchPageContext);
	const [isLoadData, setIsLoadData] = useState<boolean>(false);
	const { component: Range, values: rangeValues } = useRange({
		min: YEAR_PRODUCTION_START,
		max: YEAR_PRODUCTION_END
	});

	useEffect(() => {
		setQueries((q) => ({
			...q,
			date_start: rangeValues[0],
			date_end: rangeValues[1]
		}));
	}, [rangeValues]);

	useEffect(() => {
		setIsLoadData(true);
		setCheckedGenres(queries.genre || []);
		setCheckedCountries(queries.country || []);
	}, [isLoadData]);

	useEffect(() => {
		setQueries((q) => ({
			...q,
			genre: checkedGenres
		}));
	}, [checkedGenres]);

	useEffect(() => {
		setQueries((q) => ({
			...q,
			country: checkedCountries
		}));
	}, [checkedCountries]);

	useEffect(() => {
		const clearQueries = () => {
			setCheckedCountries([]);
			setCheckedGenres([]);
		};
		clearButton?.addEventListener('click', clearQueries);
		return () => clearButton?.removeEventListener('click', clearQueries);
	}, [clearButton]);

	const genreSelect = useMemo(() => {
		return (
			<MultipleSelect
				className={styles.select}
				title="Жанры"
				values={checkedGenres.map((v) => genres.find((g) => g.id == v)?.name)}
				onChoose={setCheckedGenres}
				options={genres
					.sort(({ name: a }, { name: b }) => a.charCodeAt(0) - b.charCodeAt(0))
					.map((g) => ({ value: g.id, label: g.name }))}
			/>
		);
	}, [checkedGenres, genres]);

	const countrySelect = useMemo(() => {
		return (
			<MultipleSelect
				className={styles.select}
				title="Страны"
				values={checkedCountries.map((v) => countries.find((g) => g.id == v)?.name)}
				onChoose={setCheckedCountries}
				options={countries
					.sort(({ name: a }, { name: b }) => a.charCodeAt(0) - b.charCodeAt(0))
					.map((g) => ({ value: g.id, label: g.name }))}
			/>
		);
	}, [checkedCountries, countries]);

	return (
		<>
			<div {...props} className={cn(className, styles.filters)}>
				{genreSelect}
				{countrySelect}
				<div className={styles.rangeWrapper}>
					<div className={styles.values}>
						<P color="white">{YEAR_PRODUCTION_START}</P>
						<P color="white" size="l">
							{rangeValues[0]} – {rangeValues[1]}
						</P>
						<P color="white">{YEAR_PRODUCTION_END}</P>
					</div>
					<Range className={styles.range} />
				</div>
			</div>
		</>
	);
};

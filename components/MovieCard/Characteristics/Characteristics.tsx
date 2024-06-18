import { CharacteristicsProps } from './Characteristics.props';
import styles from './Characteristics.module.css';
import cn from 'classnames';
import { P } from '@/components';
import dayjs from 'dayjs';
import { Country, Genre } from '@/interfaces/movie.interface';
import { useContext } from 'react';
import { MoviePageContext } from '@/contexts/moviePage.context';

export const Characteristics = ({ data, className, ...props }: CharacteristicsProps): JSX.Element => {
	const { genresList, countriesList } = useContext(MoviePageContext);

	const createBreadcrump = (indexs: number[], arrayElements: (Genre | Country)[], type: 'genre' | 'country') => {
		return indexs.reduce<(string | JSX.Element)[]>((p, c, i) => {
			const element = arrayElements.find((g) => g.id == c);
			if (!element) {
				return p;
			}
			const addElement = (
				<a key={i} href={`/search?${type}=${c}`}>
					{element.name}
				</a>
			);
			const returnArray = i == 0 ? [addElement] : [', ', addElement];
			return p.concat(returnArray);
		}, []);
	};

	return (
		<div {...props} className={cn(styles.characteristics, className)}>
			{data.genres.length ? (
				<P className={styles.characteristicItem} size="m">
					<span>Жанры: </span>
					{createBreadcrump(data.genres, genresList, 'genre')}
				</P>
			) : (
				<></>
			)}
			{data.premiere && (
				<P className={styles.characteristicItem} size="m">
					Премьера: {dayjs(data.premiere).format('YYYY-MM-DD')}
				</P>
			)}
			{data.countries.length ? (
				<P className={styles.characteristicItem} size="m">
					<span>Страны: </span>
					{createBreadcrump(data.countries, countriesList, 'country')}
				</P>
			) : (
				<></>
			)}
		</div>
	);
};

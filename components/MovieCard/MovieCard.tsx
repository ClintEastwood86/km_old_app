import styles from './MovieCard.module.css';
import { Htag, P, Separator } from '../index';
import { MoviePageContext } from '@/contexts/moviePage.context';
import { useContext, useMemo } from 'react';
import { DropDownDescr } from './DropDownDescr/DropDownDescr';
import { Rating } from './Rating/Rating';
import { Characteristics } from './Characteristics/Characteristics';
import { EmptyPoster } from '../EmptyPoster/EmptyPoster';
import cn from 'classnames';

export const MovieCard = (): JSX.Element => {
	const { movie } = useContext(MoviePageContext);

	const poster = useMemo(() => <EmptyPoster appearance="primaryLight" />, []);

	if (!movie) {
		return <></>;
	}

	const setYear = (premiere?: Date) => {
		return premiere ? ` (${new Date(premiere).getFullYear()})` : '';
	};

	return (
		<section className={styles.card}>
			<div className={styles.left}>
				<div className={cn(styles.cover)}>{movie.poster ? <img src={movie.poster} alt={movie.alias} /> : poster}</div>
			</div>
			<div className={styles.main}>
				<Htag className={styles.title} tag="h1">
					{(movie.nameRussian || movie.nameOriginal) + setYear(movie.premiere)} смотреть бесплатно
					{<span className={styles.restriction}>{movie.ageRestriction}+</span>}
				</Htag>

				{movie.nameOriginal && (
					<P className={styles.originalName} size="s">
						В оригинале: {movie.nameOriginal}
					</P>
				)}

				<Characteristics className={styles.characteristics} data={movie} />

				<DropDownDescr>{movie.description}</DropDownDescr>

				<Separator className={styles.divider} />

				<Rating kpCount={movie.ratingKpCount} imdbCount={movie.ratingImdbCount} kp={movie.ratingKp} imdb={movie.ratingImdb} />
			</div>
		</section>
	);
};

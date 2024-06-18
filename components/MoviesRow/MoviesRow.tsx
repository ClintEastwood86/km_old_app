import { MoviesRowProps } from './MoviesRow.props';
import cn from 'classnames';
import styles from './MoviesRow.module.css';
import { MovieBlock } from '@/components';
import { useGenres } from '@/hooks/genres.hook';
import { useMemo } from 'react';
import { useViewportElements } from '@/hooks/viewportElements.hook';
import { displayedMoviesConfig } from '@/configs/row.config';

export const MoviesRow = ({ setPosition = false, movies, className, ...props }: MoviesRowProps) => {
	const genres = useGenres();
	const { elements } = useViewportElements(displayedMoviesConfig, 5);

	const getRow = () => {
		if (!movies.length) {
			return new Array(elements).fill(null).map((_, i) => <MovieBlock key={i} genres={genres} />);
		}
		return movies.map((m, i) => (
			<MovieBlock title={setPosition ? (i + 1).toString() : m.nameRussian} key={m.alias + Date.now()} genres={genres} info={m} />
		));
	};

	return (
		<div {...props} className={cn(className, styles.movies)}>
			{useMemo(getRow, [movies, genres, elements, setPosition])}
		</div>
	);
};

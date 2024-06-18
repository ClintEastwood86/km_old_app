import { useEffect, useState } from 'react';
import { RandomProps } from './Random.props';
import cn from 'classnames';
import { MovieShort } from '@/interfaces/movie.interface';
import { API } from '@/helpers/api';
import { useGenres } from '@/hooks/genres.hook';
import styles from './Random.module.css';
import { Htag, MovieBlock } from '@/components';

export const Random = ({ className, ...props }: RandomProps) => {
	const [movie, setMovie] = useState<MovieShort>();
	const genres = useGenres();

	const setRandomMovie = async () => {
		const res = await fetch(API.movies.getRandom);
		const movie = await res.json();
		setMovie(movie);
	};

	useEffect(() => {
		setRandomMovie();
	}, []);

	return (
		<div style={{ flexGrow: 1 }} {...props} className={cn(className, styles.random)}>
			<Htag className={styles.title} tag="h2">
				Рандомный фильм
			</Htag>
			<MovieBlock generateNewMovie={setRandomMovie} className={styles.movie} direction="row" genres={genres} info={movie} />
		</div>
	);
};

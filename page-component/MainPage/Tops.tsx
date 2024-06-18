import { SectionHead } from '@/components/SectionHead/SectionHead';
import { MoviesRow } from '../../components/MoviesRow/MoviesRow';
import { useCallback, useEffect, useState } from 'react';
import { MovieShort } from '@/interfaces/movie.interface';
import { API } from '@/helpers/api';
import { Button } from '@/components';

export const Tops = ({ take, isUpdated }: { take: number; isUpdated: boolean }) => {
	const [movies, setMovies] = useState<MovieShort[]>([]);

	const getMovies = useCallback(async () => {
		const res = await fetch(`${API.movies.getTops}?take=${take}`);
		setMovies(await res.json());
	}, [take]);

	useEffect(() => {
		if (!isUpdated) return;
		getMovies();
	}, [getMovies, take, isUpdated]);

	return (
		<section>
			<SectionHead appearanceTag="h2" tag="h1" title="Популярные сегодня" />
			<MoviesRow movies={movies} />
			<div style={{ display: 'flex', marginTop: '15px', justifyContent: 'center' }}>
				<Button children="Смотреть все" href="/tops" />
			</div>
		</section>
	);
};

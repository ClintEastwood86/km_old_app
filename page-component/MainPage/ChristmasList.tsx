import { SectionHead } from '@/components/SectionHead/SectionHead';
import { MoviesRow } from '../../components/MoviesRow/MoviesRow';
import { useCallback, useEffect, useState } from 'react';
import { MovieShort } from '@/interfaces/movie.interface';
import { API } from '@/helpers/api';
import { Button } from '@/components';
import { Collection } from '@/interfaces/collection.interface';
import { shuffleArray } from '@/helpers/array';

const CHRISTMAS_COLLECTION_ID = 53;

export const ChristmasList = ({ take, isUpdated }: { take: number; isUpdated: boolean }) => {
	const [movies, setMovies] = useState<MovieShort[]>([]);

	const getMovies = useCallback(async () => {
		const collectionResponse = await fetch(`${API.collections.get}${CHRISTMAS_COLLECTION_ID}`);
		const collections: Collection = await collectionResponse.json();
		const body = {
			take,
			skip: 0,
			movies: shuffleArray(collections.moviesId)
		};
		const res = await fetch(`${API.movies.getByArray}`, {
			credentials: 'include',
			method: 'post',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' }
		});
		setMovies(await res.json());
	}, [take]);

	useEffect(() => {
		if (!isUpdated) return;
		getMovies();
	}, [getMovies, take, isUpdated]);

	return (
		<section>
			<SectionHead appearanceTag="h2" tag="h1" title="🎄Новогоднее кино" />
			<MoviesRow movies={movies} />
			<div style={{ display: 'flex', marginTop: '15px', justifyContent: 'center' }}>
				<Button children="Смотреть все" href={`/collection/${CHRISTMAS_COLLECTION_ID}`} />
			</div>
		</section>
	);
};

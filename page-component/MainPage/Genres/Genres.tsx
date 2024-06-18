import { useCallback, useEffect, useState } from 'react';
import { IGenreMovieRow } from './Genres.interface';
import { SectionHead } from '@/components/SectionHead/SectionHead';
import { useGenres } from '@/hooks/genres.hook';
import { API } from '@/helpers/api';
import { GenresProps } from './Genres.props';
import { MoviesRow } from '../../../components/MoviesRow/MoviesRow';
import { Button, IsTruthy, Loader } from '@/components';

export const Genres = ({ parent, take }: GenresProps) => {
	const [movies, setMovies] = useState<IGenreMovieRow[]>([]);
	const [isSendRequest, setIsSendRequest] = useState<boolean>(false);
	const genres = useGenres();
	const [id, setId] = useState<number>(0);

	const addMovies = useCallback(async () => {
		const genre = genres.find((g) => g.id == id);
		if (!genre || !isSendRequest) {
			return;
		}
		const response = await fetch(`${API.movies.getByQueries}?take=${take}`, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ genre: [id] })
		});
		const parsedMovies = await response.json();
		setMovies((m) => m.concat({ movies: parsedMovies, genreId: genre.id, name: genre.name }));
		setIsSendRequest(false);
	}, [genres, id, isSendRequest, take]);

	const handleScroll = useCallback(async () => {
		if (!parent.current || isSendRequest || parent.current.getBoundingClientRect().bottom - (window.innerHeight + 100) > 0) {
			return;
		}
		setIsSendRequest(true);
		setId((id) => id + 1);
	}, [parent, isSendRequest]);

	useEffect(() => {
		if (id == 0) {
			return setIsSendRequest(false);
		}
		addMovies();
	}, [addMovies, id]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	useEffect(() => {
		setIsSendRequest(true);
		setId((id) => id + 1);
	}, []);

	return (
		<>
			{movies.map((item) => {
				return (
					<section key={item.genreId}>
						<SectionHead title={item.name} />
						<MoviesRow movies={item.movies} />
						<div style={{ display: 'flex', marginTop: '15px', justifyContent: 'center' }}>
							<Button children="Смотреть все" href={`/search?genre=${item.genreId}`} />
						</div>
					</section>
				);
			})}
			<IsTruthy condition={isSendRequest}>
				<div className="loader">
					<Loader />
				</div>
			</IsTruthy>
		</>
	);
};

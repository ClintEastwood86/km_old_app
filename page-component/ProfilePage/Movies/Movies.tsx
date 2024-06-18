import { SectionHead } from '@/components/SectionHead/SectionHead';
import { MoviesProps } from './Movies.props';
import styles from './Movies.module.css';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Genre, MovieShort } from '@/interfaces/movie.interface';
import { MOVIES_PER_PAGE } from '../../../constants/movies.constants';
import { API } from '@/helpers/api';
import { IsTruthy, Loader, MovieBlock, P } from '@/components';
import { useGenres } from '@/hooks/genres.hook';
import Head from 'next/head';
import { createTitle } from '@/helpers/title';
import cn from 'classnames';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { AppContext } from '@/contexts/app.context';

export const Movies = ({ className, ...props }: MoviesProps) => {
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [markedId, setMarkedId] = useState<number[]>([]);
	const [movies, setMovies] = useState<MovieShort[]>([]);
	const [isSendRequest, setIsSendRequest] = useState<boolean>(false);
	const genres = useGenres();
	const { addNotification } = useContext(AppContext);
	const ref = useRef<HTMLDivElement>(null);

	const toggleMark = useCallback(
		async (id: number, name: string) => {
			const res = await fetch(API.users.toggleMark + id, { credentials: 'include', method: 'put' });
			const lengthOrError: number | IErrorResponse = await res.json();
			if (isHttpError(lengthOrError)) {
				return;
			}
			addNotification({
				title: name || 'Смотреть позже',
				description: `Отметка ${markedId.includes(id) ? 'убрана' : 'установлена'}`,
				key: Date.now().toString()
			});
			getMarkedId();
		},
		[addNotification, markedId]
	);

	const constructMovieCard = useCallback(
		(genres: Genre[], markedId: number[]) => {
			return (movie: MovieShort) => (
				<div key={movie.alias} className={styles.card}>
					<button
						onClick={() => toggleMark(movie.id, (movie.nameRussian || movie.nameOriginal) as string)}
						className={styles.markButton}>
						<svg
							style={{ marginRight: '6px', transition: '.3s all ease' }}
							className={cn({ [styles.activeMark]: markedId.includes(movie.id) })}
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="26"
							viewBox="0 0 18 26"
							fill="none">
							<path
								d="M1 1.7V24.6589C1 25.3025 1.79556 25.605 2.22319 25.1239L8.47681 18.0886C8.75527 17.7753 9.24473 17.7753 9.52319 18.0886L15.7768 25.1239C16.2044 25.605 17 25.3025 17 24.6589V1.7C17 1.3134 16.6866 1 16.3 1H9H1.7C1.3134 1 1 1.3134 1 1.7Z"
								stroke="#FCB74F"
							/>
						</svg>
					</button>
					<MovieBlock className={styles.block} genres={genres} info={movie} />
				</div>
			);
		},
		[toggleMark]
	);

	const getMovies = useCallback(async (take: number, skip: number) => {
		if (isSendRequest) {
			return;
		}
		setIsSendRequest(true);
		const queries = '?' + new URLSearchParams({ take: take.toString(), skip: skip.toString() }).toString();
		const response = await fetch(API.movies.getMarks + queries, { credentials: 'include', method: 'get' });
		const moviesResponse: MovieShort[] = await response.json();
		if (!moviesResponse.length || moviesResponse.length % MOVIES_PER_PAGE !== 0) {
			setIsLastPage(true);
		}
		setMovies((m) => m.concat(moviesResponse));
		setIsSendRequest(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getMarkedId = async () => {
		const response = await fetch(API.movies.getMarksId, { credentials: 'include', method: 'get' });
		const markedId: number[] = await response.json();
		setMarkedId(markedId);
	};

	const handleScroll = useCallback(() => {
		if (!ref.current || isSendRequest || isLastPage) {
			return;
		}
		if (ref.current.getBoundingClientRect().bottom - window.innerHeight - 150 < 0) {
			setPage((page) => page + 1);
		}
	}, [isLastPage, isSendRequest]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	useEffect(() => {
		if (isLastPage || !genres.length) {
			return;
		}
		getMovies(MOVIES_PER_PAGE, page * MOVIES_PER_PAGE);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, genres, getMovies]);

	useEffect(() => {
		getMarkedId();
		return () => {
			setMarkedId([]);
		};
	}, []);

	return (
		<>
			<Head>
				<title>{createTitle('Смотреть позже')}</title>
			</Head>
			<section {...props} className={className}>
				<SectionHead title="Смотреть позже" description="Фильмы которые вы отметили" />
				<IsTruthy condition={movies.length > 0}>
					<div ref={ref} className={styles.movies}>
						{useMemo(() => movies.map(constructMovieCard(genres, markedId)), [constructMovieCard, genres, markedId, movies])}
					</div>
				</IsTruthy>
				<IsTruthy condition={movies.length == 0 && isLastPage}>
					<P size="l" color="grayLight" className={styles.emptyP}>
						Пусто
					</P>
				</IsTruthy>
				<IsTruthy condition={!isLastPage}>
					<div className={styles.loaderWrapper}>
						<Loader />
					</div>
				</IsTruthy>
			</section>
		</>
	);
};

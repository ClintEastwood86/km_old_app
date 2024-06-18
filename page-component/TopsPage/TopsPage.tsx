import { Button, IsTruthy, Loader, MoviesRow } from '@/components';
import { SectionHead } from '@/components/SectionHead/SectionHead';
import { displayedMoviesConfig } from '@/configs/row.config';
import { API } from '@/helpers/api';
import { useViewportElements } from '@/hooks/viewportElements.hook';
import { MovieShort } from '@/interfaces/movie.interface';
import dayjs from 'dayjs';
import ruLocale from 'dayjs/locale/ru';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

export const TopsPage = (): JSX.Element => {
	const { elements: take, updated } = useViewportElements(displayedMoviesConfig, 5);
	const [page, setPage] = useState<number>(1);
	const [movies, setMovies] = useState<MovieShort[]>([]);
	const [isSendRequest, setIsSendRequest] = useState<boolean>(false);
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const parent = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const getMovies = async (take: number, skip: number) => {
		const query = new URLSearchParams({ take: take.toString(), skip: skip.toString() }).toString();
		const res = await fetch(`${API.movies.getTops}?${query}`);
		const movies: MovieShort[] = await res.json();
		if (!movies.length) {
			setIsLastPage(true);
			setIsSendRequest(false);
		}
		setMovies((m) => m.concat(movies));
		setIsSendRequest(false);
	};

	const handleScroll = useCallback(async () => {
		if (!parent.current || isSendRequest || isLastPage || parent.current.getBoundingClientRect().bottom - (window.innerHeight + 100) > 0) {
			return;
		}
		setIsSendRequest(true);
		setPage((p) => p + 1);
	}, [isSendRequest, isLastPage]);

	useEffect(() => {
		if (!updated) {
			return;
		}
		const moviesPerRequest = take * 3;
		getMovies(moviesPerRequest, moviesPerRequest * (page - 1));
	}, [page, take, updated]);

	useEffect(() => {
		if (!updated) {
			return;
		}
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll, updated]);

	useEffect(() => {
		dayjs.locale(ruLocale);
	}, []);

	return (
		<section ref={parent}>
			<SectionHead
				description={`Самые просматриваемые фильмы до ${dayjs(new Date()).locale('ru-RU').format('D MMMM')}`}
				title="Популярные сегодня"
				appearanceTag="h2"
				tag="h1"
			/>
			<MoviesRow movies={movies} />
			<Button style={{ margin: '15px auto 0' }} onClick={() => router.back()}>
				Вернуться
			</Button>
			<IsTruthy condition={isSendRequest}>
				<div className="loader">
					<Loader />
				</div>
			</IsTruthy>
		</section>
	);
};

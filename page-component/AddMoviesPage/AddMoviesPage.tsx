import { Button, ButtonGhost, Htag, IsTruthy, Loader, MovieBlock, P, Sort } from '@/components';
import { createTitle } from '@/helpers/title';
import Head from 'next/head';
import { AddMoviesPageProps } from './AddMoviesPage.props';
import styles from './AddMoviesPage.module.css';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MovieShort } from '@/interfaces/movie.interface';
import { useDebounce } from '@/hooks/debounde.hook';
import { API } from '@/helpers/api';
import cn from 'classnames';
import { useGenres } from '@/hooks/genres.hook';
import { AppContext } from '@/contexts/app.context';
import { MAX_MOVIES_IN_COLLECTION } from './AddMoviesPage.constants';
import { PlaylistMoviesModal } from './PlaylistMoviesModal/PlaylistMoviesModal';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useRouter } from 'next/router';
import { SortEnumId } from '@/interfaces/search.interface';
import { MOVIES_PER_REQUEST } from '../CollectionMoviesPage/CollectionMovies.constants';
import { IErrorResponse } from '@/interfaces/error.interface';

export const AddMovies = ({ id, info, checkedMovies, closePage }: AddMoviesPageProps) => {
	const [statePlaylistModal, setStatePlaylistModal] = useState<boolean>(false);
	const [isSendSaveRequest, setIsSendRequest] = useState<boolean>(false);
	const [isSendLoadRequest, setIsLoadRequest] = useState<boolean>(false);
	const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const [q, setQ] = useState<string>('');
	const [sort, setSort] = useState<SortEnumId>(SortEnumId.PremiereDesc);
	const [movies, setMovies] = useState<MovieShort[]>([]);
	const [checked, setChecked] = useState<number[]>(checkedMovies);
	const [page, setPage] = useState<{ value: number }>({ value: 1 });
	const { addNotification } = useContext(AppContext);
	const ref = useRef<HTMLDivElement>(null);
	const genres = useGenres();
	const router = useRouter();

	const onCheck = useCallback(
		(id: number) => {
			const isMoviesContains = checked.includes(id);
			if (!isMoviesContains && checked.length == MAX_MOVIES_IN_COLLECTION) {
				return addNotification({
					title: 'Превышен лимит',
					description: `Максимально фильмов на подборку – ${MAX_MOVIES_IN_COLLECTION}`,
					key: `maxMoviesInCollection${Date.now() / 1000}`
				});
			}
			setChecked((c) => {
				if (isMoviesContains) {
					return c.filter((a) => a !== id);
				}
				return c.concat(id);
			});
		},
		[addNotification, checked]
	);

	const saveMovies = async () => {
		setIsSendRequest(true);
		const body = {
			movies: checked
		};
		const response = await fetch(API.collections.setMovies + id, {
			credentials: 'include',
			method: 'post',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await response.json();
		if (isHttpError(result)) {
			return addNotification({ title: result.message, description: result.data.error, key: `errorResponse${Date.now() / 1000}` });
		}
		setIsSendRequest(false);
		router.reload();
	};

	const getMovies = async (take: number, skip: number) => {
		const body = { q, sort };
		const queries = '?' + new URLSearchParams({ take: take.toString(), skip: skip.toString() });
		const response = await fetch(API.movies.getByQueries + queries, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		const movies: MovieShort[] | IErrorResponse = await response.json();
		if (isHttpError(movies)) {
			console.error(movies.data.error);
			setIsLoadRequest(false);
			return setIsLastPage(true);
		}
		setMovies((m) => m.concat(movies));
		if (movies.length % MOVIES_PER_REQUEST !== 0 || !movies.length) {
			setIsLoadRequest(false);
			return setIsLastPage(true);
		}
		setIsLoadRequest(false);
	};

	const getMoviesDebounce = useDebounce(getMovies, 800);

	const handleScroll = useCallback(() => {
		if (!ref.current || isLastPage || isSendLoadRequest || ref.current.getBoundingClientRect().bottom - window.innerHeight - 100 >= 0) {
			return;
		}
		setIsLoadRequest(true);
		setPage({ value: page.value + 1 });
	}, [page, isSendLoadRequest, isLastPage]);

	useEffect(() => {
		setIsFirstRender(false);
		setIsLastPage(false);
		setMovies([]);
		setPage({ value: 1 });
	}, [q, sort]);

	useEffect(() => {
		document.body.classList[!statePlaylistModal ? 'remove' : 'add']('block-scroll');
	}, [statePlaylistModal]);

	useEffect(() => {
		document.addEventListener('scroll', handleScroll);
		return () => document.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	useEffect(() => {
		if (isFirstRender) return;
		(page.value == 1 ? getMoviesDebounce : getMovies)(MOVIES_PER_REQUEST, MOVIES_PER_REQUEST * (page.value - 1));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	return (
		<>
			<Head>
				<title>{createTitle('Изменение плейлиста')}</title>
			</Head>
			<div className={styles.titleWrapper}>
				<Htag tag="h2">
					Подборка: <span>{info.name}</span>
				</Htag>
				<ButtonGhost onClick={() => setStatePlaylistModal(true)}>Плейлист</ButtonGhost>
			</div>
			<input autoFocus placeholder="Аватар" value={q} onChange={(e) => setQ(e.target.value)} type="text" className={styles.search} />
			<div className={styles.sortWrapper}>
				<Sort className={styles.sort} sortId={sort} setSort={setSort} />
			</div>
			{useMemo(
				() => (
					<section ref={ref} className={styles.movies}>
						{movies.map((m) => (
							<div onClick={() => onCheck(m.id)} key={m.alias} className={styles.movie}>
								<div className={cn(styles.mark, { [styles.markChecked]: checked.includes(m.id) })} />
								<div className={styles.overlay} />
								<MovieBlock usePhrases={false} info={m} genres={genres} />
							</div>
						))}
					</section>
				),
				[checked, genres, movies, onCheck]
			)}
			<IsTruthy condition={isLastPage}>
				<P style={{ textAlign: 'center', display: 'block' }}>Больше не найдено</P>
			</IsTruthy>
			<IsTruthy condition={isSendLoadRequest || (!isLastPage && !movies.length)}>
				<div className="loader">
					<Loader />
				</div>
			</IsTruthy>
			<div className={styles.actions}>
				<Htag tag="h3">
					Выбрано <span>{checked.length}</span>
				</Htag>

				<div className={styles.actionsWrapper}>
					<Button onClick={closePage} children="Отмена" />
					<Button onClick={() => !isSendSaveRequest && saveMovies()} children="Сохранить" />
				</div>
			</div>
			<IsTruthy condition={statePlaylistModal}>
				<PlaylistMoviesModal
					moviesId={checked}
					setChecked={setChecked}
					stateModal={statePlaylistModal}
					closeModal={() => setStatePlaylistModal(false)}
				/>
			</IsTruthy>
		</>
	);
};

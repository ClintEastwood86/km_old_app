import { Actor, Button, Htag, IsTruthy, MovieCard, P, RestrictionModal, Slider } from '@/components';
import { MoviePageContext } from '@/contexts/moviePage.context';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import styles from './MoviePage.module.css';
import { PlayerErrorContent } from '@/components/Player/Player.error.content';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { IErrorResponse } from '@/interfaces/error.interface';
import { AppContext } from '@/contexts/app.context';
import { breakpoints } from './breakpoints';
import { Comments } from './Comments/Comments';
import { UserContext } from '@/contexts/user.context';
import { Collections } from './Collections/Collections';
import ym from 'react-yandex-metrika';
import { NotFoundPage } from '@/pages/404';
import TriangleIcon from './triangle.svg';
import MarkIcon from './mark.svg';
import { BlockedPage } from '@/pages/403';
import { Player } from '@/components/Player/Player';
import { CollapsMovie } from '@/interfaces/collaps.interface';
import { getCollapsMovie } from '@/configs/players.config';
import { Similars } from './Similars/Similars';

export const MoviePage = () => {
	const { movie } = useContext(MoviePageContext);
	const [activeMark, setActiveMark] = useState<boolean>(false);
	const { addNotification } = useContext(AppContext);
	const { isAuth } = useContext(UserContext);
	const [collapsMovie, setCollapsMovie] = useState<CollapsMovie | null>(null);

	const actors = useMemo(
		() => (
			<section className={styles.actors}>
				<Htag tag="h2">В главных ролях</Htag>
				<Slider gap={10} perView={4} breakpoints={breakpoints} className={styles.sliderActors}>
					{movie?.actors.map((a) => {
						return <Actor key={a.kinopoiskId} actor={a} />;
					})}
				</Slider>
			</section>
		),
		[movie]
	);

	const toggleMovieMark = async () => {
		if (!isAuth || !movie) {
			return addNotification({
				title: 'Авторизуйтесь',
				description: 'Для сохранения фильма у себя в профиле, нужна авторизация',
				key: Date.now().toString()
			});
		}
		const res = await fetch(API.users.toggleMark + movie.id, { credentials: 'include', method: 'put' });
		const lengthOrError: number | IErrorResponse = await res.json();
		if (isHttpError(lengthOrError)) return;
		addNotification({
			title: movie.nameRussian || movie.nameOriginal || 'Смотреть позже',
			description: `Отметка ${activeMark ? 'убрана' : 'установлена'}`,
			key: Date.now().toString()
		});
		setActiveMark((m) => !m);
	};

	const setStartStatusMark = useCallback(async () => {
		if (!isAuth || !movie) {
			return;
		}
		const res = await fetch(API.users.hasMarkInMovie + movie.id, { credentials: 'include' });
		const isMarked: boolean | IErrorResponse = await res.json();
		if (isHttpError(isMarked)) {
			return;
		}
		setActiveMark(isMarked);
	}, [isAuth, movie]);

	const fetchCollapsMovie = async (kpId: number) => {
		try {
			const movie = await getCollapsMovie(kpId);
			setCollapsMovie(movie);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		setStartStatusMark();
	}, [setStartStatusMark]);

	useEffect(() => {
		if (!movie) {
			return;
		}
		fetchCollapsMovie(movie.kinopoiskId);
	}, [movie]);

	useEffect(() => {
		const idInterval = setInterval(() => {
			if (typeof window == undefined) {
				return;
			}
			ym('reachGoal', 'seeMovie');
		}, 5 * 60 * 1000);
		return () => clearInterval(idInterval);
	}, []);

	useEffect(() => {
		const script = document.createElement('script');
		script.innerHTML = 'window.yaContextCb=window.yaContextCb||[]';
		document.head.appendChild(script);
		return () => {
			document.head.removeChild(script);
		};
	}, []);

	if (!movie) {
		return <NotFoundPage />;
	}

	if (movie.isBlocked) {
		return <BlockedPage />;
	}

	return (
		<>
			<MovieCard />

			<section>
				<Tabs className={styles.tabs}>
					<div className={styles.tabList}>
						<TabList>
							<Tab tabIndex="-1" className={styles.listButton}>
								<Button className={styles.button}>
									<TriangleIcon style={{ marginRight: '6px' }} />
									{movie.type == 'Film' ? 'Фильм' : 'Сериал'}
								</Button>
							</Tab>
							<Tab tabIndex="-1" className={styles.listButton}>
								<Button className={cn(styles.button, styles.trailer)}>Трейлер</Button>
							</Tab>
						</TabList>
						<Button tabIndex={-1} onClick={toggleMovieMark} className={cn(styles.button, styles.mark, styles.filled)}>
							<MarkIcon
								style={{ marginRight: '6px', transition: '.3s all ease' }}
								className={cn({ [styles.activeMark]: activeMark })}
							/>
							<p>Смотреть позже</p>
						</Button>
					</div>
					<TabPanel forceRender>
						<Player movie={movie} isAuth={isAuth} />
					</TabPanel>
					<TabPanel>
						<IsTruthy condition={!!collapsMovie?.trailer}>
							<iframe className={styles.trailerFrame} height="100%" width="100%" src={collapsMovie?.trailer} allowFullScreen />
						</IsTruthy>
						<IsTruthy condition={!collapsMovie?.trailer}>
							<PlayerErrorContent>
								<p>Трейлер в сделку не входил</p>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<P>
										Попробуйте найти его{' '}
										<a
											target="_blank"
											href={`https://www.youtube.com/results?search_query=${(movie.nameRussian || movie.nameOriginal)
												?.split(' ')
												.join('+')}`}>
											<u>тут</u>
										</a>
									</P>
								</div>
							</PlayerErrorContent>
						</IsTruthy>
					</TabPanel>
				</Tabs>
			</section>

			<IsTruthy condition={movie.actors.length > 0}>{actors}</IsTruthy>

			<Similars className={styles.similars} />

			<Collections className={styles.collections} />

			<Comments movieId={movie.id} className={styles.comments} />
			<IsTruthy condition={movie.genres.includes(29)}>
				<RestrictionModal />
			</IsTruthy>
		</>
	);
};

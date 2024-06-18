import { Actor, Button, Htag, IsTruthy, MovieCard, P, RestrictionModal, Slider, YAd } from '@/components';
import { MoviePageContext } from '@/contexts/moviePage.context';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import styles from './MoviePage.module.css';
import { PleerErrorContent } from '@/components/Pleer/Pleer.error.content';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { IErrorResponse } from '@/interfaces/error.interface';
import { AppContext } from '@/contexts/app.context';
import { breakpoints } from './breakpoints';
import { Comments } from './Comments/Comments';
import { UserContext } from '@/contexts/user.context';
import { Collections } from './Collections/Collections';
import ym from 'react-yandex-metrika';
import { Pleer } from '@/components/Pleer/Pleer';
import { NotFoundPage } from '@/pages/404';
import TriangleIcon from './triangle.svg';
import MarkIcon from './mark.svg';
import { useScript } from '@/hooks/script.hook';

export const MoviePage = () => {
	const { movie } = useContext(MoviePageContext);
	const [activeMark, setActiveMark] = useState<boolean>(false);
	const { addNotification } = useContext(AppContext);
	const { isAuth } = useContext(UserContext);

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

	useEffect(() => {
		setStartStatusMark();
	}, [setStartStatusMark]);

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
						<Pleer movie={movie} isAuth={isAuth} />
					</TabPanel>
					<TabPanel>
						<IsTruthy condition={!!movie.trailer}>
							<iframe
								className={styles.trailerFrame}
								height="100%"
								width="100%"
								src={movie.trailer}
								title="YouTube video player"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
							/>
						</IsTruthy>
						<IsTruthy condition={!movie.trailer}>
							<PleerErrorContent>
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
							</PleerErrorContent>
						</IsTruthy>
					</TabPanel>
				</Tabs>
			</section>

			<IsTruthy condition={movie.actors.length > 0}>{actors}</IsTruthy>

			<Collections className={styles.collections} />

			<Comments movieId={movie.id} className={styles.comments} />
			<IsTruthy condition={movie.genres.includes(29)}>
				<RestrictionModal />
			</IsTruthy>
		</>
	);
};

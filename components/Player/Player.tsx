import { Banner, IsTruthy, Loader, P } from '..';
import { PlayerErrorContent } from './Player.error.content';
import styles from './Player.module.css';
import { PlayerProps } from './Player.props';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MoviesConnectionResponse } from '@/interfaces/movies.websocket.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { API } from '@/helpers/api';
import { getPlayersConfigs } from '@/configs/players.config';
import { IPlayer, PlayerKey } from '@/interfaces/player.interface';
import { PlayerSwither } from './PlayerSwither/PlayerSwither';
import { adBlockIsEnabled } from '@/helpers/ads';

export const Player = ({ isAuth, movie, className, ...props }: PlayerProps): JSX.Element => {
	const [players, setPlayers] = useState<IPlayer[] | null>(null);
	const [isBadConnection, setIsBadConnection] = useState<boolean>(false);
	const [isNotFound, setIsNotFound] = useState<boolean>(false);
	const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);
	const [bannerIsWatched, setBannerIsWatched] = useState<boolean>(false);
	const [bannerIsVisible, setBannerIsVisible] = useState<boolean>(false);
	const adblockIsWorking = useRef<boolean>(false);
	const intervalPickId = useRef<ReturnType<typeof setInterval>>();
	const timerId = useRef<NodeJS.Timeout>();

	const displayAd = () => {
		if (adblockIsWorking.current) {
			return;
		}
		timerId.current = setTimeout(() => {
			setBannerIsVisible(true);
		}, 5000);
	};

	const closeBanner = () => {
		setBannerIsVisible(false);
	};

	const handleMessage = useCallback(
		(event: MessageEvent) => {
			if (!event.data || (typeof event.data == 'string' && !event.data.startsWith('{'))) {
				return;
			}
			try {
				const object = typeof event.data == 'object' ? event.data : JSON.parse(event.data);
				if (
					(('event' in object && object.event == 'play') || ('event' in object && object.event == 'startWatching')) &&
					!bannerIsWatched
				) {
					clearTimeout(timerId.current);
					console.log('Отобразить баннер');
					// displayAd();
					return setBannerIsWatched(true);
				}
			} catch (error) {
				console.error(error);
				setBannerIsWatched(true);
			}
		},
		[bannerIsWatched]
	);

	const sendViewTick = async (socket: WebSocket, token: string) => {
		socket.send(JSON.stringify({ token }));
		console.log('Tick');
	};

	const onMessage = useCallback((e: MessageEvent, socket: WebSocket) => {
		const response: MoviesConnectionResponse | IErrorResponse = JSON.parse(e.data);
		if (isHttpError(response)) {
			console.log(response.data.error);
			return socket.close(4000);
		}
		intervalPickId.current = setInterval(() => sendViewTick(socket, response.data.token), 1000 * 60);
	}, []);

	const openConnection = useCallback(() => {
		if (!movie || !isAuth) {
			return;
		}
		const socket = new WebSocket(API.movies.websocket + `?movie=${movie.id}`);
		socket.onopen = () => console.log('Connection opened');
		socket.onclose = (e) => {
			e.code !== 1000 && e.code !== 1005 && openConnection();
			console.log('Connection closed ' + e.reason);
		};
		socket.onmessage = (e) => onMessage(e, socket);
		return socket;
	}, [isAuth, movie, onMessage]);

	useEffect(() => {
		(async () => {
			adblockIsWorking.current = await adBlockIsEnabled();
		})();
	}, []);

	useEffect(() => {
		const socket = openConnection();

		const timer = setTimeout(() => {
			socket?.close(4000);
		}, 1000 * 60 * 60 * 5);

		return () => {
			clearTimeout(timer);
			clearInterval(intervalPickId.current);
			if (socket) {
				socket.onmessage = () => {
					null;
				};
				socket.close(1000);
			}
		};
	}, [openConnection]);

	useEffect(() => {
		if (!selectedPlayer || selectedPlayer.key == PlayerKey.ALLOHA) {
			return;
		}
		(async () => {
			try {
				const response = await fetch(selectedPlayer.src);
				response.status == 404 && players?.length == 1 && setIsNotFound(true);
			} catch (error) {
				setIsBadConnection(true);
			}
		})();

		return () => {
			setIsNotFound(false);
			setIsBadConnection(false);
		};
	}, [selectedPlayer, players?.length]);

	useEffect(() => {
		(async () => {
			const players = await getPlayersConfigs(movie);
			setPlayers(players);
			setSelectedPlayer(players[0] ?? null);
		})();

		return () => setPlayers(null);
	}, [movie]);

	useEffect(() => {
		setBannerIsWatched(false);
		clearTimeout(timerId.current);
	}, [selectedPlayer]);

	useEffect(() => {
		window.addEventListener('message', handleMessage);

		return () => window.removeEventListener('message', handleMessage);
	}, [handleMessage]);

	return (
		<div {...props} className={className}>
			<div className={styles.player}>
				<IsTruthy condition={isNotFound}>
					<PlayerErrorContent>
						<p style={{ textAlign: 'center', display: 'block' }}>Фильм не найден</p>
						<P style={{ marginTop: 8, display: 'flex', justifyContent: 'center', maxWidth: 510, paddingInline: 10 }}>
							Но мы уже в процессе добавления этого фильма на сайт. Поэтому заходите немного позже и наслаждайтесь просмотром!{' '}
						</P>
					</PlayerErrorContent>
				</IsTruthy>
				<IsTruthy condition={!players}>
					<div className={styles.loader}>
						<Loader />
					</div>
				</IsTruthy>

				<IsTruthy condition={!isBadConnection && !isNotFound}>
					<iframe className={styles.frame} src={selectedPlayer?.src} allowFullScreen />
				</IsTruthy>

				<IsTruthy condition={bannerIsVisible}>
					<div className={styles.bannerWrapper}>
						<button className={styles.bannerCloseButton} onClick={closeBanner}>
							<p>Закрыть</p>
						</button>
						<Banner onClick={closeBanner} className={styles.banner} type="fullscreen" />
					</div>
				</IsTruthy>

				{players && !isNotFound && <PlayerSwither selectedPlayer={selectedPlayer} setPlayer={setSelectedPlayer} players={players} />}
			</div>

			<P color="red" className={styles.reportMessage} size="s">
				Если не отображаются некоторые плееры, попробуйте зайти с VPN
			</P>
			<P className={styles.reportMessage} size="s">
				Все видео взяты из открытых источников. Если мы нарушили авторское право - пишите на почту! Контакты:{' '}
				<a style={{ textDecoration: 'underline' }} href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_REPORT}`}>
					{process.env.NEXT_PUBLIC_EMAIL_REPORT}
				</a>
				. После бесплатного просмотра настоятельно рекомендуем купить официальную копию на таких легальных сайтах как ivi, okko,
				hd.kinopoisk, megogo и т.д.
			</P>
			<P className={styles.reportMessage} size="s">
				Наш сайт не призывает и не предлагает играть в азартные игры, мы категорически против азартных игр. Рекламные сообщения об
				онлайн-казино, которые появляются при просмотре фильмов, являются фейковыми и не имеют отношения к нашему сайту
			</P>
		</div>
	);
};

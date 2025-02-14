import { IsTruthy, Loader, P } from '..';
import { PlayerErrorContent } from './Player.error.content';
import styles from './Player.module.css';
import { PlayerProps } from './Player.props';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MoviesConnectionResponse } from '@/interfaces/movies.websocket.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { API } from '@/helpers/api';
import { getPlayersConfigs } from '@/configs/players.config';
import { IPlayer } from '@/interfaces/player.interface';
import { PlayerSwither } from './PlayerSwither/PlayerSwither';

export const Player = ({ isAuth, movie, className, ...props }: PlayerProps): JSX.Element => {
	const [players, setPlayers] = useState<IPlayer[] | null>(null);
	const [isBadConnection, setIsBadConnection] = useState<boolean>(false);
	const [isNotFound, setIsNotFound] = useState<boolean>(false);
	const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);
	const intervalPickId = useRef<ReturnType<typeof setInterval>>();

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
		if (!selectedPlayer || selectedPlayer.name == 'ALLOHA') {
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
			const players = await getPlayersConfigs(movie.kinopoiskId);
			setPlayers(players);
			setSelectedPlayer(players[0] ?? null);
		})();

		return () => setPlayers(null);
	}, [movie]);

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
				<IsTruthy condition={isBadConnection}>
					<PlayerErrorContent>
						<p style={{ textAlign: 'center', display: 'block' }}>Отключите VPN</p>
						<P style={{ marginTop: 8, maxWidth: 560, display: 'block', paddingInline: 10 }}>
							Не удалось загрузить фильм, попробуйте отключить VPN. <br />
							Если проблема остается напишите нам на почту{' '}
							<a style={{ textDecoration: 'underline' }} href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_REPORT}`}>
								{process.env.NEXT_PUBLIC_EMAIL_REPORT}
							</a>
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

				{players && !isNotFound && <PlayerSwither selectedPlayer={selectedPlayer} setPlayer={setSelectedPlayer} players={players} />}
			</div>

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

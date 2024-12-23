import { IsTruthy, Loader, P } from '..';
import { PleerErrorContent } from './Pleer.error.content';
import styles from './Pleer.module.css';
import cn from 'classnames';
import { PleerProps } from './Pleer.props';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useScript } from '@/hooks/script.hook';
import { MoviesConnectionResponse } from '@/interfaces/movies.websocket.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { API } from '@/helpers/api';

const bannedHosts: string[] = ['ashdi', 'cdnmovies', 'kinotochka', 'kinovibe'];
const priorityHost = 'bedemp2';

export const Pleer = ({ isAuth, movie, className, ...props }: PleerProps): JSX.Element => {
	const [movieIsNotFound, setMovieIsNotFound] = useState<boolean>(false);
	const wrapperPleer = useRef<HTMLDivElement>(null);
	const intervalId = useRef<NodeJS.Timer>();
	const observer = useRef<MutationObserver>();
	const intervalPickId = useRef<ReturnType<typeof setInterval>>();
	useScript('https://kinobd.net/js/player_.js');

	const phrasesAreInText = (text: string, phrases: string[]) => {
		for (const phrase of phrases) {
			if (text.includes(phrase)) {
				return true;
			}
		}
		return false;
	};

	const clearButton = useCallback((btn: HTMLDivElement) => {
		if (btn.getAttribute('onclick')?.toLowerCase().includes('укр') || phrasesAreInText(btn.getAttribute('data-iframe') || '', bannedHosts)) {
			btn.remove();
		}
		if (btn.getAttribute('data-iframe')?.includes(priorityHost)) {
			btn.click();
		}
	}, []);

	const handlePleer = useCallback(() => {
		let buttons = document.querySelectorAll<HTMLDivElement>('#kinobd-buttons > div');
		const iframe = document.querySelector<HTMLIFrameElement>('#kinobd-iframe');
		if (!buttons.length && iframe?.src && bannedHosts.includes(new URL(iframe.src).host)) {
			setMovieIsNotFound(true);
			clearInterval(intervalId.current);
		}
		if (!buttons.length) return;
		buttons.forEach(clearButton);
		clearInterval(intervalId.current);
		buttons = document.querySelectorAll<HTMLDivElement>('#kinobd-buttons > div');
		if (!buttons.length) {
			setMovieIsNotFound(true);
		}
		buttons.forEach((btn) => (btn.style.display = 'block'));
	}, [intervalId, clearButton]);

	const onLoadPleer = useCallback(() => {
		if (wrapperPleer.current?.querySelector('iframe')?.src == 'https://kinobd.net/film_not_found') {
			setMovieIsNotFound(true);
			clearInterval(intervalId.current);
			observer.current?.disconnect();
		}
	}, []);

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
		if (!wrapperPleer.current) return;
		const wrapper = wrapperPleer.current;
		observer.current = new MutationObserver(onLoadPleer);
		observer.current.observe(wrapper, { subtree: true, attributes: true });

		return () => observer.current?.disconnect();
	}, [onLoadPleer]);

	useEffect(() => {
		intervalId.current = setInterval(() => {
			handlePleer();
		}, 500);
		return () => clearInterval(intervalId.current);
	}, [handlePleer]);

	useEffect(() => {
		if (typeof window == undefined) return;
		const open = XMLHttpRequest.prototype.open;

		XMLHttpRequest.prototype.open = function (
			this: XMLHttpRequest,
			method: string,
			url: string | URL,
			async?: boolean,
			username?: string | null,
			password?: string | null
		) {
			if (typeof url === 'string' ? url.includes('strosin') : url instanceof URL && url.host.includes('strosin')) {
				return console.error('Запрос был прекращён. Причина: запрос к запрещённой рекламе');
			}

			return open.call(this, method, url, async ?? true, username, password);
		};
	}, []);

	return (
		<div {...props} className={cn(className, { [styles.hiddenPleer]: movieIsNotFound })} ref={wrapperPleer}>
			<div className={cn({ [styles.hidden]: !movieIsNotFound })}>
				<PleerErrorContent>
					<p style={{ textAlign: 'center', display: 'block' }}>Фильм не найден</p>
					<P style={{ marginTop: 8, display: 'flex', justifyContent: 'center', maxWidth: 510, paddingInline: 10 }}>
						Но мы уже в процессе добавления этого фильма на сайт. Поэтому заходите немного позже и наслаждайтесь просмотром!{' '}
					</P>
				</PleerErrorContent>
			</div>

			<div className={styles.pleer} data-inid={movie.id} id="kinobd" />
			<IsTruthy condition={typeof movieIsNotFound !== 'boolean' && !movieIsNotFound}>
				<div className={styles.pleer}>
					<div className={cn('loader', styles.loader)}>
						<Loader />
					</div>
				</div>
			</IsTruthy>

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

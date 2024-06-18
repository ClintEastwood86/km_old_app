import { Button, EmptyPoster, IsTruthy, Modal, P } from '@/components';
import { PlaylistMoviesModalProps } from './PlaylistMoviesModal.props';
import Image from 'next/image';
import styles from './PlaylistMoviesModal.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MovieShort } from '@/interfaces/movie.interface';
import { API } from '@/helpers/api';
import { MOVIES_PER_REQUEST } from '@/page-component/CollectionMoviesPage/CollectionMovies.constants';

export const PlaylistMoviesModal = ({ moviesId, setChecked, closeModal, stateModal }: PlaylistMoviesModalProps) => {
	const [movies, setMovies] = useState<MovieShort[]>([]);
	const [rejectedMovies, setRejectedMovies] = useState<number[]>([]);
	const [page, setPage] = useState<number>(1);
	const [isSendRequest, setIsSendRequest] = useState<boolean>(false);
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);

	const setPoster = (src: string | undefined, alt: string) => {
		if (!src) return <EmptyPoster size="small" usePhrases={false} />;
		return <Image unoptimized fill src={src} alt={alt} loader={() => src} />;
	};

	const deleteMovieFromPlaylist = (id: number) => {
		setMovies((movies) => movies.filter((m) => m.id !== id));
		setRejectedMovies((m) => m.concat(id));
	};

	const getMovies = useCallback(
		async (take: number, skip: number) => {
			setIsSendRequest(true);
			const body = {
				take,
				skip,
				movies: moviesId
			};
			const response = await fetch(API.movies.getByArray, {
				headers: { 'Content-Type': 'application/json' },
				method: 'post',
				body: JSON.stringify(body),
				credentials: 'include'
			});
			const movies: MovieShort[] = await response.json();
			if (!movies.length && movies.length % MOVIES_PER_REQUEST !== 0) {
				setIsLastPage(true);
			}
			setMovies((m) => m.concat(movies));
			setIsSendRequest(false);
		},
		[moviesId]
	);

	const saveChanges = async () => {
		const arrayId: number[] = [];
		for (const id of moviesId) {
			!rejectedMovies.includes(id) && arrayId.push(id);
		}
		setChecked(arrayId);
		closeModal();
	};

	const handleScroll = useCallback(() => {
		if (
			!isSendRequest &&
			!isLastPage &&
			ref.current &&
			ref.current.scrollHeight - (ref.current.scrollTop + ref.current.clientHeight) < 100
		) {
			setPage((p) => p + 1);
		}
	}, [isLastPage, isSendRequest]);

	useEffect(() => {
		getMovies(MOVIES_PER_REQUEST, MOVIES_PER_REQUEST * (page - 1));
	}, [getMovies, page]);

	useEffect(() => {
		ref.current?.addEventListener('scroll', handleScroll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
		return () => ref.current?.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	return (
		<Modal title="Плейлист" closeModal={closeModal} stateModal={stateModal}>
			<div ref={ref} className={styles.movies}>
				{movies.map((m, i) => (
					<button
						autoFocus={i == 0}
						onClick={() => deleteMovieFromPlaylist(m.id)}
						key={m.alias}
						className={styles.movie}
						title={m.nameRussian ?? m.nameOriginal}>
						{setPoster(m.poster, m.alias)}
					</button>
				))}
			</div>
			<IsTruthy condition={!moviesId.length}>
				<P style={{ textAlign: 'center', display: 'block' }}>Плейлист пуст</P>
			</IsTruthy>
			<div className={styles.actions}>
				<Button onClick={closeModal}>Отмена</Button>
				<Button onClick={saveChanges}>Сохранить</Button>
			</div>
		</Modal>
	);
};

import { Htag, Loader, P } from '@/components';
import { useEffect, useState } from 'react';
import { getLeaderboardSnapshot } from './api';
import { NotFoundPage } from '@/pages/404';
import { LeaderboardSnapshotResult } from '@/interfaces/leaderboard.interface';
import styles from './Recap2025Page.module.css';
import { Leaderboard, Speech, WinnerCard } from './ui';

export const Recap2025Page = (): JSX.Element => {
	const [isNotFound, setIsNotFound] = useState<boolean>(false);
	const [snapshot, setSnapshot] = useState<LeaderboardSnapshotResult>();

	const loadShapshot = async () => {
		try {
			const snapshot = await getLeaderboardSnapshot();
			setSnapshot(snapshot);
		} catch (error) {
			console.error(error);
			setIsNotFound(true);
		}
	};

	useEffect(() => {
		loadShapshot();
	}, []);

	if (isNotFound) {
		return <NotFoundPage />;
	}
	if (!snapshot) {
		return <Loader className="loader-page" />;
	}

	return (
		<>
			<section className={styles['top']}>
				<Htag className={styles['title']} tag="h1">
					🏆 Итоги 2025 года
				</Htag>
				<div className={styles['first-stage']}>
					<WinnerCard position="gold" leaderboardUser={snapshot.top[0]} />
				</div>
				<div className={styles['second-stage']}>
					<WinnerCard position="silver" leaderboardUser={snapshot.top[1]} />
					<WinnerCard position="bronze" leaderboardUser={snapshot.top[2]} />
				</div>
			</section>
			<section className={styles['wrapper']}>
				<div className={styles['block']}>
					<Htag tag="h2">Место в рейтинге</Htag>
					<br />
					<Htag tag="h3">Как строится рейтинг?</Htag>
					<P color="gray">
						Места распределены на основе заработанных очков опыта. Чем больше фильмов вы смотрите и комментируете и чем выше ваша
						активность, тем выше позиция
					</P>
					<Leaderboard snapshot={snapshot} className={styles['leaderboard']} />
				</div>
				<div className={styles['block']}>
					<Speech />
				</div>
			</section>
		</>
	);
};

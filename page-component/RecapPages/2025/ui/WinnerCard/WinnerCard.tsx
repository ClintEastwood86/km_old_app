import { LeaderboardSnapshotResult } from '@/interfaces/leaderboard.interface';
import styles from './WinnerCard.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { AvatarEmpty, Htag, P } from '@/components';
import { myLoader } from '@/helpers/loader';
import parse from 'html-react-parser';
import { useRanks } from '@/hooks/ranks.hook';
import GoldCoin from '@/public/coin.svg';
import SilverCoin from '@/public/silver_coin.svg';
import BronzeCoin from '@/public/bronze_coin.svg';
import Clock from '@/public/clock.svg';
import { useMemo } from 'react';

interface Props {
	position: 'gold' | 'silver' | 'bronze';
	leaderboardUser: LeaderboardSnapshotResult['top'][number];
}

export const WinnerCard = ({ leaderboardUser, position }: Props): JSX.Element => {
	const ranks = useRanks(true);

	const Coin = useMemo(() => {
		switch (position) {
			case 'silver':
				return SilverCoin;
			case 'bronze':
				return BronzeCoin;
		}
		return GoldCoin;
	}, [position]);

	return (
		<div className={classNames(styles['card'], styles[position])}>
			<Link href={`/user/${leaderboardUser.userId}`} className={classNames(styles['user'])}>
				<div className={styles['avatar']}>
					{leaderboardUser.user.avatar ? (
						<Image
							src={process.env.NEXT_PUBLIC_DOMAIN + leaderboardUser.user.avatar}
							unoptimized
							loader={myLoader}
							alt={leaderboardUser.user.login}
							fill
						/>
					) : (
						<AvatarEmpty className={styles['empty-avatar']} />
					)}
				</div>
				<div className={styles['user-wrapper']}>
					<div className={styles['login']}>
						<Htag color="secondary" tag="h3">
							{leaderboardUser.user.login}
						</Htag>
						{leaderboardUser.user.awardSelected && parse(leaderboardUser.user.awardSelected.icon)}
					</div>
					<P className={styles['rank']} color="grayLight" size="s">
						{ranks.find((rank) => rank.id == leaderboardUser.user.rankId)?.name || 'Загрузка...'}
					</P>
				</div>
			</Link>

			<div className={styles['bottom-info']}>
				<div className={styles['stats']}>
					<div className={styles['time']}>
						<Clock className={styles['icon']} />
						<P size="m" color="grayLight">
							Просмотрено {`${Math.floor(leaderboardUser.minutesWatched / 60)}ч ${leaderboardUser.minutesWatched % 60}м`}
						</P>
					</div>
					<div className={styles['points']}>
						<Coin />
						<P size="m" color="grayLight">
							Заработано {Intl.NumberFormat('ru-RU').format(leaderboardUser.pointsAchieved)} очков
						</P>
					</div>
				</div>
				<span className={styles.badge}>{leaderboardUser.position} место</span>
			</div>
		</div>
	);
};

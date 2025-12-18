import { AvatarEmpty, Table } from '@/components';
import { UserContext } from '@/contexts/user.context';
import { LeaderboardSnapshotResult } from '@/interfaces/leaderboard.interface';
import { TableHTMLAttributes, useCallback, useContext, useMemo } from 'react';
import styles from './Leaderboard.module.css';
import { ITableHead } from '@/interfaces/table.interface';
import classNames from 'classnames';
import Image from 'next/image';
import { myLoader } from '@/helpers/loader';
import { useRanks } from '@/hooks/ranks.hook';
import Coin from '@/public/coin.svg';
import Link from 'next/link';

interface TableItem {
	position: JSX.Element;
	profile: JSX.Element;
	rank: JSX.Element;
	points: JSX.Element;
	time: JSX.Element;
}

const tableHead: ITableHead[] = [
	{ name: 'Место', key: 'position' },
	{ name: 'Профиль', key: 'profile' },
	{ name: 'Звание', key: 'rank' },
	{ name: 'Очков', key: 'points' },
	{ name: 'Время просмотра', key: 'time' }
];

interface Props extends TableHTMLAttributes<HTMLTableElement> {
	snapshot: LeaderboardSnapshotResult;
}

export const Leaderboard = ({ snapshot, className, ...props }: Props): JSX.Element => {
	const ranks = useRanks();
	const user = useContext(UserContext);

	const activeIndex = useMemo(() => {
		if (!user || !user.isAuth) {
			return -1;
		}
		return snapshot.top.slice(3).findIndex((u) => u.userId == user.id);
	}, [snapshot.top, user]);

	const getAvatarElement = (avatar?: string) => {
		return avatar ? (
			<Image src={process.env.NEXT_PUBLIC_DOMAIN + avatar} unoptimized loader={myLoader} alt={avatar} fill />
		) : (
			<AvatarEmpty />
		);
	};

	const constuctTableRow = useCallback(
		(u: LeaderboardSnapshotResult['top'][number]) => ({
			position: <p>{u.position}</p>,
			profile: (
				<Link href={`/user/${u.userId}`} className={styles['profile']}>
					<div className={styles['avatar']}>{getAvatarElement(u.user.avatar)}</div> <p>{u.user.login}</p>
				</Link>
			),
			rank: <p>{ranks.find((rank) => rank.id == u.rankId)?.name || 'Загрузка...'}</p>,
			points: (
				<div className={styles['points']}>
					<Coin className={styles['coin']} />
					<p>+{Intl.NumberFormat('ru-RU').format(u.pointsAchieved)}</p>
				</div>
			),
			time: <p>+{`${Math.floor(u.minutesWatched / 60)}ч ${u.minutesWatched % 60}м`}</p>
		}),
		[ranks]
	);

	const data = useMemo(() => {
		const list = snapshot.top.slice(3).map<TableItem>(constuctTableRow);
		if (user && user.isAuth && snapshot.user && activeIndex == -1) {
			list.push({ position: <p>...</p>, profile: <p></p>, rank: <p></p>, points: <p></p>, time: <p></p> });
			list.push(
				constuctTableRow({
					...snapshot.user,
					user
				})
			);
		}
		return list;
	}, [activeIndex, constuctTableRow, snapshot.top, snapshot.user, user]);

	return (
		<Table
			short
			activeIndex={user.isAuth && activeIndex == -1 ? data.length - 1 : activeIndex}
			data={data}
			head={tableHead}
			className={classNames(className, styles['table'])}
			{...props}
		/>
	);
};

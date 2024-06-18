import { Button, Htag, IsTruthy, P } from '@/components';
import styles from './Rank.module.css';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { RankProps } from './Rank.props';
import { profileRoutes } from '@/configs/profile.routes.config';
import { useRanks } from '@/hooks/ranks.hook';
import { useEffect, useState } from 'react';
import { IRank } from '@/interfaces/rank.interface';
import cn from 'classnames';

export const Rank = ({ userPoints, rankId, className, ...props }: RankProps) => {
	const ranks = useRanks();
	const [nextRank, setNextRank] = useState<IRank | undefined>(undefined);

	useEffect(() => {
		setNextRank(ranks.find((r) => r.id == rankId + 1));
	}, [rankId, ranks]);

	const setCircleProgressbar = (nextRank: IRank | undefined) => {
		const percent = nextRank ? Math.floor((userPoints * 100) / nextRank.points) : 100;
		return (
			<div className={styles.circle}>
				<CircularProgressbarWithChildren
					counterClockwise
					strokeWidth={10}
					className={styles.circleSvg}
					value={percent}
					children={<Htag tag="h2">{percent}%</Htag>}
				/>
			</div>
		);
	};

	return (
		<div {...props} className={cn(className, styles.rank)}>
			{setCircleProgressbar(nextRank)}
			<Htag className={styles.title} tag="h2">
				Ранг
			</Htag>
			<div className={styles.wrapper}>
				<P>Текущий: {ranks.find((r) => r.id == rankId)?.name}</P>
				<IsTruthy condition={!!nextRank}>
					<P>Следующий: {nextRank?.name}</P>
				</IsTruthy>
			</div>
			<Button className={styles.button} stretch href={profileRoutes.stats}>
				Таблица рангов
			</Button>
		</div>
	);
};

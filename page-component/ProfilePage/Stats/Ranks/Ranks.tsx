import styles from './Ranks.module.css';
import { IRank } from '@/interfaces/rank.interface';
import { RanksProps } from './Ranks.props';
import { SectionHead } from '@/components/SectionHead/SectionHead';
import { Progressbar, Table } from '@/components';
import { ITableHead } from '@/interfaces/table.interface';
import parse from 'html-react-parser';

const tableHead: ITableHead[] = [
	{ name: 'ID', key: 'id' },
	{ name: 'Название', key: 'name' },
	{ name: 'Кол-во очков', key: 'points' },
	{ name: 'Награда', key: 'award' }
];

export const Ranks = ({ awards, userRankId, userPoints, ranks, className, ...props }: RanksProps) => {
	const omitTimestampsFromRank = ({ awardId, createdAt, updatedAt, ...spread }: IRank) => {
		return {
			...spread,
			award: !awardId && awards ? '' : parse(awards.find((award) => award.id == awardId)?.icon ?? '')
		};
	};

	return (
		<section {...props} className={className}>
			<SectionHead title="Таблица рангов" description="Здесь представлены все возможные ранги зрителя" />
			<Progressbar
				className={styles.progressbar}
				value={userPoints}
				limit={userRankId == ranks.length ? null : ranks[userRankId].points}
			/>
			<Table
				className={styles.rankTable}
				activeIndex={userRankId - 1}
				data={ranks.map((rank) => omitTimestampsFromRank(rank))}
				head={tableHead}
			/>
		</section>
	);
};

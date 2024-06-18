import { SectionHead } from '@/components/SectionHead/SectionHead';
import { PointsProps } from './Points.props';
import { ITableHead } from '@/interfaces/table.interface';
import { Table } from '@/components';
import { IPointsItem } from '@/interfaces/points.interface';

const tableHead: ITableHead[] = [
	{ name: 'Действие', key: 'name' },
	{ name: 'Добавляемое кол-во очков', key: 'addPoints' }
];

export const Points = ({ pointsItems, className, ...props }: PointsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const omitIdAndTimeStamps = ({ id, ...props }: IPointsItem) => props;

	return (
		<section {...props} className={className}>
			<SectionHead title="Таблица очков" description="За эти действия вы будете получать очки для повышения звания" />
			<Table style={{ marginTop: '22px' }} head={tableHead} data={pointsItems.map((item) => omitIdAndTimeStamps(item))} />
		</section>
	);
};

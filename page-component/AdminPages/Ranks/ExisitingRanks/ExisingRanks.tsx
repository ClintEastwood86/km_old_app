import { Table } from '@/components';
import { ExisingRanksProps } from './ExisingRanks.props';
import cn from 'classnames';
import styles from './ExisingRanks.module.css';
import { ITableHead } from '@/interfaces/table.interface';
import { useCallback, useEffect, useState } from 'react';
import { IRank } from '@/interfaces/rank.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import { useAwards } from '@/hooks/awards.hook';
import Edit from '@/public/edit.svg';
import Link from 'next/link';

const tableHead: ITableHead[] = [
	{ name: 'ID', key: 'id' },
	{ name: 'Создан', key: 'createdAt' },
	{ name: 'Изменён', key: 'updatedAt' },
	{ name: 'Название', key: 'name' },
	{ name: 'Значок', key: 'icon' },
	{ name: 'Очков', key: 'points' },
	{ name: 'Действия', key: 'actions' }
];

interface IRowTable {
	id: number;
	createdAt: string;
	updatedAt: string;
	name: string;
	icon: ReturnType<typeof parse>;
	points: number;
	actions: JSX.Element[];
}

export const ExistingRanks = ({ className, ...props }: ExisingRanksProps) => {
	const [rows, setRows] = useState<IRowTable[]>([]);
	const [ranks, setRanks] = useState<IRank[]>([]);
	const awards = useAwards(true);

	const getRanks = async () => {
		const response = await fetch(API.ranks.get, { credentials: 'include' });
		const awards: IRank[] | IErrorResponse = await response.json();
		if (isHttpError(awards)) {
			return;
		}
		setRanks(awards);
	};

	const constructData = useCallback(
		(rank: IRank): IRowTable => {
			const award = awards.find((a) => a.id == rank.awardId);
			return {
				id: rank.id,
				createdAt: dayjs(rank.createdAt).locale('ru-RU').format('DD-MM-YYYY'),
				updatedAt: dayjs(rank.updatedAt).locale('ru-RU').format('DD-MM-YYYY'),
				name: rank.name,
				icon: parse(award?.icon || ''),
				points: rank.points,
				actions: [
					<Link href={`/admin/ranks/${rank.id}`} title="Редактировать" key="edit">
						<Edit />
					</Link>
				]
			};
		},
		[awards]
	);

	useEffect(() => {
		getRanks();
	}, []);

	useEffect(() => {
		const rows = ranks.map(constructData);
		setRows(rows);
	}, [ranks, constructData]);

	return (
		<section {...props} className={cn(className)}>
			<Table appearance="light" className={styles.table} head={tableHead} data={rows} />
		</section>
	);
};

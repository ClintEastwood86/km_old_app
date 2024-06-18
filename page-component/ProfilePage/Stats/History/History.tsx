import { Button, IsTruthy, Loader, P, Table } from '@/components';
import { SectionHead } from '@/components/SectionHead/SectionHead';
import { IPointsItem } from '@/interfaces/points.interface';
import { HistoryItem, HistoryItemTableRow } from '@/interfaces/rank.interface';
import { ITableHead } from '@/interfaces/table.interface';
import { isHistoryItemUsesTemplate } from '@/typeguards/historyItem.typeguard';
import { HistoryProps } from './History.props';
import styles from './History.module.css';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { IErrorResponse } from '@/interfaces/error.interface';

const tableHead: ITableHead[] = [
	{ name: 'Дата', key: 'date' },
	{ name: 'Название', key: 'name' },
	{ name: 'Добавлено очков', key: 'addPoints' },
	{ name: 'Множитель', key: 'multiplier' }
];

export const History = ({ pointsItems, className, ...props }: HistoryProps) => {
	const [dataTable, setDataTable] = useState<HistoryItem[]>([]);
	const [page, setPage] = useState<number>(0);
	const [isEmpty, setIsEmpty] = useState<boolean>(false);
	const [requestIsRunning, setRequestIsRunning] = useState<boolean>(false);

	const ref = useRef<HTMLDivElement>(null);

	const updateDataTable = async (page: number) => {
		setRequestIsRunning(true);
		const params = new URLSearchParams({
			take: process.env.NEXT_PUBLIC_HISTORY_CAPACITY as string,
			skip: (page * Number(process.env.NEXT_PUBLIC_HISTORY_CAPACITY)).toString()
		});
		const response = await fetch(API.ranks.getHistory + '?' + params.toString(), { credentials: 'include' });
		const dataOrError: HistoryItem[] | IErrorResponse = await response.json();
		if (isHttpError(dataOrError)) {
			setIsEmpty(true);
			return;
		}
		setDataTable((data) => data.concat(dataOrError));
		if (dataOrError.length % Number(process.env.NEXT_PUBLIC_HISTORY_CAPACITY) !== 0) {
			setIsEmpty(true);
		}
		setRequestIsRunning(false);
	};

	const incrementPage = () => {
		setPage((p) => p + 1);
	};

	useEffect(() => {
		if (isEmpty || requestIsRunning) {
			return;
		}
		updateDataTable(page);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const removeDublicates = (data: HistoryItem[]) => {
		return data.reduce((prev: [item: HistoryItem, count: number][], curr: HistoryItem) => {
			const lastTuple = prev[prev.length - 1];
			if (
				!lastTuple ||
				!isHistoryItemUsesTemplate(curr) ||
				!isHistoryItemUsesTemplate(lastTuple[0]) ||
				lastTuple[0].pointsItemId !== curr.pointsItemId ||
				new Date(lastTuple[0].pointsAddedAt).getDate() !== new Date(curr.pointsAddedAt).getDate()
			) {
				prev.push([curr, 1]);
				return prev;
			}
			lastTuple[1]++;
			prev[prev.length - 1] = lastTuple;
			return prev;
		}, []);
	};

	const transformHistoryDataTable = (data: [item: HistoryItem, count: number][]): HistoryItemTableRow[] => {
		return data.map((tuple) => {
			const row = tuple[0];
			const pointsAddedAt = dayjs(row.pointsAddedAt).format('YYYY-MM-DD');
			const constructName = (name: string) => (
				<>
					{name}
					{tuple[1] > 1 && (
						<P size="s" color="secondary" className={styles.count}>
							{tuple[1]}x
						</P>
					)}
				</>
			);
			if (isHistoryItemUsesTemplate(row)) {
				const usedPointsItem = pointsItems.find((item) => item.id == row.pointsItemId) as IPointsItem;
				return {
					pointsAddedAt,
					name: constructName(usedPointsItem?.name),
					addPoints: usedPointsItem?.addPoints,
					userMultiplier: row.userMultiplier
				};
			}
			return {
				pointsAddedAt,
				name: constructName(row.name),
				addPoints: row.addPoints,
				userMultiplier: row.userMultiplier
			};
		});
	};

	if (!page && isEmpty) {
		return <></>;
	}

	return (
		<section style={{ position: 'relative' }} ref={ref} {...props} className={className}>
			<SectionHead title="История пополнения очков" description="Лог получения очков" />
			<Table className={styles.table} head={tableHead} short data={transformHistoryDataTable(removeDublicates(dataTable))} />
			<IsTruthy condition={!isEmpty && !requestIsRunning}>
				<Button onClick={incrementPage} style={{ margin: '20px auto 0' }}>
					Загрузить еще
				</Button>
			</IsTruthy>
			<IsTruthy condition={!isEmpty && requestIsRunning}>
				<div className={styles.loaderWrapper}>
					<Loader />
				</div>
			</IsTruthy>
		</section>
	);
};

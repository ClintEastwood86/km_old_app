import { useCallback, useContext, useEffect, useState } from 'react';
import { ExistingAwardsProps } from './ExistingAwards.props';
import { IAward } from '@/interfaces/awards.interface';
import { API } from '@/helpers/api';
import parse from 'html-react-parser';
import { ConfirmModal, DragSortable, IsTruthy, P, Table } from '@/components';
import styles from './ExistingAwards.module.css';
import { ITableHead } from '@/interfaces/table.interface';
import Cross from '@/public/cross.svg';
import Edit from '@/public/edit.svg';
import { AppContext } from '@/contexts/app.context';
import { isHttpError } from '@/typeguards/error.typeguard';
import { IErrorResponse } from '@/interfaces/error.interface';
import Link from 'next/link';
import { SectionHead } from '@/components/SectionHead/SectionHead';

const tableHead: ITableHead[] = [
	{ name: 'ID', key: 'id' },
	{ name: 'Иконка', key: 'icon' },
	{ name: 'Название', key: 'name' },
	{ name: 'Как получить', key: 'condition' },
	{ name: 'Действия', key: 'actions' }
];

interface IRowTable {
	id: number;
	icon: string | JSX.Element | JSX.Element[];
	name: string | JSX.Element;
	description: string | JSX.Element;
	actions: JSX.Element[];
}

export const ExistingAwards = ({ className, ...props }: ExistingAwardsProps) => {
	const [awards, setAwards] = useState<IAward[]>([]);
	const [rows, setRows] = useState<IRowTable[]>([]);
	const { addNotification } = useContext(AppContext);

	const [stateDeleteModal, setStateDeleteModal] = useState<boolean>(false);
	const [checkedAward, setCheckedAward] = useState<IAward>();

	const getAwards = async () => {
		const response = await fetch(API.awards.get, { credentials: 'include' });
		const awards: IAward[] | IErrorResponse = await response.json();
		if (isHttpError(awards)) {
			return;
		}
		setAwards(awards);
	};

	const onDelete = async () => {
		if (!checkedAward) {
			return addNotification({ key: 'notFound', title: 'Не выбран значок' });
		}
		const response = await fetch(API.awards.delete + checkedAward.id, { method: 'delete', credentials: 'include' });
		const award: IAward | IErrorResponse = await response.json();
		const isHttpErrorResponse = isHttpError(award);
		if (!response.ok && !isHttpErrorResponse) {
			setStateDeleteModal(false);
			return addNotification({ key: '500', title: await response.text() });
		}
		if (isHttpErrorResponse) {
			setStateDeleteModal(false);
			return addNotification({ key: `${award.code}`, title: award.message, description: award.data.error });
		}
		addNotification({ key: 'success', title: 'Значок успешно удалён', description: `Значок с id ${award.id} был удалён` });
		setRows((rows) => rows.filter((row) => row.id !== award.id));
		setStateDeleteModal(false);
	};

	const openDeleteModal = (award: IAward) => {
		setCheckedAward(award);
		setStateDeleteModal(true);
	};

	const constructData = useCallback((award: IAward): IRowTable => {
		return {
			id: award.id,
			icon: parse(award.icon),
			name: award.name,
			description: award.description,
			actions: [
				<button title="Удалить" onClick={() => openDeleteModal(award)} key="delete">
					<Cross />
				</button>,
				<Link href={`/admin/awards/${award.id}`} title="Редактировать" key="edit">
					<Edit />
				</Link>
			]
		};
	}, []);

	const constructPositionItem = (item: IAward) => {
		return (
			<div className={styles.positionItem}>
				<div className={styles.positionIcon}>{parse(item.icon)}</div>
				<P size="m">{item.name}</P>
			</div>
		);
	};

	const onChangePosition = async (awards: IAward[]) => {
		const body = { awards: awards.map((a, i, arr) => ({ id: a.id, position: arr.length - i })) };
		fetch(API.awards.updatePositions, {
			body: JSON.stringify(body),
			method: 'PUT',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' }
		});
	};

	useEffect(() => {
		getAwards();
	}, []);

	useEffect(() => {
		const rows = awards.map(constructData);
		setRows(rows);
	}, [awards, constructData]);

	return (
		<section {...props} className={className}>
			<Table appearance="light" className={styles.table} head={tableHead} data={rows} />
			<section className={styles.position}>
				<SectionHead title="Позиции значков" />
				<DragSortable<IAward>
					className={styles.sortable}
					onSwap={onChangePosition}
					setItems={setAwards}
					items={awards}
					constructItem={constructPositionItem}
				/>
			</section>
			<IsTruthy condition={!!checkedAward}>
				<ConfirmModal
					onConfirm={onDelete}
					title={`Удалить ${checkedAward?.name}`}
					stateModal={stateDeleteModal}
					closeModal={() => setStateDeleteModal(false)}
				/>
			</IsTruthy>
		</section>
	);
};

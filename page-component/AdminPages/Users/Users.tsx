import { AvatarEmpty, Button, ErrorBlock, Select, Input, IsTruthy, Table, Loader } from '@/components';
import { SectionHead } from '@/components/SectionHead/SectionHead';
import { ITableHead } from '@/interfaces/table.interface';
import { UserModelForAdmin, UserRole, UsersForAdminPanelEnum } from '@/interfaces/user.interface';
import { IUsersTableItem } from './UsersTable.interface';
import Link from 'next/link';
import Image from 'next/image';
import { myLoader } from '@/helpers/loader';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './Users.module.css';
import Block from '@/public/block.svg';
import Unblock from '@/public/unblock.svg';
import Multiplier from '@/public/multiplier.svg';
import Points from '@/public/points.svg';
import { AddPointsModal } from './AddPointsModal/AddPointsModal';
import { BlockModal } from './BlockModal/BlockModal';
import { API } from '@/helpers/api';
import { USERS_PER_REQUEST, usersFilterQueries } from './Users.constants';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useDebounce } from '@/hooks/debounde.hook';
import { SelectQueryItem } from '@/components/Select/Select.props';
import Head from 'next/head';
import { createTitle } from '@/helpers/title';
import { useAuth } from '@/hooks/auth.hook';
import { AddBonusModal } from './AddBonusModal/AddBonusModal';

const tableHead: ITableHead[] = [
	{ name: 'ID', key: 'id' },
	{ name: 'Аватарка', key: 'avatar' },
	{ name: 'Логин', key: 'login' },
	{ name: 'Почта', key: 'email' },
	{ name: 'Очки', key: 'points' },
	{ name: 'Действия', key: 'actions' }
];

export const UsersAdminPage = () => {
	const [items, setItems] = useState<IUsersTableItem[]>([]);
	const [checkedUser, setCheckedUser] = useState<UserModelForAdmin>();
	const [stateModalPoints, setStateModalPoints] = useState<boolean>(false);
	const [stateModalBlock, setStateModalBlock] = useState<boolean>(false);
	const [stateModalBonus, setStateModalBonus] = useState<boolean>(false);
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const [sortId, setSortId] = useState<UsersForAdminPanelEnum>(UsersForAdminPanelEnum.NEW);
	const [isSendRequest, setIsSendRequest] = useState<boolean>(false);
	const [page, setPage] = useState<{ count: number }>({ count: 1 });
	const [q, setQ] = useState<string>('');
	const isFirstRender = useRef<boolean>(true);
	const { authState } = useAuth(UserRole.MODERATOR);

	const openModal = (user: UserModelForAdmin, setState: Dispatch<SetStateAction<boolean>>) => {
		setCheckedUser(user);
		setState(true);
	};

	const getUsers = async (take: number, skip: number, q?: string) => {
		setIsSendRequest(true);
		const response = await fetch(API.users.getUsersForAdminPanel, {
			credentials: 'include',
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ take, skip, q, sort: sortId })
		});
		const users: UserModelForAdmin[] | IErrorResponse = await response.json();
		if (isHttpError(users)) {
			setIsSendRequest(false);
			return console.error(users);
		}
		if (!users.length || users.length % USERS_PER_REQUEST !== 0) {
			setIsLastPage(true);
		}
		setItems((i) => i.concat(users.map(constructRow)));
		setIsSendRequest(false);
	};

	const changePage = useDebounce(() => {
		setItems([]);
		setPage({ count: 1 });
	}, 1000);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		changePage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [q, sortId]);

	useEffect(() => {
		getUsers(USERS_PER_REQUEST, USERS_PER_REQUEST * (page.count - 1), q);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const constructRow = (item: UserModelForAdmin): IUsersTableItem => {
		const avatar = item.avatar ? (
			<Image src={process.env.NEXT_PUBLIC_DOMAIN + item.avatar} alt={item.login} unoptimized fill loader={myLoader} />
		) : (
			<AvatarEmpty />
		);
		return {
			id: <div className={styles.id}>{item.id}</div>,
			avatar: (
				<div className={styles.avatar}>
					<Link className={styles.avatarLink} href={`/user/${item.id}`}>
						{avatar}
					</Link>
				</div>
			),
			login: <p>{item.login}</p>,
			email: <p>{item.email ?? 'Нет доступа'}</p>,
			points: <p>{Intl.NumberFormat('ru-RU').format(item.userPoints)}</p>,
			actions: [
				<button title="Добавить очков" onClick={() => openModal(item, setStateModalPoints)} key="points">
					<Points />
				</button>,
				<button title="Выдать множитель" onClick={() => openModal(item, setStateModalBonus)} key="multiplier">
					<Multiplier />
				</button>,
				<button
					title={`${item.blocked ? 'Разблокировать' : 'Заблокировать'} пользователя`}
					onClick={() => openModal(item, setStateModalBlock)}
					key="block">
					{item.blocked ? <Unblock /> : <Block />}
				</button>
			]
		};
	};

	const onSelect = (item: SelectQueryItem<(typeof usersFilterQueries)[0]['value']>) => {
		setSortId(item.value);
	};

	if (isHttpError(authState)) {
		return <ErrorBlock setTitle response={authState} />;
	}

	if (!authState) {
		return <Loader className="loader-page" />;
	}

	return (
		<>
			<Head>
				<title>{createTitle('Пользователи')}</title>
			</Head>
			<div className={styles.titleWrapper}>
				<div>
					<SectionHead tag="h1" appearanceTag="h2" title="Пользователи" description="Панель управления с пользователями" />
				</div>
				<div>
					<Input id="searchUser" placeholder="Garner01" value={q} onChange={(e) => setQ(e.target.value)} />
				</div>
			</div>
			<Select appearance="small" onSelectClose onSelect={onSelect} queries={usersFilterQueries} />
			<Table className={styles.table} appearance="light" short head={tableHead} data={items} />
			<IsTruthy condition={!isLastPage && !isSendRequest}>
				<Button onClick={() => setPage((p) => ({ count: p.count + 1 }))} className={styles.loadButton}>
					Загрузить еще
				</Button>
			</IsTruthy>
			<AddPointsModal
				login={checkedUser?.login || ''}
				userId={checkedUser?.id || 0}
				stateModal={stateModalPoints}
				closeModal={() => setStateModalPoints(false)}
			/>
			<AddBonusModal
				login={checkedUser?.login || ''}
				userId={checkedUser?.id || 0}
				stateModal={stateModalBonus}
				closeModal={() => setStateModalBonus(false)}
			/>
			<BlockModal
				login={checkedUser?.login || ''}
				userId={checkedUser?.id || 0}
				stateModal={stateModalBlock}
				closeModal={() => setStateModalBlock(false)}
				isBlocked={checkedUser?.blocked || false}
			/>
		</>
	);
};

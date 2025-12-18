/* eslint-disable prettier/prettier */
import { Htag, P, Pre, ReadProgress, Table } from '@/components';
import { withLayout } from '@/layout/Layout';
import styles from '@/styles/blog.module.css';
import { createTitle } from '@/helpers/title';
import Head from 'next/head';
import { useProgress } from '@/hooks/readProgress.hook';
import { ITableHead } from '@/interfaces/table.interface';
import { useEffect, useMemo, useState } from 'react';
import { Holidays } from '@/interfaces/holidays.interface';
import { API } from '@/helpers/api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

const tableHead: ITableHead[] = [
	{ name: 'Название', key: 'name' },
	{ name: 'Начало', key: 'start' },
	{ name: 'Конец', key: 'end' },
	{ name: 'Бонус', key: 'bonus' }
];

const title = createTitle('Бонусы (Блог)');
const description =
	'Бонусы - это специальные награды, которые могут значительно ускорить ваш путь к высшим рангам. Но как их получить? Все очень просто! Бонусы доступны в различных событиях и акциях, которые мы проводим на нашем сайте в честь больших праздников, розыгрышей и в специальные праздничные моменты в году.';

const BonusBlog = () => {
	const percent = useProgress();
	const [data, setData] = useState<Holidays[]>([]);
	dayjs.extend(utc);

	const constructData = (data: Holidays[]) => {
		return data.map(({ start, end, bonus, name }) => {
			return {
				name,
				start: dayjs(start).utc().format('YYYY-MM-DD'),
				end: dayjs(end).utc().format('YYYY-MM-DD'),
				bonus: bonus + 'X'
			};
		});
	};

	const setHolidays = async () => {
		const response = await fetch(API.bonus.getHolidays);
		setData(await response.json());
	};

	const getActiveIndex = (data: Holidays[]) => {
		if (!data.length) return;
		const now = Date.now();
		return data.findIndex((h) => new Date(h.start).getTime() < now && new Date(h.end).getTime() > now);
	};

	useEffect(() => {
		setHolidays();
	}, []);

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
				<meta property="og:type" content="article" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
			</Head>
			<main className={styles.blog}>
				<ReadProgress percent={percent} />
				<Htag tag="h1" color="white">
					Бонусы (Множители)
				</Htag>
				<P>
					Бонусы - это специальные награды, которые могут значительно ускорить ваш путь к высшим рангам. Но как их получить? Все очень
					просто! Бонусы доступны в различных событиях и акциях, которые мы проводим на нашем сайте в честь больших праздников,
					розыгрышей и в специальные праздничные моменты в году.
				</P>
				<P>
					Как работают бонусы? Все довольно прозрачно. Вы получаете бонусы (множители). Однако, их действие рассчитывается на основе
					формулы:
				</P>
				<Pre className={styles.formula}>
					<P style={{ marginTop: 0 }} color="red">
						(X1 + X2 + ... + Xn) * 0.9<sup>n-1</sup>
					</P>
				</Pre>
				<P>Чем больше бонусов у вас есть, тем выше будет ваш общий множитель, и тем быстрее вы будете подниматься по рангам.</P>
				<P>
					Зачем вам нужны эти бонусы? Помимо ускорения вашего пути к высшим рангам, бонусы также делают ваш профиль более
					привлекательным для других пользователей. Ваша активность и преданность сайту становятся более заметными благодаря вашим
					достижениям и множителям бонусов.
				</P>
				<Htag style={{ marginBlock: '20px -10px' }} tag="h3">
					Ближайшие праздники
				</Htag>
				{useMemo(
					() => (
						<Table
							activeIndex={getActiveIndex(data)}
							appearance="light"
							className={styles.awardsTable}
							head={tableHead}
							data={constructData(data)}
						/>
					),
					[data]
				)}
			</main>
		</>
	);
};

//

// Эти бонусы - ваш секретный ингредиент к успеху. Они помогут вам быстрее достичь высоких рангов и получить доступ к новым функциям нашего сайта.

export default withLayout(BonusBlog);

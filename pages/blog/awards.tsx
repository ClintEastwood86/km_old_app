/* eslint-disable prettier/prettier */
import { Htag, P, ReadProgress, Table } from '@/components';
import { withLayout } from '@/layout/Layout';
import styles from '@/styles/blog.module.css';
import { createTitle } from '@/helpers/title';
import Head from 'next/head';
import { useProgress } from '@/hooks/readProgress.hook';
import { ITableHead } from '@/interfaces/table.interface';
import { IAward } from '@/interfaces/awards.interface';
import { useAwards } from '@/hooks/awards.hook';
import parse from 'html-react-parser';
import { useMemo } from 'react';

const tableHead: ITableHead[] = [
	{ name: 'Иконка', key: 'icon' },
	{ name: 'Название', key: 'name' },
	{ name: 'Как получить', key: 'condition' }
];

const title = createTitle('Значки (Блог)');
const description =
	'В KingMovies вы можете получать значки за различные действия, описаные в таблице. Это поможет сделать ваш профиль более уникальным и привлекательным для других пользователей.Значки видны в вашем профиле и в комментариях. Выставление значков в профиле - отличный способ выразить свою индивидуальность и подчеркнуть свои интересы. На нашем киносайте вы найдете широкий выбор тематических значков из фильмов, которые помогут вам выразить себя и свои предпочтения.';

const AwardsBlog = () => {
	const percent = useProgress();
	const data = useAwards(false);

	const constructData = (data: IAward[]) => {
		return data.map(({ icon, name, description }) => {
			return {
				icon: parse(icon),
				name,
				description
			};
		});
	};

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
					Значки
				</Htag>
				<P>
					На нашем киносайте вы можете получать значки за различные действия, описаные в таблице. Это поможет сделать ваш профиль более
					уникальным и привлекательным для других пользователей. Значки видны в вашем профиле и в комментариях.
				</P>
				<P>
					Выставление значков в профиле - отличный способ выразить свою индивидуальность и подчеркнуть свои интересы. На нашем киносайте вы
					найдете широкий выбор тематических значков из фильмов, которые помогут вам выразить себя и свои предпочтения. Наши значки не просто
					рандомные иконки, а отражают настоящую эстетику кино и могут стать отличным дополнением к вашему профилю.
				</P>
				<P>
					Кроме того, значки на нашем киносайте могут стать призом в конкурсах и акциях. Это еще один стимул для пользователей делать больше действий на сайте и получать больше удовольствия
					от использования нашего веб-приложения.
				</P>
				{useMemo(
					() => (
						<Table appearance="light" className={styles.awardsTable} head={tableHead} data={constructData(data)} />
					),
					[data]
				)}
				<P>
					Не упустите возможность улучшить свой профиль на киносайте и получить призы за свои достижения! Зарегистрируйтесь на нашем
					веб-приложении и начните собирать значки уже сегодня.
				</P>
			</main>
		</>
	);
};

export default withLayout(AwardsBlog);

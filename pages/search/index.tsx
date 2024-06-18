import { withLayout } from '@/layout/Layout';
import { Search } from '@/page-component/SearchPage/SearchPage-component';
import Head from 'next/head';
import { createTitle } from '@/helpers/title';

const SearchPage = () => {
	const title = createTitle('Расширенный поиск фильмов');
	const description =
		'Мощный инструмент для расширенного поиска фильмов. Огромная база фильмов в HD качестве. Невероятный выбор фильмов на любой вкус! Быстрый и простой способ найти фильмы, которые ищешь.Огромный каталог фильмов с расширенными фильтрами.Удивительная возможность найти свою идеальную картину!';
	return (
		<>
			<Head>
				<title>{title}</title>
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta name="description" content={description} />
				<link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/search`} />
			</Head>
			<Search />
		</>
	);
};

export default withLayout(SearchPage);

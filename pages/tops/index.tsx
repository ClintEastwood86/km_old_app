import { createTitle } from '@/helpers/title';
import { withLayout } from '@/layout/Layout';
import Head from 'next/head';
import { TopsPage } from '@/page-component/TopsPage/TopsPage';

const Tops = (): JSX.Element => {
	return (
		<>
			<Head>
				<title>{createTitle('Популярные сегодня')}</title>
				<meta
					name="description"
					content={`KingMovies — лучший бесплатный киносайт ${new Date().getFullYear()} года, с более чем 100 000 фильмов. Лучшие фильмы, сериалы и мультфильмы онлайн бесплатно, в хорошем качестве HD без рекламы`}
				/>
				<meta name="og:title" content={createTitle('Популярные сегодня')} />
				<meta
					property="og:description"
					content={`KingMovies — лучший бесплатный киносайт ${new Date().getFullYear()} года, с более чем 100 000 фильмов. Лучшие фильмы, сериалы и мультфильмы онлайн бесплатно, в хорошем качестве HD без рекламы`}
				/>
				<meta />
			</Head>
			<TopsPage />
		</>
	);
};

export default withLayout(Tops);

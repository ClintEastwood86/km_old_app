import { createTitle } from '@/helpers/title';
import { withLayout } from '../layout/Layout';
import Head from 'next/head';
import { MainPage } from '@/page-component/MainPage/Main';

function Home() {
	return (
		<>
			<Head>
				<title>{createTitle('Главная')}</title>
				<meta
					name="description"
					content={`KingMovies — лучший бесплатный киносайт ${new Date().getFullYear()} года, с более чем 100 000 фильмов. Лучшие фильмы, сериалы и мультфильмы онлайн бесплатно, в хорошем качестве HD`}
				/>
				<meta name="og:title" content={createTitle('Главная')} />
				<meta
					property="og:description"
					content={`KingMovies — лучший бесплатный киносайт ${new Date().getFullYear()} года, с более чем 100 000 фильмов. Лучшие фильмы, сериалы и мультфильмы онлайн бесплатно, в хорошем качестве HD`}
				/>
				<meta />
			</Head>
			<MainPage />
		</>
	);
}

export default withLayout(Home);

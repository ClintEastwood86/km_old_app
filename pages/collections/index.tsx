/* eslint-disable prettier/prettier */
import { createTitle } from '@/helpers/title';
import { withLayout } from '@/layout/Layout';
import { CollectionsPage } from '@/page-component/CollectionsPage/CollectionsPage';
import Head from 'next/head';

const Collections = () => {
	const title = createTitle('Пользовательские подборки');
	const description =
		'Наши пользовательские подборки фильмов - ваш путеводитель в мире кино! Здесь вы найдете разнообразные коллекции фильмов, созданные нашими страстными киноманами. Независимо от вашего вкуса - будь то драмы, комедии, научная фантастика или классика - у нас есть подборка, которая подарит вам незабываемые кинематографические впечатления. Заходите, создавайте свои собственные подборки и делитесь ими с друзьями!';

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta property="og:type" content="article" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta name="description" content={description} />
				<meta name="keywords" content="фильмы в кино подборки про жанры пользовательские подборки приватные подборки" />
			</Head>
			<CollectionsPage />
		</>
	);
};

export default withLayout(Collections);

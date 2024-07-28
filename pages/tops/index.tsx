import { createTitle } from '@/helpers/title';
import { withLayout } from '@/layout/Layout';
import Head from 'next/head';
import { TopsPage } from '@/page-component/TopsPage/TopsPage';

const Tops = (): JSX.Element => {
	return (
		<>
			<Head>
				<title>{createTitle('Популярные сегодня')}</title>
				<meta name="description" content={`Самые просматриваемые фильмы этой недели`} />
				<meta name="og:title" content={createTitle('Популярные сегодня')} />
				<meta property="og:description" content={`Самые просматриваемые фильмы этой недели`} />
				<meta />
			</Head>
			<TopsPage />
		</>
	);
};

export default withLayout(Tops);

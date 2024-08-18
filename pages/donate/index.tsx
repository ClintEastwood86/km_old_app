import { createTitle } from '@/helpers/title';
import { withLayout } from '@/layout/Layout';
import { DonatePage } from '@/page-component/DonatePage/DonatePage';
import Head from 'next/head';

const title = createTitle('Поддержите наш сайт');
const description = 'Ваше пожертвование поможет улучшить функционал и сделать доступ к фильмам ещё удобнее';

const Donate = (): JSX.Element => {
	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
				<meta property="og:type" content="article" />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
			</Head>
			<DonatePage />
		</>
	);
};

export default withLayout(Donate);

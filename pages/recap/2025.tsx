import { createTitle } from '@/helpers/title';
import { withLayout } from '../../layout/Layout';
import { Recap2025Page } from '@/page-component/RecapPages/2025/Recap2025Page';
import Head from 'next/head';

const RecapPage = () => {
	return (
		<>
			<Head>
				<title>{createTitle('🏆 Итоги 2025 года')}</title>
			</Head>
			<Recap2025Page />
		</>
	);
};

export default withLayout(RecapPage);

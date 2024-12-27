import { withLayout } from '@/layout/Layout';
import { createTitle } from '@/helpers/title';
import Head from 'next/head';
import { ErrorBlock } from '@/components';
import { IErrorResponse } from '@/interfaces/error.interface';

const response: IErrorResponse = {
	code: 403,
	context: 'forbidden',
	message: 'Фильм заблокирован',
	data: {
		error: 'К сожалению, нам пришлось заблокировать этот фильм по требованию правообладателя'
	}
};

export const BlockedPage = () => {
	return (
		<>
			<Head>
				<title>{createTitle('Данная страница закрыта по запросу правообладателя')}</title>
			</Head>
			<ErrorBlock response={response} />
		</>
	);
};

export default withLayout(BlockedPage);

import { withLayout } from '@/layout/Layout';
import { createTitle } from '@/helpers/title';
import Head from 'next/head';
import { ErrorBlock } from '@/components';
import { IErrorResponse } from '@/interfaces/error.interface';

const response: IErrorResponse = {
	code: 404,
	context: 'notFound',
	message: 'Page Not Found',
	data: {
		error: 'Вы попали на скрытую страницу с секретным фильмом, или страница не найдена'
	}
};

export const NotFoundPage = () => {
	return (
		<>
			<Head>
				<title>{createTitle('Секретная страница с фильмом')}</title>
			</Head>
			<ErrorBlock response={response} />
		</>
	);
};

export default withLayout(NotFoundPage);

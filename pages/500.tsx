import { withLayout } from '@/layout/Layout';
import { createTitle } from '@/helpers/title';
import Head from 'next/head';
import { ErrorBlock } from '@/components';
import { IErrorResponse } from '@/interfaces/error.interface';

const response: IErrorResponse = {
	code: 500,
	context: 'Error',
	message: 'Internal Server Error',
	data: {
		error: 'Произошла ошибка не сервере'
	}
};

const error500Page = () => {
	return (
		<>
			<Head>
				<title>{createTitle('Ошибка на сервере')}</title>
			</Head>
			<ErrorBlock response={response} />
		</>
	);
};

export default withLayout(error500Page);

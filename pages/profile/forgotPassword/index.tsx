import { createTitle } from '@/helpers/title';
import { withLayout } from '@/layout/Layout';
import { ChangePasswordWithToken } from '@/page-component/ProfilePage/Profile/ChangePasswordWithToken/ChangePasswordWithToken';
import Head from 'next/head';

const ForgotPasswordPage = (): JSX.Element => {
	return (
		<>
			<Head>
				<title>{createTitle('Смена пароля')}</title>
			</Head>
			<ChangePasswordWithToken />
		</>
	);
};

export default withLayout(ForgotPasswordPage);

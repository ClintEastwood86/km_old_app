import { AppContext } from '@/contexts/app.context';
import { API } from '@/helpers/api';
import { withLayout } from '@/layout/Layout';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect } from 'react';

const ConfirmEmailPage = () => {
	const router = useRouter();
	const { addNotification } = useContext(AppContext);

	const handleConfirmAccount = useCallback(async () => {
		const token = router.asPath.substring(router.asPath.lastIndexOf('/') + 1);
		if (token.length < 40) {
			return router.push('/', undefined, { shallow: true });
		}
		const response = await fetch(API.users.confirmAccount + token, { method: 'put', credentials: 'include' });
		const messageIdOrError = await response.json();
		if (isHttpError(messageIdOrError)) {
			addNotification({
				title: messageIdOrError.message,
				description: messageIdOrError.data.error,
				key: Math.random().toString()
			});
		}
		router.push('/');
	}, [addNotification, router]);

	useEffect(() => {
		handleConfirmAccount();
	}, [handleConfirmAccount]);

	return <></>;
};

export default withLayout(ConfirmEmailPage);

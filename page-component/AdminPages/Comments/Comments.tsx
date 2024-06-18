import { StatusCommentEnum } from '@/interfaces/comment.interface';
import { SectionComments } from './SectionComments/SectionComments';
import styles from './Comments.module.css';
import Head from 'next/head';
import { createTitle } from '@/helpers/title';
import { useAuth } from '@/hooks/auth.hook';
import { isHttpError } from '@/typeguards/error.typeguard';
import { ErrorBlock, Loader } from '@/components';
import { UserRole } from '@/interfaces/user.interface';

export const CommentsAdminPage = (): JSX.Element => {
	const { authState } = useAuth(UserRole.MODERATOR);

	if (isHttpError(authState)) {
		return <ErrorBlock setTitle response={authState} />;
	}

	if (!authState) {
		return <Loader className="loader-page" />;
	}

	return (
		<>
			<Head>
				<title>{createTitle('Комментарии')}</title>
			</Head>
			<div className={styles.wrapper}>
				<SectionComments title="На проверке" status={StatusCommentEnum.Draft} />
				<SectionComments title="Опубликованные" status={StatusCommentEnum.Published} />
				<SectionComments title="Отклоненные" status={StatusCommentEnum.Reject} />
			</div>
		</>
	);
};

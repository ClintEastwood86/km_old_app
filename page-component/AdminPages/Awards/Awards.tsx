import { SectionHead } from '@/components/SectionHead/SectionHead';
import { AwardConstructor } from './Constructor/Constructor';
import styles from './Awards.module.css';
import { ExistingAwards } from './ExistingAwards/ExistingAwards';
import { createTitle } from '@/helpers/title';
import Head from 'next/head';
import { useAuth } from '@/hooks/auth.hook';
import { UserRole } from '@/interfaces/user.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { ErrorBlock, Loader } from '@/components';

export const AwardsAdminPage = () => {
	const { authState } = useAuth(UserRole.ADMIN);

	if (isHttpError(authState)) {
		return <ErrorBlock setTitle response={authState} />;
	}

	if (!authState) {
		return <Loader className="loader-page" />;
	}

	return (
		<>
			<Head>
				<title>{createTitle('Значки')}</title>
			</Head>
			<SectionHead tag="h1" appearanceTag="h2" title="Значки" description="Удобная панель управления значками" />
			<ExistingAwards className={styles.awards} />
			<AwardConstructor className={styles.constructorsWrapper} />
		</>
	);
};

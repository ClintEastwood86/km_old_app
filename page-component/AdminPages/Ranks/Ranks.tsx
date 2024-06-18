import { ErrorBlock, Loader } from '@/components';
import { SectionHead } from '@/components/SectionHead/SectionHead';
import { createTitle } from '@/helpers/title';
import { useAuth } from '@/hooks/auth.hook';
import { UserRole } from '@/interfaces/user.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import Head from 'next/head';
import { ExistingRanks } from './ExisitingRanks/ExisingRanks';
import styles from './Ranks.module.css';
import { RankConstructor } from './Constructor/Constructor';

export const RanksAdminPage = () => {
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
				<title>{createTitle('Звания')}</title>
			</Head>
			<SectionHead tag="h1" appearanceTag="h2" title="Звания" description="Панель управления званиями" />
			<ExistingRanks className={styles.ranks} />
			<RankConstructor className={styles.constructorsWrapper} />
		</>
	);
};

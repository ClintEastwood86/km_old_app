import { ErrorBlock, Loader, Route, Wrapper } from '@/components';
import styles from './ProfilePage-component.module.css';
import { useContext } from 'react';
import { ProfileContext } from '@/contexts/profile.context';
import { TopWrapper } from './TopWrapper/TopWrapper';
import { Navbar } from './Navbar/Navbar';
import { useRouter } from 'next/router';
import { Profile } from './Profile/Profile';
import { profileRoutes } from '@/configs/profile.routes.config';
import { Stats } from './Stats/Stats';
import { Movies } from './Movies/Movies';
import { isHttpError } from '@/typeguards/error.typeguard';

export const ProfilePage = (): JSX.Element => {
	const { user, ranks, pointsItems, awards } = useContext(ProfileContext);
	const router = useRouter();

	const generateBodyProfile = (path: string) => {
		if (!user || isHttpError(user)) {
			return;
		}
		if (Object.values(profileRoutes).includes(path)) {
			return (
				<>
					<Route
						component={<Stats awards={awards} pointsItems={pointsItems} ranks={ranks} user={user} />}
						router={router}
						route={profileRoutes.stats}
					/>
					<Route component={<Movies />} router={router} route={profileRoutes.movies} />
				</>
			);
		}
		return <Profile login={user.login} email={user.email} notification={user.notification} />;
	};

	if (isHttpError(user)) {
		return <ErrorBlock response={user} />;
	}

	if (!user) {
		return <Loader className="loader-page" />;
	}

	return (
		<>
			<TopWrapper
				userId={user.id}
				avatar={user.avatar}
				icon={user.awardSelected ? user.awardSelected.icon : undefined}
				login={user.login}
			/>
			<div className={styles.container}>
				<Navbar route={router.asPath} />
				<Wrapper className={styles.main}>{generateBodyProfile(router.asPath)}</Wrapper>
			</div>
		</>
	);
};

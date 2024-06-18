import { ProfileContextProvider } from '@/contexts/profile.context';
import { API } from '@/helpers/api';
import { useAwards } from '@/hooks/awards.hook';
import { usePoints } from '@/hooks/points.hook';
import { useRanks } from '@/hooks/ranks.hook';
import { UserModel } from '@/interfaces/user.interface';
import { withLayout } from '@/layout/Layout';
import { ProfilePage } from '@/page-component/ProfilePage/ProfilePage-component';
import { createTitle } from '@/helpers/title';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { IErrorResponse } from '@/interfaces/error.interface';

const Profile = (): JSX.Element => {
	const [user, setUser] = useState<UserModel | IErrorResponse | undefined>(undefined);
	const ranks = useRanks(true);
	const pointsItems = usePoints(true);
	const awards = useAwards(true);

	const getUserData = useCallback(async () => {
		const response = await fetch(API.users.info, { credentials: 'include' });
		const user: IErrorResponse | UserModel = await response.json();
		setUser(user);
	}, []);

	useEffect(() => {
		getUserData();
	}, [getUserData]);

	return (
		<>
			<Head>
				<title>{createTitle('Мой профиль')}</title>
			</Head>
			<ProfileContextProvider awards={awards} pointsItems={pointsItems} user={user} ranks={ranks}>
				<ProfilePage />
			</ProfileContextProvider>
		</>
	);
};

export default withLayout(Profile);

import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { Footer } from './Footer/Footer';
import { Header } from './Header/Header';
import styles from './Layout.module.css';
import { LayoutProps } from './Layout.props';
import cn from 'classnames';
import { LoginModal } from './LoginModal/LoginModal';
import { LayoutContextProvider } from '@/contexts/layout.context';
import { RegisterModal } from './RegisterModal/RegisterModal';
import { useRouter } from 'next/router';
import { UserModelShort } from '@/interfaces/user.interface';
import { API } from '@/helpers/api';
import { NotificationData } from '@/components/Notification/Notification.type';
import { AppContextProvider } from '@/contexts/app.context';
import { Notification } from '@/components';
import { UserContextProvider } from '@/contexts/user.context';
import { useCookies } from '@/hooks/cookies.hook';
import { Up } from '@/components/';
import { ForgotPasswordModal } from './ForgotPasswordModal/ForgotPasswordModal';

export const Layout = ({ header = 'default', children }: LayoutProps): JSX.Element => {
	const router = useRouter();
	const { iHaveCookie } = useCookies();
	const [notifications, setNotifications] = useState<NotificationData[]>([]);
	const [stateLoginModal, setStateLoginModal] = useState<boolean>(false);
	const [stateRegisterModal, setStateRegisterModal] = useState<boolean>(false);
	const [stateForgotPasswordModal, setStateForgotPasswordModal] = useState<boolean>(false);
	const [userData, setUserData] = useState<UserModelShort | null>(null);

	const memoizedFooter = useMemo(() => <Footer className={cn(styles.footer)} />, []);
	const memoizedHeader = useMemo(() => {
		return <Header header={header} user={userData} containerClassStyle={styles.container} className={cn(styles.header)} />;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userData]);

	const getUserData = useCallback(async () => {
		if (!iHaveCookie()) {
			return;
		}
		const res = await fetch(API.users.info + '?type=short', { credentials: 'include' });
		if (!res.ok) return;
		const user: UserModelShort = await res.json();
		setUserData(user);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		getUserData();
	}, [getUserData]);

	return (
		<AppContextProvider setNotification={setNotifications}>
			<UserContextProvider user={userData ? { ...userData, isAuth: true } : { isAuth: false }}>
				<LayoutContextProvider openRegisterModal={() => setStateRegisterModal(true)} openLoginModal={() => setStateLoginModal(true)}>
					{memoizedHeader}
				</LayoutContextProvider>
				<main className={cn(styles.main, styles.container)}>{children}</main>
				{memoizedFooter}

				<LoginModal
					router={router}
					stateModal={stateLoginModal}
					closeModal={() => setStateLoginModal(false)}
					openForgotPasswordModal={() => setStateForgotPasswordModal(true)}
				/>
				<ForgotPasswordModal stateModal={stateForgotPasswordModal} closeModal={() => setStateForgotPasswordModal(false)} />
				<RegisterModal stateModal={stateRegisterModal} closeModal={() => setStateRegisterModal(false)} />

				<div className={styles.wrapperNotifications}>
					{notifications.map((n) => (
						<Notification title={n.title} key={n.key} description={n.description} />
					))}
				</div>

				<Up />
			</UserContextProvider>
		</AppContextProvider>
	);
};

export const withLayout = <T extends Record<string, unknown>>(Component: FunctionComponent<T>, header: 'default' | 'admin' = 'default') => {
	return function withLayoutComponent(props: T) {
		return (
			<Layout header={header}>
				<Component {...props} />
			</Layout>
		);
	};
};

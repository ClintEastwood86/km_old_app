import { FunctionComponent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
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
import { isChristmasTime } from '@/helpers/date';
import { ChristmasLights } from '@/components/ChristmasLights/ChristmasLights';
import { BottomNavigation } from './BottomNavigation/BottomNavigation';

const MOBILE_LAYOUT_MEDIA = '(max-width: 770px)';

const ResponsiveLayout = ({ header, children }: { header: 'default' | 'admin'; children: ReactNode }): JSX.Element => {
	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		const mq = window.matchMedia(MOBILE_LAYOUT_MEDIA);
		const sync = () => setIsMobile(mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	}, []);

	return (
		<div className={styles.layout}>
			{isMobile ? <MobileLayout header={header}>{children}</MobileLayout> : <Layout header={header}>{children}</Layout>}
		</div>
	);
};

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
					openRegisterModal={() => setStateRegisterModal(true)}
				/>
				<ForgotPasswordModal stateModal={stateForgotPasswordModal} closeModal={() => setStateForgotPasswordModal(false)} />
				<RegisterModal stateModal={stateRegisterModal} closeModal={() => setStateRegisterModal(false)} />

				<div className={styles.wrapperNotifications}>
					{notifications.map((n) => (
						<Notification title={n.title} key={n.key} description={n.description} />
					))}
				</div>

				<Up />
				{isChristmasTime() && <ChristmasLights />}
			</UserContextProvider>
		</AppContextProvider>
	);
};

export const MobileLayout = ({ children }: LayoutProps): JSX.Element => {
	const router = useRouter();
	const { iHaveCookie } = useCookies();
	const [notifications, setNotifications] = useState<NotificationData[]>([]);
	const [stateLoginModal, setStateLoginModal] = useState<boolean>(false);
	const [stateRegisterModal, setStateRegisterModal] = useState<boolean>(false);
	const [stateForgotPasswordModal, setStateForgotPasswordModal] = useState<boolean>(false);
	const [userData, setUserData] = useState<UserModelShort | null>(null);

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
					<div className={styles.mobileRoot}>
						<div className={styles.mobileContent}>
							<main className={cn(styles.main, styles.container)}>{children}</main>

							<LoginModal
								router={router}
								stateModal={stateLoginModal}
								closeModal={() => setStateLoginModal(false)}
								openForgotPasswordModal={() => setStateForgotPasswordModal(true)}
								openRegisterModal={() => setStateRegisterModal(true)}
							/>
							<ForgotPasswordModal stateModal={stateForgotPasswordModal} closeModal={() => setStateForgotPasswordModal(false)} />
							<RegisterModal stateModal={stateRegisterModal} closeModal={() => setStateRegisterModal(false)} />

							<div className={styles.wrapperNotifications}>
								{notifications.map((n) => (
									<Notification title={n.title} key={n.key} description={n.description} />
								))}
							</div>
						</div>
						<BottomNavigation />
					</div>
				</LayoutContextProvider>
			</UserContextProvider>
		</AppContextProvider>
	);
};

export const withLayout = <T extends Record<string, unknown>>(Component: FunctionComponent<T>, header: 'default' | 'admin' = 'default') => {
	return function withLayoutComponent(props: T) {
		return (
			<ResponsiveLayout header={header}>
				<Component {...props} />
			</ResponsiveLayout>
		);
	};
};

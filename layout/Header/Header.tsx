import { HeaderProps } from './Header.props';
import styles from './Header.module.css';
import cn from 'classnames';
import Link from 'next/link';
import { Navigation } from './Navigation/Navigation';
import { ProfileCard } from './ProfileCard/ProfileCard';
import { Htag, IsTruthy, P } from '@/components';
import { useState, useEffect, useContext, useMemo } from 'react';
import { LayoutContext } from '@/contexts/layout.context';
import { useRanks } from '@/hooks/ranks.hook';
import { UserContext } from '@/contexts/user.context';
import { AdminNavigation } from './Navigation/AdminNavigation';
import BurgerIcon from '@/public/burger.svg';
import SearchIcon from '@/public/search.svg';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import LogoChristmas from '@/public/logo_christmas.svg';
import Logo from '@/public/logo.svg';
import { isChristmasTime } from '@/helpers/date';

export const Header = ({ header, user, containerClassStyle, className, ...props }: HeaderProps): JSX.Element => {
	const [rank, setRank] = useState<string>('Неизвестный');
	const cacheRanks = useRanks();
	const { isAuth } = useContext(UserContext);
	const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState<boolean>(false);

	const context = useContext(LayoutContext);

	const navigation = useMemo(() => {
		switch (header) {
			case 'admin':
				return <AdminNavigation className={styles.nav} />;
			default:
				return <Navigation className={styles.nav} />;
		}
	}, [header]);

	useEffect(() => {
		const findCacheRank = cacheRanks.find((value) => value.id == user?.rankId);
		if (!findCacheRank) return;
		setRank(findCacheRank.name);
	}, [user, cacheRanks]);

	useEffect(() => {
		setTimeout(() => {
			document.body.classList[!isOpenBurgerMenu ? 'remove' : 'add']('block-scroll');
		}, 10);
	}, [isOpenBurgerMenu]);

	useEffect(() => {
		setTimeout(() => {
			document.body.classList[!isOpenBurgerMenu ? 'remove' : 'add']('block-scroll');
		}, 10);
	}, [isOpenBurgerMenu]);

	return (
		<header {...props} className={cn(className)}>
			<div className={cn(containerClassStyle, styles.header)}>
				<Link className={styles.logo} href="/">
					{isChristmasTime() ? <LogoChristmas /> : <Logo />}
				</Link>

				{navigation}
				<IsTruthy condition={isOpenBurgerMenu}>
					<BurgerMenu state={isOpenBurgerMenu} onClose={() => setIsOpenBurgerMenu(false)} />
				</IsTruthy>

				{isAuth && !!user ? (
					<div className={styles.right}>
						<Link href="/search?">
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
								<path
									d="M10.2761 9.05031C11.1234 7.89404 11.503 6.46047 11.3387 5.0364C11.1745 3.61233 10.4786 2.30279 9.3903 1.36976C8.30199 0.43673 6.90153 -0.0509732 5.46908 0.00422151C4.03663 0.0594162 2.67785 0.653438 1.66457 1.66745C0.651285 2.68145 0.0582358 4.04066 0.00406614 5.47315C-0.0501035 6.90563 0.438601 8.30575 1.37241 9.39339C2.30622 10.481 3.61626 11.176 5.04045 11.3392C6.46463 11.5024 7.89793 11.1219 9.05359 10.2737C9.07985 10.3087 9.10697 10.3419 9.13848 10.3743L12.5076 13.7434C12.6717 13.9076 12.8943 13.9999 13.1264 14C13.3585 14.0001 13.5812 13.9079 13.7454 13.7439C13.9096 13.5798 14.0019 13.3572 14.002 13.125C14.0021 12.8929 13.9099 12.6702 13.7458 12.506L10.3767 9.13695C10.3454 9.10528 10.3118 9.0769 10.2761 9.05031ZM10.5019 5.68647C10.5019 6.31852 10.3774 6.94438 10.1355 7.52832C9.89363 8.11226 9.5391 8.64284 9.09218 9.08977C8.64525 9.5367 8.11467 9.89122 7.53073 10.1331C6.94679 10.375 6.32092 10.4995 5.68887 10.4995C5.05682 10.4995 4.43096 10.375 3.84702 10.1331C3.26308 9.89122 2.7325 9.5367 2.28557 9.08977C1.83864 8.64284 1.48412 8.11226 1.24224 7.52832C1.00037 6.94438 0.875876 6.31852 0.875876 5.68647C0.875876 4.40998 1.38296 3.18578 2.28557 2.28316C3.18818 1.38055 4.41239 0.873469 5.68887 0.873469C6.96536 0.873469 8.18956 1.38055 9.09218 2.28316C9.99479 3.18578 10.5019 4.40998 10.5019 5.68647Z"
									fill="#B5B5B5"
								/>
							</svg>
						</Link>
						<ProfileCard
							icon={user.awardSelected ? user.awardSelected.icon : undefined}
							login={user.login}
							avatar={user.avatar}
							rank={header == 'default' ? rank : user.role}
						/>
						<button onClick={() => setIsOpenBurgerMenu(true)} className={styles.burger}>
							<BurgerIcon />
						</button>
					</div>
				) : (
					<div className={styles.right}>
						<Link href="/search">
							<SearchIcon />
						</Link>
						<button onClick={context?.openRegisterModal}>
							<Htag color="secondary" tag="h3">
								Регистрация
							</Htag>
						</button>
						<button onClick={context?.openLoginModal}>
							<P color="white" size="m">
								Вход
							</P>
						</button>
						<button onClick={() => setIsOpenBurgerMenu(true)} className={styles.burger}>
							<BurgerIcon />
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

import Link from 'next/link';
import styles from './BottomNavigation.module.css';
import { navRoutes } from '@/configs/nav.routes.config';
import SearchIcon from '@/public/search.svg';
import ProfileIcon from '@/public/profile.svg';
import CollectionsIcon from '@/public/collections.svg';
import HomeIcon from '@/public/home.svg';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { IsTruthy } from '@/components';
import { useContext } from 'react';
import { UserContext } from '@/contexts/user.context';
import { LayoutContext } from '@/contexts/layout.context';

export const BottomNavigation = () => {
	const router = useRouter();
	const { isAuth } = useContext(UserContext);
	const layoutContext = useContext(LayoutContext);

	return (
		<nav className={styles.navigation}>
			<section className={styles.navSection}>
				<Link className={cn(styles.link, { [styles.active]: router.asPath == navRoutes.main })} href={navRoutes.main}>
					<HomeIcon />
					<p>Главная</p>
				</Link>
				<Link className={cn(styles.link, { [styles.active]: router.asPath == navRoutes.collections })} href={navRoutes.collections}>
					<CollectionsIcon />
					<p>Подборки</p>
				</Link>
				<IsTruthy condition={isAuth}>
					<Link className={cn(styles.link, { [styles.active]: router.asPath == '/profile' })} href="/profile">
						<ProfileIcon />
						<p>Профиль</p>
					</Link>
				</IsTruthy>
				<IsTruthy condition={!isAuth}>
					<button
						className={cn(styles.link, { [styles.active]: router.asPath == '/profile' })}
						onClick={layoutContext?.openLoginModal}>
						<ProfileIcon />
						<p>Профиль</p>
					</button>
				</IsTruthy>
			</section>
			<section className={cn(styles.navSection, styles.searchSection)}>
				<Link className={cn(styles.link, { [styles.active]: router.route == '/search' })} href="/search?">
					<SearchIcon className={styles.searchIcon} />
				</Link>
			</section>
		</nav>
	);
};

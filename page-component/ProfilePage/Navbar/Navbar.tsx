import { Wrapper } from '@/components';
import Link from 'next/link';
import cn from 'classnames';
import styles from './Navbar.module.css';
import { NavbarProps } from './Navbar.props';
import { profileRoutes } from '@/configs/profile.routes.config';
import { useCookies } from '@/hooks/cookies.hook';

export const Navbar = ({ route, className, ...props }: NavbarProps) => {
	const { logout } = useCookies();

	return (
		<Wrapper {...props} className={cn(styles.navbar, className)}>
			<Link
				scroll={false}
				className={cn(styles.button, {
					[styles.active]: !Object.keys(profileRoutes)
						.map((v) => profileRoutes[v as keyof typeof profileRoutes])
						.includes(route)
				})}
				href="/profile">
				Профиль
			</Link>
			<Link scroll={false} className={cn(styles.button, { [styles.active]: route == profileRoutes.stats })} href={profileRoutes.stats}>
				Статистика
			</Link>
			<Link scroll={false} className={cn(styles.button, { [styles.active]: route == profileRoutes.movies })} href={profileRoutes.movies}>
				Мои фильмы
			</Link>
			<button className={styles.button} onClick={() => logout()}>
				Выйти
			</button>
		</Wrapper>
	);
};

import Link from 'next/link';
import styles from './Navigation.module.css';
import { P } from '@/components';
import { navAdminRoutes } from '@/configs/nav.routes.config';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { NavigationProps } from './Navigation.props';

export const AdminNavigation = ({ className, ...props }: NavigationProps) => {
	const router = useRouter();

	return (
		<nav {...props} className={cn(styles.nav, className)}>
			<Link href={navAdminRoutes.users}>
				<P
					size="m"
					color="grayLight"
					className={cn({
						[styles.navActive]: router.asPath == navAdminRoutes.users
					})}>
					Пользователи
				</P>
			</Link>
			<Link href={navAdminRoutes.comments}>
				<P
					size="m"
					color="grayLight"
					className={cn({
						[styles.navActive]: router.asPath == navAdminRoutes.comments
					})}>
					Комментарии
				</P>
			</Link>
			<Link href={navAdminRoutes.ranks}>
				<P
					size="m"
					color="grayLight"
					className={cn({
						[styles.navActive]: router.asPath == navAdminRoutes.ranks
					})}>
					Звания
				</P>
			</Link>
			<Link href={navAdminRoutes.awards}>
				<P
					size="m"
					color="grayLight"
					className={cn({
						[styles.navActive]: router.asPath == navAdminRoutes.awards
					})}>
					Значки
				</P>
			</Link>
		</nav>
	);
};

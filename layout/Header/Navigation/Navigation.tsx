import { NavigationProps } from './Navigation.props';
import styles from './Navigation.module.css';
import Link from 'next/link';
import { P } from '@/components';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { navRoutes } from '@/configs/nav.routes.config';

export const Navigation = ({ className, ...props }: NavigationProps): JSX.Element => {
	const router = useRouter();

	return (
		<nav {...props} className={cn(className, styles.nav)}>
			<Link href={navRoutes.main}>
				<P
					size="m"
					color="grayLight"
					className={cn({
						[styles.navActive]: router.asPath == navRoutes.main
					})}>
					Главная
				</P>
			</Link>
			<Link href={navRoutes.collections}>
				<P
					size="m"
					color="grayLight"
					className={cn({
						[styles.navActive]: router.asPath == navRoutes.collections
					})}>
					Подборки
				</P>
			</Link>
			<P size="m" className={styles.blockedLink}>
				Клипы
			</P>
		</nav>
	);
};

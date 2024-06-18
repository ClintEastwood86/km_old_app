import { ButtonGhost, Htag, IsTruthy, User } from '@/components';
import styles from './BurgerMenu.module.css';
import Cross from '@/public/cross.svg';
import SearchIcon from '@/public/search.svg';
import { BurgerMenuProps } from './BurgerMenu.props';
import cn from 'classnames';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { UserContext } from '@/contexts/user.context';
import { LayoutContext } from '@/contexts/layout.context';
import Link from 'next/link';
import { Navigation } from '../Navigation/Navigation';
import { useCookies } from '@/hooks/cookies.hook';
import { useRouter } from 'next/router';

export const BurgerMenu = ({ onClose, state, className, ...props }: BurgerMenuProps): JSX.Element => {
	const router = useRouter();
	const ref = useRef<HTMLDivElement>(null);
	const user = useContext(UserContext);
	const context = useContext(LayoutContext);
	const { logout } = useCookies();

	const closeMenu = useCallback(() => {
		if (!ref.current) {
			return;
		}
		ref.current.classList.remove(styles.open);
		setTimeout(() => {
			onClose();
		}, 100);
	}, [onClose]);

	useEffect(() => {
		if (!state || !ref.current) {
			return;
		}
		setTimeout(() => {
			ref.current?.classList.add(styles.open);
		}, 50);
	}, [state]);

	useEffect(() => {
		if (!ref.current) {
			return;
		}
		ref.current.querySelectorAll('a').forEach((node) => node.addEventListener('click', closeMenu));
	}, [closeMenu]);

	return (
		<>
			<section ref={ref} {...props} className={cn(styles.navigation, className)}>
				<div className={styles.wrapper}>
					<Htag tag="h2" appearanceTag="h1">
						Меню
					</Htag>
					<button onClick={closeMenu}>
						<Cross />
					</button>
				</div>
				<div className={styles.userWrapper}>
					{user.isAuth && <User href="/profile" user={user} />}
					<IsTruthy condition={!user.isAuth}>
						<ButtonGhost className={styles.authButton} onClick={context?.openLoginModal}>
							Вход
						</ButtonGhost>
						<ButtonGhost className={styles.authButton} onClick={context?.openRegisterModal}>
							Регистрация
						</ButtonGhost>
					</IsTruthy>
					<Link className={styles.search} href="/search?">
						<SearchIcon />
					</Link>
				</div>
				<div className={styles.navWrapper}>
					<IsTruthy condition={user.isAuth}>
						<ButtonGhost href="/profile" className={cn(styles.button, { [styles.activeButton]: router.asPath == '/profile' })}>
							Профиль
						</ButtonGhost>
					</IsTruthy>
					<Navigation className={styles.nav} />
					<IsTruthy condition={user.isAuth}>
						<ButtonGhost onClick={() => logout()} className={styles.button} appearance="red">
							Выйти
						</ButtonGhost>
					</IsTruthy>
				</div>
			</section>
			<div onClick={closeMenu} className={styles.overlay}></div>
		</>
	);
};

import { FooterProps } from './Footer.props';
import styles from './Footer.module.css';
import cn from 'classnames';
import { P } from '@/components';
import { UserContext } from '@/contexts/user.context';
import { useContext } from 'react';
import { useCookies } from '@/hooks/cookies.hook';
import TelegramIcon from './telegram.svg';
import Logo from './logo.svg';
import EmailIcon from './email.svg';

export const Footer = ({ className, ...props }: FooterProps): JSX.Element => {
	const { logout } = useCookies();
	const { isAuth } = useContext(UserContext);

	return (
		<footer {...props} className={cn(className, styles.footer)}>
			<div className={styles.wrapper}>
				<div className={styles.left}>
					<Logo />

					<div>
						<P className={styles.seoText} size="s">
							Добро пожаловать на наш бесплатный кино сайт, где вы можете бесплатно смотреть фильмы онлайн в хорошем качестве и HD
							разрешении. Здесь представлен огромный выбор фильмов, которые доступны для просмотра без каких-либо ограничений.
						</P>
						<P className={styles.seoText} size="s">
							Здесь вы сможете насладиться просмотром фильмов абсолютно бесплатно и без необходимости регистрации. Все фильмы вы
							получаете совершенно бесплатно, без дополнительных расходов.
						</P>
						<P className={styles.seoText} size="s">
							Забудьте о неудобствах и ограничениях других платных платформ. У нас вы найдете самые интересные фильмы, доступные
							для просмотра в высоком качестве и в русском дубляже.
						</P>
					</div>

					<div className={styles.links}>
						<a target="_blank" href="https://t.me/siparat" className={styles.link}>
							<TelegramIcon />
						</a>
						<a
							target="_blank"
							style={{ stroke: 'var(--gray-text-color)' }}
							href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_SUPPORT}`}
							className={styles.link}>
							<EmailIcon />
						</a>
					</div>
				</div>

				<div className={styles.right}>
					<div className={styles.column}>
						<h5 className={styles.columntTitle}>Жанры:</h5>
						<div className={styles.columnLinks}>
							<a href="/search" className={styles.columnLink}>
								<P size="s" color="grayDark">
									Премьеры
								</P>
							</a>
							<a href="/search?genre=3" className={styles.columnLink}>
								<P size="s" color="grayDark">
									Боевики
								</P>
							</a>
							<a href="/search?genre=6" className={styles.columnLink}>
								<P size="s" color="grayDark">
									Комедии
								</P>
							</a>
							<a href="/search?genre=15" className={styles.columnLink}>
								<P size="s" color="grayDark">
									Ужасы
								</P>
							</a>
							<a href="/search?genre=20" className={styles.columnLink}>
								<P size="s" color="grayDark">
									Фантастика
								</P>
							</a>
							<a href="/search?genre=1" className={styles.columnLink}>
								<P size="s" color="grayDark">
									Триллеры
								</P>
							</a>
							<a href="/search?genre=7" className={styles.columnLink}>
								<P size="s" color="grayDark">
									Драмы
								</P>
							</a>
						</div>
					</div>
					{isAuth && (
						<div className={styles.column}>
							<h5 className={styles.columntTitle}>Аккаунт:</h5>
							<div className={styles.columnLinks}>
								<a href="/profile" className={styles.columnLink}>
									<P size="s" color="grayDark">
										Профиль
									</P>
								</a>
								<a href="/profile?tab=stats" className={styles.columnLink}>
									<P size="s" color="grayDark">
										Статистика
									</P>
								</a>
								<button className={styles.columnLink} onClick={() => logout()}>
									Выйти
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			<P className={styles.copyrights} size="s">
				© {new Date().getFullYear()} «{process.env.NEXT_PUBLIC_DOMAIN}»
			</P>
		</footer>
	);
};

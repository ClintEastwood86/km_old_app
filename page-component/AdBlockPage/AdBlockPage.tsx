import { createTitle } from '@/helpers/title';
import Head from 'next/head';
import errorStyles from '../../components/ErrorBlock/ErrorBlock.module.css';
import styles from './AdBlock.module.css';
import { Htag, P } from '@/components';
import AdBlockIcon from './adblock.svg';

export const AdBlockPage = (): JSX.Element => {
	return (
		<>
			<Head>
				<title>{createTitle('Установите AdBlock')}</title>
			</Head>
			<section className={errorStyles.error}>
				<AdBlockIcon />
				<Htag tag="h1">Вам необходим AdBlock</Htag>
				<P className={errorStyles.description} style={{ textAlign: 'start' }} size="l">
					К сожалению, Роскомнадзор блокирует наш сайт из-за посторонней рекламы в плеерах.
				</P>
				<P className={errorStyles.description} style={{ textAlign: 'start' }} size="l">
					Мы не получаем с неё ни копейки и не хотим, чтобы она вам мешала. Поэтому, чтобы продолжить просмотр, вам{' '}
					<a target="_blank" href="https://adblockplus.org/">
						нужно установить AdBlock
					</a>
					. Без него мы не сможем допустить вас к просмотру.
				</P>
				<P className={errorStyles.description} style={{ textAlign: 'start' }} size="l">
					Для тех, кто зашел с мобильного устройства, у нас есть отличное решение. Скачайте наше мобильное приложение, где никакая
					реклама вас не потревожит!
				</P>
				<div className={styles.apps}>
					<a className={styles.app} target="_blank" href="https://www.rustore.ru/catalog/app/ru.kingmovies.km">
						<img src="/rustore.png" alt="rustore" />
						<Htag tag="h2" color="white">
							Android
						</Htag>
					</a>
					<div className={styles.app}>
						<img src="/apple.png" alt="apple" />
						<Htag tag="h2" color="gray">
							В разработке
						</Htag>
					</div>
				</div>
			</section>
		</>
	);
};

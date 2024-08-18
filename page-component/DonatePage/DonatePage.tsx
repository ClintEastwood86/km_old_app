import { Htag, P } from '@/components';
import styles from './DonatePage.module.css';
import { DonateButton } from './DonateButton/DonateButton';

export const DonatePage = (): JSX.Element => {
	return (
		<>
			<Htag className={styles.title} tag="h1">
				Поддержите наш сайт
			</Htag>
			<div>
				<div className={styles.info}>
					<P size="m">
						Мы сделали всё возможное, чтобы избавить вас от назойливой рекламы и предоставить доступ к фильмам абсолютно бесплатно.
						Но для того, чтобы наш сайт оставался таким же удобным, быстрым и постоянно улучшался, нам нужна ваша поддержка.
					</P>
					<P size="m">
						Каждое ваше пожертвование помогает нам оплачивать серверы, улучшать функционал и добавлять новые возможности для вашего
						удобства. Вместе мы можем сделать этот сайт ещё лучше!
					</P>
					<div className={styles.buttons}>
						<DonateButton sum={50} billNumber="14MAM739PLR.240817" />
						<DonateButton sum={100} billNumber="14MNUI76AVI.240818" />
						<DonateButton sum={250} billNumber="14MAMDJ9D0G.240817" />
						<DonateButton sum={500} billNumber="14MAMHPSQOS.240817" />
						<DonateButton sum={1000} billNumber="14MO5756FTO.240818" />
					</div>
					<P size="m">Спасибо за вашу поддержку!</P>
				</div>
			</div>
		</>
	);
};

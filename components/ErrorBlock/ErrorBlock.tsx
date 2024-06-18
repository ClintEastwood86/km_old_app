import { ErrorBlockProps } from './ErrorBlock.props';
import styles from './ErrorBlock.module.css';
import { Htag, IsTruthy, P } from '..';
import Head from 'next/head';
import { createTitle } from '@/helpers/title';

export const ErrorBlock = ({ response, setTitle = false }: ErrorBlockProps): JSX.Element => {
	return (
		<>
			<IsTruthy condition={setTitle}>
				<Head>
					<title>{createTitle(response.message)}</title>
				</Head>
			</IsTruthy>
			<section className={styles.error}>
				<div className={styles.crown}>{response.code}</div>
				<Htag tag="h1">{response.message}</Htag>
				<P className={styles.description} size="l">
					{response.data.error}
				</P>
			</section>
		</>
	);
};

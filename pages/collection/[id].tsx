import { API } from '@/helpers/api';
import { createTitle } from '@/helpers/title';
import { Collection } from '@/interfaces/collection.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { withLayout } from '@/layout/Layout';
import { CollectionMoviesPage } from '@/page-component/CollectionMoviesPage/CollectionMovies';
import { isHttpError } from '@/typeguards/error.typeguard';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

const CollecionPageWithMovies = ({ collection, id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const title = createTitle(isHttpError(collection) ? `Пользовательская подборка с id ${id}` : `Подборка ${collection.name}`);
	const description = isHttpError(collection)
		? collection.code == 403
			? 'Владелец подборки решил ограничить доступ к своей подборке, и скрыл её для других глаз'
			: collection.data.error
		: `Смотреть подборку "${collection.name}" бесплатно. ${collection.description} Наши пользовательские подборки фильмов - ваш путеводитель в мире кино! Здесь вы найдете разнообразные коллекции фильмов, созданные нашими страстными киноманами. Заходите, создавайте свои собственные подборки и делитесь ими с друзьями!`;

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta property="og:title" content={title} />
				<meta name="description" content={description} />
				<meta property="og:description" content={description} />
				<meta property="og:type" content="article" />
			</Head>
			<CollectionMoviesPage />
		</>
	);
};

export default withLayout(CollecionPageWithMovies);

export const getServerSideProps: GetServerSideProps<ReturnTypeGetServerSideProps> = async ({ params }) => {
	if (!params) {
		return { notFound: true };
	}

	const response = await fetch(API.collections.get + params.id, { credentials: 'include' });
	const collection: Collection | IErrorResponse = await response.json();
	if (!isHttpError(collection) && !response.ok) {
		return {
			notFound: true
		};
	}
	return {
		props: {
			collection,
			id: Number(params.id)
		}
	};
};

interface ReturnTypeGetServerSideProps extends Record<string, unknown> {
	collection: Collection | IErrorResponse;
	id: number;
}

/* eslint-disable prettier/prettier */
import { MoviePageContextProvider } from '@/contexts/moviePage.context';
import { Country, Genre, Movie } from '@/interfaces/movie.interface';
import { MoviePage } from '@/page-component/MoviePage/MoviePage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { withLayout } from '../../layout/Layout';
import { API } from '@/helpers/api';
import { CollectionShort } from '@/interfaces/collection.interface';
import Head from 'next/head';
import { MovieType } from '@/interfaces/movie.interface';
import { createTitle } from '@/helpers/title';
import dayjs from 'dayjs';
import { NotFoundPage } from '../404';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';

const movieTypes: Record<(typeof MovieType)[keyof typeof MovieType], string> = {
	Film: 'Фильм',
	Serial: 'Сериал'
};

const MovieAliasPage = ({ movie, collections, genres, countries }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	if (!movie) {
		return <NotFoundPage />;
	}
	const title = createTitle(
		`${movieTypes[movie.type]} ${movie.nameRussian || movie.nameOriginal} ${
			movie.premiere ? `(${new Date(movie.premiere).getFullYear()})` : ''
		} смотреть бесплатно онлайн`
	);
	const description = `Смотреть бесплатно ${movieTypes[movie.type] && movieTypes[movie.type].toLowerCase()} ${
		movie.nameRussian || movie.nameOriginal
	} ${movie.premiere ? `${new Date(movie.premiere).getFullYear()} года` : ''} онлайн, в хорошем HD 720-1080 качестве. ${movie.description.slice(
		0,
		movie.description.length < 200 ? movie.description.length : 200
	)} Смотреть ${movie.nameRussian || movie.nameOriginal} бесплатно онлайн`;

	const genresList = movie.genres.map((gId) => genres.find((g) => g.id == gId)?.name) as string[];
	const countriesList = movie.countries.map((cId) => countries.find((c) => c.id == cId)?.name) as string[];

	return (
		<>
			<Head>
				<meta property="og:type" content="video.movie" />
				<meta property="og:image" content={movie.poster ?? '/og_preview.png'} />
				<meta property="og:title" content={title} />
				{movie.actors.map((a) => (
					<meta key={a.kinopoiskId} property="video:actor" content={a.name} />
				))}
				<meta property="video:release_date" content={dayjs(movie.premiere).format('YYYY-MM-DD')} />
				<meta property="og:description" content={description.replaceAll('\r','')} />
				<meta name="description" content={description.replaceAll('\r','')} />
				<link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/movie/${movie.alias}`} />
				<meta name="keywords" content={[...genresList, ...countriesList, movieTypes[movie.type]].join(' ')} />
				<title>{title}</title>
			</Head>
			<MoviePageContextProvider countriesList={countries} genresList={genres} collections={collections} movie={movie}>
				<MoviePage />
			</MoviePageContextProvider>
		</>
	);
};

export default withLayout(MovieAliasPage);

export const getServerSideProps: GetServerSideProps<ReturnPropsType> = async ({ params, res }) => {
	if (!params) {
		return { notFound: true };
	}
	const responseMovie = await fetch(API.movies.get + params.alias);
	const movie: Movie | IErrorResponse = await responseMovie.json();
	if (isHttpError(movie)) {
		return { notFound: true };
	}

	const responseCollections = await fetch(API.collections.getBestByMovie + movie.id);
	const collections: CollectionShort[] = await responseCollections.json();

	const responseGenres = await fetch(API.movies.getGenres);
	const genres: Genre[] = await responseGenres.json();

	const responseCountries = await fetch(API.movies.getCountries);
	const countries: Country[] = await responseCountries.json();

	res.setHeader('Cache-Control', 'public, max-age=604800');

	return {
		props: {
			movie,
			collections,
			genres,
			countries
		}
	};
};

interface ReturnPropsType extends Record<string, unknown> {
	movie: Movie;
	collections: CollectionShort[];
	genres: Genre[];
	countries: Country[];
}

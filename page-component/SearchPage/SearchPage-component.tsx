/* eslint-disable prettier/prettier */
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { SearchInput } from './SearchInput/SearchInput';
import { ISearchParams, isSeachParameterKey } from '@/interfaces/search.interface';
import { Filters } from './Filters/Filters';
import styles from './SarchPage-component.module.css';
import { useRouter } from 'next/router';
import { useDebounce } from '@/hooks/debounde.hook';
import { MovieShort } from '@/interfaces/movie.interface';
import { API } from '@/helpers/api';
import { ISearchDto } from '@/interfaces/search.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { Htag, Loader, MovieBlock, P } from '@/components';
import { useGenres } from '@/hooks/genres.hook';
import { YEAR_PRODUCTION_END, YEAR_PRODUCTION_START } from '@/constants/filters.constants';
import { Sort } from '@/components';
import Clear from './Clear.svg';
import { SearchPageContextProvider } from '@/contexts/searchPage.context';
import { displayedMoviesConfig } from '@/configs/row.config';
import { useViewportElements } from '@/hooks/viewportElements.hook';

export const Search = () => {
	const router = useRouter();
	const genres = useGenres();
	const [queries, setQueries] = useState<ISearchParams>({});
	const [firstRender, setFirstRender] = useState<boolean>(true);
	const [isSendRequest, setIsSendRequest] = useState<boolean>(true);
	const [page, setPage] = useState<{ count: number }>({ count: 0 });
	const [data, setData] = useState<MovieShort[]>([]);
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	const clearButton = useRef<HTMLButtonElement>(null);
	const { elements: moviesPerPage } = useViewportElements(displayedMoviesConfig, 5);

	useEffect(() => {
		if (firstRender) {
			setQueriesFromUrl(router.asPath);
			setFirstRender(false);
			return;
		}
		pushToLink();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstRender, queries, router.asPath]);

	const transformQueryToUrlValue = ([key, value]: [string, string | number | (number | string)[]]) => {
		value = (() => {
			if (Array.isArray(value)) {
				return value.join('+');
			}
			if (typeof value == 'string') {
				return value.replaceAll(' ', '+');
			}
			return value.toString();
		})();
		return `${key}=${value}`;
	};

	const pushToLink = useDebounce(() => {
		const params = Object.entries(queries)
			.filter(([, value]) => (Array.isArray(value) ? value.length : value !== undefined))
			.map(transformQueryToUrlValue)
			.join('&');
		router.push('?' + params, undefined, { scroll: false });
	}, 1500);

	const setQueriesFromUrl = (path: string) => {
		const params = getTupleParams(path)?.reduce((obj: ISearchParams, [key, value]) => {
			if (!isSeachParameterKey(key)) {
				return obj;
			}
			if (key == 'genre' || key == 'country') {
				obj[key] = value
					.split('+')
					.map((id) => Number(id))
					.filter((id) => (Number.isNaN(id) ? false : true));
			}
			if (key == 'date_end' || key == 'date_start') {
				const year = Number(value);
				obj[key] = Number.isNaN(year) ? undefined : year;
			}
			switch (key) {
				case 'sort': {
					const sortId = Number(value);
					obj[key] = Number.isNaN(sortId) ? 1 : sortId;
					break;
				}
				case 'type': {
					if (value == 'Serial' || value == 'Film') {
						obj[key] = value;
					} else {
						obj[key] = undefined;
					}
					break;
				}
				case 'q': {
					obj[key] = value.split('+').join(' ');
					break;
				}
			}
			return obj;
		}, {});
		setQueries(params || {});
	};

	const getTupleParams = useCallback(
		(asPath: string) => {
			return decodeURI(asPath)
				.split(router.route + '?')[1]
				?.split('&')
				.map((p) => p.split('='));
		},
		[router.route]
	);

	const deleteEmptyPropsInObject = (obj: Record<string, unknown>) => {
		const a = Object.keys(obj).reduce((result: ISearchDto, key) => {
			if (Array.isArray(obj[key]) && (obj[key] as unknown[]).length) {
				result[key as keyof ISearchDto] = obj[key] as any;
			}
			if (!Array.isArray(obj[key]) && obj[key] !== undefined) {
				result[key as keyof ISearchDto] = obj[key] as any;
			}
			return result;
		}, {});
		return a;
	};

	const setMovies = async (body: ISearchDto, take: number, skip: number) => {
		setIsSendRequest(true);
		const params = new URLSearchParams({ take: take.toString(), skip: skip.toString() }).toString();
		const response = await fetch(API.movies.getByQueries + `?${params}`, {
			credentials: 'include',
			method: 'post',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const movies: MovieShort[] | IErrorResponse = await response.json();
		if (isHttpError(movies)) {
			console.error(movies.data.error);
			return setIsLastPage(true);
		}
		if ((movies.length % moviesPerPage) * 3 !== 0 || !movies.length) {
			setIsLastPage(true);
		}
		setData((oldMovies) => oldMovies.concat(movies));
		setIsSendRequest(false);
	};

	const formatToDto = (queries: ISearchParams) => {
		const changedQueries = queries
			? {
					q:
						queries.q &&
						queries.q
							.split(' ')
							.filter((word) => word !== '')
							.join(' '),
					date_end:
						queries.date_end && queries.date_end !== YEAR_PRODUCTION_END ? new Date(queries.date_end + 1, 0, 0).toJSON() : undefined,
					date_start:
						queries.date_start && queries.date_start !== YEAR_PRODUCTION_START
							? new Date(queries.date_start, 0, 0).toJSON()
							: undefined
			}
			: {};
		return {
			...queries,
			...changedQueries,
			skipAdultContent: !queries.genre?.includes(29)
		};
	};

	const clearQueries = () => {
		setQueries({});
	};

	const handleScroll = useCallback(() => {
		if (!ref.current || isLastPage || isSendRequest) return;
		if (ref.current.getBoundingClientRect().bottom - window.innerHeight - 150 < 0) {
			setPage((p) => ({ count: p.count + 1 }));
		}
	}, [isLastPage, isSendRequest]);

	const setSort = (value: number) => {
		setQueries((q) => ({
			...q,
			sort: value
		}));
	};

	useEffect(() => {
		if ((router.asPath.split('?')[1] && !Object.keys(queries).length) || firstRender) {
			return;
		}
		setMovies(deleteEmptyPropsInObject(formatToDto(queries)), moviesPerPage * 3, moviesPerPage * 3 * page.count);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	useEffect(() => {
		setData([]);
		setPage({ count: 0 });
		setIsLastPage(false);
	}, [router.asPath]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	return (
		<SearchPageContextProvider clearButton={clearButton.current}>
			<SearchInput value={queries.q} setQueries={setQueries} />
			<Filters queries={queries} setQueries={setQueries} className={styles.filters} />
			<section className={styles.wrapper}>
				<div className={styles.wrapperHeader}>
					<div className={styles.titleWrapper}>
						<Htag tag="h1">Поиск</Htag>
						<button title="Очистить фильтры" ref={clearButton} onClick={clearQueries} className={styles.clearButton}>
							<Clear />
						</button>
					</div>
					<Sort setSort={setSort} sortId={queries.sort == undefined ? 1 : queries.sort} />
				</div>
				<div ref={ref} className={styles.movies}>
					{useMemo(() => {
						return data.map((movie) => (
							<MovieBlock key={movie.alias + Math.random() * Math.random()} info={movie} genres={genres} />
						));
					}, [data, genres])}
				</div>
				{isLastPage ? (
					<P className={styles.emptyPhrase} color="grayLight" size="s">
						Больше не найдено
					</P>
				) : (
					<div className={styles.loaderWrapper}>
						<Loader />
					</div>
				)}
			</section>
		</SearchPageContextProvider>
	);
};

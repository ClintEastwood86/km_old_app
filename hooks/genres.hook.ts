import { API } from '@/helpers/api';
import { Genre } from '@/interfaces/movie.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useCallback, useEffect, useState } from 'react';

export const useGenres = (): Genre[] => {
	const [genres, setGenres] = useState<Genre[]>([]);

	const setGenresInLocalStorage = async () => {
		const response = await fetch(API.movies.getGenres, { credentials: 'include', method: 'get' });
		const dataOrError = await response.json();
		if (isHttpError(dataOrError)) {
			return console.error(dataOrError.data.error);
		}
		localStorage.setItem('genres', JSON.stringify(dataOrError));
	};

	const getGenresInLocalStorage = useCallback(async (): Promise<Genre[]> => {
		const genres = localStorage.getItem('genres');
		if (!genres || genres == '[]') {
			await setGenresInLocalStorage();
			return await getGenresInLocalStorage();
		}
		return JSON.parse(genres);
	}, []);

	useEffect(() => {
		getGenresInLocalStorage().then((genres) => setGenres(genres));
	}, [getGenresInLocalStorage]);
	return genres;
};

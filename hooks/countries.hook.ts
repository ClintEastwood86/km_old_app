import { API } from '@/helpers/api';
import { Country } from '@/interfaces/movie.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useCallback, useEffect, useState } from 'react';

export const useCountries = (): Country[] => {
	const [countries, setCountries] = useState<Country[]>([]);

	const setCountriesInLocalStorage = async () => {
		const response = await fetch(API.movies.getCountries, { credentials: 'include', method: 'get' });
		const dataOrError = await response.json();
		if (isHttpError(dataOrError)) {
			return console.error(dataOrError.data.error);
		}
		localStorage.setItem('countries', JSON.stringify(dataOrError));
	};

	const getCountriesInLocalStorage = useCallback(async (): Promise<Country[]> => {
		const countries = localStorage.getItem('countries');
		if (!countries || countries == '[]') {
			await setCountriesInLocalStorage();
			return await getCountriesInLocalStorage();
		}
		return JSON.parse(countries);
	}, []);

	useEffect(() => {
		getCountriesInLocalStorage().then((countries) => setCountries(countries));
	}, [getCountriesInLocalStorage]);
	return countries;
};

import { API } from '@/helpers/api';
import { IAward } from '@/interfaces/awards.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useCallback, useEffect, useState } from 'react';

export const useAwards = (reload = false) => {
	const [awards, setAwards] = useState<IAward[]>([]);

	const setAwardsInLocalStorage = async () => {
		const awardsOrError: IErrorResponse | IAward[] = await (await fetch(API.awards.get, { credentials: 'include', method: 'get' })).json();
		if (isHttpError(awardsOrError)) {
			localStorage.setItem('awards', '[]');
			return console.error(awardsOrError.data.error);
		}
		let idOpenAwards: number[] | IErrorResponse = await (
			await fetch(API.users.getIdOpenAwards, { credentials: 'include', method: 'get' })
		).json();
		if (isHttpError(idOpenAwards)) {
			idOpenAwards = [];
		}
		awardsOrError.map((award) => {
			award.isOpen = (idOpenAwards as number[]).includes(award.id) ? true : false;
			return award;
		});
		localStorage.setItem('awardsUpdatedAt', new Date().getTime().toString());
		localStorage.setItem('awards', JSON.stringify(awardsOrError));
	};

	const getAwardsFromLocalStorage = useCallback(async () => {
		let awards = localStorage.getItem('awards') as string;
		const awardsUpdatedAt = localStorage.getItem('awardsUpdatedAt');
		if (
			reload ||
			!awards ||
			(awardsUpdatedAt &&
				Date.now() - Number(awardsUpdatedAt) > 1000 * 60 * 60 * Number(process.env.NEXT_PUBLIC_INTERVAL_UPDATE_AWARDS_IN_HOURS))
		) {
			await setAwardsInLocalStorage();
			awards = localStorage.getItem('awards') as string;
		}
		return JSON.parse(awards) as IAward[];
	}, [reload]);

	useEffect(() => {
		getAwardsFromLocalStorage().then((data) => setAwards(data));
	}, [getAwardsFromLocalStorage]);
	return awards;
};

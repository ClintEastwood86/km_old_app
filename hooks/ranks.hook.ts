import { API } from '@/helpers/api';
import { IRank } from '@/interfaces/rank.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useCallback, useEffect, useState } from 'react';

export const useRanks = (reload = false) => {
	const [ranks, setRanks] = useState<IRank[]>([]);

	const setRanksInLocalStorage = async (): Promise<void> => {
		const ranksOrError = await (await fetch(API.ranks.get, { credentials: 'include' })).json();
		if (isHttpError(ranksOrError)) {
			localStorage.setItem('pointsItems', '[]');
			return console.error(ranksOrError);
		}
		localStorage.setItem('ranks', JSON.stringify(ranksOrError as IRank[]));
		localStorage.setItem('ranksUpdatedAt', new Date().getTime().toString());
	};

	const getRanksFromLocalStorage = useCallback(async () => {
		let ranks = localStorage.getItem('ranks') as string;
		const ranksUpdatedAt = localStorage.getItem('ranksUpdatedAt');
		if (
			reload ||
			!ranks ||
			(ranksUpdatedAt &&
				Date.now() - Number(ranksUpdatedAt) > 1000 * 60 * 60 * Number(process.env.NEXT_PUBLIC_INTERVAL_UPDATE_RANKS_IN_HOURS))
		) {
			await setRanksInLocalStorage();
			ranks = localStorage.getItem('ranks') as string;
		}
		return JSON.parse(ranks) as IRank[];
	}, [reload]);

	useEffect(() => {
		getRanksFromLocalStorage().then((data: IRank[]) => setRanks(data));
	}, [getRanksFromLocalStorage]);

	return ranks;
};

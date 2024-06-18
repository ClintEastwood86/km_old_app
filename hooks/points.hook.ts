import { API } from '@/helpers/api';
import { IPointsItem } from '@/interfaces/points.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useCallback, useEffect, useState } from 'react';

export const usePoints = (reload = false) => {
	const [points, setPoints] = useState<IPointsItem[]>([]);

	const setPointsInLocalStorage = async () => {
		const pointsOrError = await (await fetch(API.points.get, { credentials: 'include', method: 'get' })).json();
		if (isHttpError(pointsOrError)) {
			localStorage.setItem('pointsItems', '[]');
			return console.error(pointsOrError.data.error);
		}
		localStorage.setItem('pointsItemsUpdatedAt', new Date().getTime().toString());
		localStorage.setItem('pointsItems', JSON.stringify(pointsOrError));
	};

	const getPointsFromLocalStorage = useCallback(async () => {
		let points = localStorage.getItem('pointsItems') as string;
		const pointsUpdatedAt = localStorage.getItem('pointsItemsUpdatedAt');
		if (
			reload ||
			!points ||
			(pointsUpdatedAt &&
				Date.now() - Number(pointsUpdatedAt) > 1000 * 60 * 60 * Number(process.env.NEXT_PUBLIC_INTERVAL_UPDATE_POINTS_IN_HOURS))
		) {
			await setPointsInLocalStorage();
			points = localStorage.getItem('pointsItems') as string;
		}
		return JSON.parse(points) as IPointsItem[];
	}, [reload]);

	useEffect(() => {
		getPointsFromLocalStorage().then((data) => setPoints(data));
	}, [getPointsFromLocalStorage]);
	return points;
};

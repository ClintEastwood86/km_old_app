import { API } from '@/helpers/api';
import { CollapsFailedResponse, CollapsMovie, CollapsSuccessResponse } from '@/interfaces/collaps.interface';
import { IPlayer } from '@/interfaces/player.interface';
import { VibixFailedResponse, VibixSuccessResponse } from '@/interfaces/vibix.interface';

export const getVibixPlayer = async (kpId: number): Promise<IPlayer | null> => {
	try {
		const response = await fetch(API.partners.vibix.getMovie + kpId, {
			headers: { Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_VIBIX_TOKEN },
			signal: AbortSignal.timeout(5000)
		});
		const json: VibixFailedResponse | VibixSuccessResponse = await response.json();
		if ('iframe_url' in json) {
			return { name: 'VIBIX', src: json.iframe_url + '?domain=' + process.env.NEXT_PUBLIC_DOMAIN?.split('//')[1] };
		}
		return null;
	} catch (error) {
		return null;
	}
};

export const getCollapsMovie = async (kpId: number): Promise<CollapsMovie | null> => {
	const token = process.env.NEXT_PUBLIC_COLLAPS_TOKEN || '';
	const params = new URLSearchParams({ kinopoisk_id: kpId.toString(), token });
	const response = await fetch(API.partners.collaps.find + '?' + params.toString());
	const json: CollapsFailedResponse | CollapsSuccessResponse = await response.json();
	if ('total' in json && json.total > 0) {
		return json.results[0];
	}
	return null;
};

export const getCollapsPlayer = async (kpId: number): Promise<IPlayer | null> => {
	try {
		const movie = await getCollapsMovie(kpId);
		return movie ? { name: 'COLLAPS', src: movie.iframe_url } : null;
	} catch (error) {
		return null;
	}
};

export const getPlayersConfigs = async (kpId: number): Promise<IPlayer[]> => {
	const players: IPlayer[] = [];

	const collaps = await getCollapsPlayer(kpId);
	collaps && players.push(collaps);

	players.push({ name: 'TURBO', src: `https://b2761015.obrut.show/embed/UjN/kinopoisk/${kpId}` });

	const vibix = await getVibixPlayer(kpId);
	vibix && players.push(vibix);

	return players;
};

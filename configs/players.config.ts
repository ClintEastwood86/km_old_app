import { API } from '@/helpers/api';
import { AllohaFailedResponse, AllohaSuccessResponse } from '@/interfaces/alloha.interface';
import { CollapsFailedResponse, CollapsMovie, CollapsSuccessResponse } from '@/interfaces/collaps.interface';
import { IPlayer } from '@/interfaces/player.interface';
import { VeoFailedResponse, VeoMovie, VeoSearchSuccessResponse } from '@/interfaces/veo.interface';
import { VibixFailedResponse, VibixSuccessResponse } from '@/interfaces/vibix.interface';

export const getVibixPlayer = async (kpId: number): Promise<IPlayer | null> => {
	try {
		const response = await fetch(API.partners.vibix.getMovie + kpId, {
			headers: { Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_VIBIX_TOKEN },
			signal: AbortSignal.timeout(1000)
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
	const response = await fetch(API.partners.collaps.find + '?' + params.toString(), {
		signal: AbortSignal.timeout(3000)
	});
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

export const getAllohaPlayer = async (kpId: number): Promise<IPlayer | null> => {
	try {
		const token = process.env.NEXT_PUBLIC_ALLOHA_TOKEN || '';
		const params = new URLSearchParams({ kp: kpId.toString(), token });
		const response = await fetch(API.partners.alloha.find + '?' + params.toString(), {
			signal: AbortSignal.timeout(5000)
		});
		const json: AllohaFailedResponse | AllohaSuccessResponse = await response.json();
		if (json.status == 'success') {
			return { name: 'ALLOHA', src: json.data.iframe };
		}
		return null;
	} catch (error) {
		return null;
	}
};

export const getVeoPlayer = async (kpId: number): Promise<IPlayer | null> => {
	try {
		const token = process.env.NEXT_PUBLIC_VEO_TOKEN || '';
		if (!token) {
			return null;
		}
		const body = {
			kinopoiskId: [kpId],
			pagination: {
				page: 1,
				pageSize: 1,
				type: 'page',
				order: 'DESC',
				sortBy: 'year'
			}
		};
		const response = await fetch(API.partners.veo.search, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(10000)
		});
		const searchJson: VeoFailedResponse | VeoSearchSuccessResponse = await response.json();
		if ('error' in searchJson || searchJson.data.length == 0) {
			return null;
		}

		const movieResponse = await fetch(API.partners.veo.getMovie + searchJson.data[0].id, { headers: { Authorization: 'Bearer ' + token } });
		const movie: VeoFailedResponse | VeoMovie = await movieResponse.json();
		if ('error' in movie) {
			return null;
		}
		return { name: 'VEOVEO', src: movie.playerUrl };
	} catch (error) {
		return null;
	}
};

export const getPlayersConfigs = async (kpId: number): Promise<IPlayer[]> => {
	const timestamp = Date.now();
	const players: IPlayer[] = [];

	const veoPromise = getVeoPlayer(kpId);
	const turboPromise = Promise.resolve({ name: 'TURBO', src: `https://b2761015.obrut.show/embed/UjN/kinopoisk/${kpId}` });
	const collapsPromise = getCollapsPlayer(kpId);
	const allohaPromise = getAllohaPlayer(kpId);

	const [veo, turbo, collaps, alloha] = await Promise.allSettled([veoPromise, turboPromise, collapsPromise, allohaPromise]);

	veo.status == 'fulfilled' && veo.value && players.push(veo.value);
	turbo.status == 'fulfilled' && turbo.value && players.push(turbo.value);
	collaps.status == 'fulfilled' && collaps.value && players.push(collaps.value);
	alloha.status == 'fulfilled' && alloha.value && players.push(alloha.value);

	console.log(Date.now() - timestamp);

	return players;
};

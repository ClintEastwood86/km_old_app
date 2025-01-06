import { API } from '@/helpers/api';
import { IPlayer } from '@/interfaces/player.interface';
import { VibixFailedResponse, VibixSuccessResponse } from '@/interfaces/vibix.interface';

const getVibixPlayer = async (kpId: number): Promise<IPlayer | null> => {
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

export const getPlayersConfigs = async (kpId: number): Promise<IPlayer[]> => {
	const players: IPlayer[] = [{ name: 'TURBO', src: `https://b2761015.obrut.show/embed/UjN/kinopoisk/${kpId}` }];

	const vibix = await getVibixPlayer(kpId);
	vibix && players.push(vibix);

	return players;
};

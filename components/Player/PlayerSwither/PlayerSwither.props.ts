import { IPlayer } from '@/interfaces/player.interface';

export interface PlayerSwitherProps {
	selectedPlayer?: IPlayer | null;
	players: IPlayer[];
	setPlayer: (player: IPlayer) => unknown;
}

export interface IActorShort {
	kinopoiskId: number;
	profession: Professions;
	name: string;
}

export interface IActor extends IActorShort {
	id: number;
	birthday?: string;
	sex?: (typeof Sexs)[keyof typeof Sexs];
}

export const Sexs = {
	male: 'Мужчина',
	female: 'Женщина'
} as const;

export enum Professions {
	Producer,
	Actor,
	Director
}

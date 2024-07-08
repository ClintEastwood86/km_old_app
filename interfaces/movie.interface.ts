import { IActorShort } from './actor.interface';

export interface MovieShort {
	id: number;
	poster?: string;
	secondPoster?: string;
	genres: number[];
	timeMinutes?: number;
	premiere?: Date;
	alias: string;
	nameOriginal?: string;
	nameRussian?: string;
}

export interface Movie extends MovieShort {
	kinopoiskId: number;
	imdbId?: string;
	ratingKp?: number;
	ratingImdb?: number;
	ageRestriction: number;
	description: string;
	slogan?: string;
	budget?: string;
	trailer?: string;
	type: (typeof MovieType)[keyof typeof MovieType];
	actors: IActorShort[];
	countries: number[];
}

export const MovieType = {
	film: 'Film',
	serial: 'Serial'
} as const;

export interface Genre {
	id: number;
	name: string;
}

export interface Country {
	id: number;
	name: string;
}

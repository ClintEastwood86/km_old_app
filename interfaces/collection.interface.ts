import { MovieShort } from './movie.interface';
import { UserModelShort } from './user.interface';

export enum CollectionActions {
	Empty,
	Like,
	Dislike,
	Subscribe,
	Unsubscribe
}

export interface CollectionShort {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	color: string;
	private: boolean;
	creatorId: number;
	moviesId: number[];
	creator: UserModelShort;
	preview: MovieShort[];
	description: string;
	_count: {
		dislikes: number;
		likes: number;
		followers: number;
	};
}

export interface Collection extends Omit<CollectionShort, 'preview'> {
	likes: number[];
	dislikes: number[];
	followers: number[];
}

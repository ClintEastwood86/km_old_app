import { UserModelShort } from './user.interface';

export interface Comment {
	id: number;
	createdAt: string;
	updatedAt: string;
	content: string;
	movieId: number;
	userId: number;
	status: (typeof StatusComment)[keyof typeof StatusComment];
	parentId: number | null;
	user: Pick<UserModelShort, 'login' | 'avatar'> & { awardSelected: { icon: string | null } };
	likes: number[];
	dislikes: number[];
	_count: {
		children: number;
	};
}

export const StatusComment = {
	Rejected: 'REJECTED',
	Draft: 'DRAFT',
	Published: 'PUBLISHED'
} as const;

export enum StatusCommentEnum {
	Reject,
	Draft,
	Published
}

export enum CommentActions {
	Empty,
	Like,
	Dislike
}

export interface ReturnTypeActionComment {
	likes: number[];
	dislikes: number[];
}

export interface CommentCreateDto {
	content: string;
	movieId: number;
	parentId?: number;
}

export interface CommentAttachedAlias extends Comment {
	alias: string;
	user: Pick<Comment['user'], 'avatar' | 'awardSelected' | 'login'> & {
		id: number;
	};
}

import { CollectionShort } from './collection.interface';

export enum UserRole {
	USER = 'USER',
	MODERATOR = 'MODERATOR',
	ADMIN = 'ADMIN'
}

export interface UserModelShort {
	id: number;
	email: string;
	login: string;
	avatar?: string;
	role: UserRole;
	rankId: number;
	userPoints: number;
	awardId?: number;
	awardSelected?: {
		icon: string;
	};
}

export type UserModelShortForContext = (UserModelShort & { isAuth: true }) | { isAuth: false };

export type UserModelOther = Pick<UserModel, 'avatar' | 'userPoints' | 'id' | 'rankId' | 'watchedMinutes' | 'login' | 'awardId'> & {
	awardsOpen: { id: number }[];
	collections: CollectionShort[];
};

export interface UserModel extends UserModelShort {
	createdAt: Date;
	updatedAt: Date;
	updatedLoginAt?: Date;
	updatedEmailAt?: Date;
	password: string;
	notification: boolean;
	verified: boolean;
	blocked: boolean;
	watchedMinutes: number;
}

export type UserModelForAdmin = Pick<UserModel, 'blocked'> & Omit<UserModelShort, 'email'> & { email?: string };

export enum UsersForAdminPanelEnum {
	NEW,
	LOGIN,
	AVATAR
}

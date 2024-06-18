import { UserModelOther } from '@/interfaces/user.interface';

export const isUserModelOther = (data: Record<string, unknown>): data is UserModelOther => {
	if ('id' in data && 'rankId' in data && 'avatar' in data && 'login' in data && 'awardId' in data && 'watchedMinutes' in data) {
		return true;
	}
	return false;
};

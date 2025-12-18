import { IAward } from './awards.interface';
import { UserModel } from './user.interface';

interface LeaderboardUserSnapshot {
	id: number;
	createdAt: string;
	year: number;
	userId: number;
	rankId: number;
	position: number;
	pointsAchieved: number;
	minutesWatched: number;
}

export interface LeaderboardSnapshotResult {
	year: number;
	user?: LeaderboardUserSnapshot;
	top: (Omit<LeaderboardUserSnapshot, 'createdAt' | 'id' | 'year'> & {
		user: Pick<UserModel, 'login' | 'avatar' | 'rankId'> & { awardSelected?: Pick<IAward, 'icon'> | null };
	})[];
}

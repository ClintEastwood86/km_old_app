import { API } from '@/helpers/api';
import { IErrorResponse } from '@/interfaces/error.interface';
import { LeaderboardSnapshotResult } from '@/interfaces/leaderboard.interface';
import { isHttpError } from '@/typeguards/error.typeguard';

export const getLeaderboardSnapshot = async (): Promise<LeaderboardSnapshotResult> => {
	const res = await fetch(API.leaderboard.getSnapshotByYear(2025), { credentials: 'include' });
	const snapshot: LeaderboardSnapshotResult | IErrorResponse = await res.json();
	if (isHttpError(snapshot)) {
		throw snapshot;
	}
	return snapshot;
};

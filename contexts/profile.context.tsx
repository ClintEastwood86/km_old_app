import { IAward } from '@/interfaces/awards.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { IPointsItem } from '@/interfaces/points.interface';
import { IRank } from '@/interfaces/rank.interface';
import { UserModel } from '@/interfaces/user.interface';
import { createContext, PropsWithChildren } from 'react';

interface IProfileContext {
	user?: UserModel | IErrorResponse;
	ranks: IRank[];
	pointsItems: IPointsItem[];
	awards: IAward[];
}

export const ProfileContext = createContext<IProfileContext>({ ranks: [], pointsItems: [], awards: [] });

export const ProfileContextProvider = ({ pointsItems, ranks, user, awards, children }: PropsWithChildren<IProfileContext>) => {
	return <ProfileContext.Provider value={{ ranks, user, pointsItems, awards }}>{children}</ProfileContext.Provider>;
};

import { UserModelShortForContext } from '@/interfaces/user.interface';
import { PropsWithChildren, createContext } from 'react';

export const UserContext = createContext<UserModelShortForContext>({ isAuth: false });

export const UserContextProvider = ({ children, user }: PropsWithChildren<{ user: UserModelShortForContext }>) => {
	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

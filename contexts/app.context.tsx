import { NotificationData } from '@/components/Notification/Notification.type';
import { useNotification } from '@/hooks/notification.hook';
import { Dispatch, PropsWithChildren, SetStateAction, createContext } from 'react';

interface IAppContext {
	addNotification: (notification: NotificationData) => void;
}

interface IAppContextProvider {
	setNotification: null | Dispatch<SetStateAction<NotificationData[]>>;
}

export const AppContext = createContext<IAppContext>({
	addNotification: () => {
		null;
	}
});

export const AppContextProvider = ({ setNotification, children }: PropsWithChildren<IAppContextProvider>) => {
	const addNotification = (notification: NotificationData) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		setNotification && useNotification({ ...notification, setState: setNotification });
	};
	return <AppContext.Provider value={{ addNotification }}>{children}</AppContext.Provider>;
};

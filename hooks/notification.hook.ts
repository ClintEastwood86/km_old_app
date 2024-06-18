import { NotificationData } from '@/components/Notification/Notification.type';
import { Dispatch, SetStateAction } from 'react';

interface UseNotificationProps {
	setState: Dispatch<SetStateAction<NotificationData[]>>;
	key: string;
	title: string;
	description?: string;
}

export const useNotification = ({ title, description, key, setState }: UseNotificationProps) => {
	setState((state) => state.concat({ title, key, description }));

	setTimeout(() => {
		setState((state) => state.filter((n) => n.key !== key));
	}, 6_000);
};

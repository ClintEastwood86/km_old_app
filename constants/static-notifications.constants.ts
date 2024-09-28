import { NotificationData } from '@/components/Notification/Notification.type';

export const staticNotifications = {
	passwordChanged: {
		title: 'Пароль сменён',
		description: 'Требуется повторная авторизация',
		key: `passwordChanged`
	}
} satisfies Record<string, NotificationData>;

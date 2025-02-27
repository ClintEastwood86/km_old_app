import { NotificationData } from '@/components/Notification/Notification.type';

export const staticNotifications = {
	passwordChanged: {
		title: 'Пароль сменён',
		description: 'Требуется повторная авторизация',
		key: `passwordChanged`
	},
	useVPN: {
		title: 'Приложение блокируют',
		description: 'Приложение может быть недоступно без «специального сетевого сервиса»',
		key: 'useVPN'
	}
} satisfies Record<string, NotificationData>;

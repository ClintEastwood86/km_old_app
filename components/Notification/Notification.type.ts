import { NotificationProps } from './Notification.props';

export type NotificationData = Omit<NotificationProps, 'className'> & { key: string };

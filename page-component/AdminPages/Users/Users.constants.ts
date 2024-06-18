import { SelectQueryItem } from '@/components/Select/Select.props';
import { UsersForAdminPanelEnum } from '@/interfaces/user.interface';

export const USERS_PER_REQUEST = 15;

export const usersFilterQueries: SelectQueryItem<number>[] = [
	{ label: 'Новые', value: UsersForAdminPanelEnum.NEW },
	{ label: 'По логину', value: UsersForAdminPanelEnum.LOGIN },
	{ label: 'По аватарке', value: UsersForAdminPanelEnum.AVATAR }
];

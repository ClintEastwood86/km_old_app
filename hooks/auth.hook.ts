import { API } from '@/helpers/api';
import { IErrorResponse } from '@/interfaces/error.interface';
import { UserModelShort, UserRole } from '@/interfaces/user.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useCallback, useEffect, useState } from 'react';

export const useAuth = (role: UserRole = UserRole.ADMIN) => {
	const [authState, setAuthState] = useState<IErrorResponse | UserModelShort>();

	const getInfo = useCallback(async () => {
		const roles = Object.keys(UserRole);
		const response = await fetch(API.users.info + '?type=short', { method: 'get', credentials: 'include' });
		const info: UserModelShort | IErrorResponse = await response.json();
		if (!isHttpError(info) && roles.findIndex((r) => r == info.role) < roles.findIndex((r) => r == role)) {
			const error: IErrorResponse = { code: 403, message: 'Нет доступа', context: 'auth', data: { error: 'Ваша роль должна быть выше' } };
			return setAuthState(error);
		}
		setAuthState(info);
	}, [role]);

	useEffect(() => {
		getInfo();
	}, [getInfo]);

	return { authState };
};

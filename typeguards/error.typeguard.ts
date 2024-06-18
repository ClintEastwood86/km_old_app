import { IErrorResponse } from '@/interfaces/error.interface';

export const isHttpError = (dataOrUnknown: any): dataOrUnknown is IErrorResponse => {
	if (
		dataOrUnknown &&
		dataOrUnknown.code &&
		typeof dataOrUnknown.code == 'number' &&
		dataOrUnknown.data.error &&
		dataOrUnknown.context &&
		dataOrUnknown.message
	) {
		return true;
	}
	return false;
};

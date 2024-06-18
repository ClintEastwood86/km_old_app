export interface IErrorResponse {
	code: number;
	message: string;
	context: string;
	data: {
		error: string;
	} & Record<string, object | string>;
}

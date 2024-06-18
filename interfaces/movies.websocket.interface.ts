import { IErrorResponse } from './error.interface';

export enum MoviesWebsocketTypeResponse {
	Error,
	Connect,
	Ok
}

export interface MoviesConnectionResponseData {
	token: string;
}

export interface MoviesConnectionResponse {
	type: MoviesWebsocketTypeResponse.Connect;
	data: MoviesConnectionResponseData;
}

export interface MoviesErrorResponse {
	type: MoviesWebsocketTypeResponse.Error;
	data: IErrorResponse;
}

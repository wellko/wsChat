import {WebSocket} from 'ws';

export interface ActiveConnections {
	[id: string]: WebSocket
}

export interface IncomingMessage {
	type: string;
	payload: string | IUserMutation;
}

export interface IUser {
	username: string;
	password: string;
	token: string;
	role: string;
	displayName: string;
}

export type IUserMutation = Omit<IUser, 'token' | 'role'>

import {WebSocket} from 'ws';

export interface ActiveConnections {
	[id: string]: WebSocket
}

export interface IncomingMessage {
	type: string;
	payload: string | IUserMutation | MessageType;
}

export interface IUser {
	username: string;
	password: string;
	token: string;
	role: string;
	displayName: string;
	online: boolean;
}

export interface MessageType {
	type: string;
	text: string;
	author: string;
	to?: string;
}

export type IUserMutation = Omit<IUser, 'token' | 'role'>

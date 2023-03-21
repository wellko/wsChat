export interface Message {
	sender: string;
	message: string;
}

export interface IncomingMessage {
	type: string;
	payload: Message | IUser;
}

export interface IncomingUser {
	type: string;
	payload: IUser;
}

export interface RegisterMutation {
	username: string;
	password: string;
	displayName: string;
}

export type LoginType = Omit<RegisterMutation, 'displayName'>

export interface IUser {
	username: string;
	password: string;
	token: string;
	role: string;
	displayName: string;
}

export interface errorType {
	error: string;
}
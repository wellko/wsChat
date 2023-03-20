export interface Message {
	sender: string;
	message: string;
}

export interface IncomingMessage {
	type: string;
	payload: Message
}

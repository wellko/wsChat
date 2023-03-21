import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {ActiveConnections, IncomingMessage, IUser, IUserMutation, MessageType} from "./types";
import mongoose, {HydratedDocument} from "mongoose";
import config from "./config";
import User from "./models/User";
import Message from "./models/Message";

const crypto = require('crypto');
const app = express();
expressWs(app);
const activeConnections: ActiveConnections = {};
const port = 8000;
app.use(cors());
const router = express.Router();

const run = async () => {
	mongoose.set("strictQuery", false);
	await mongoose.connect(config.db);
	process.on("exit", () => {
		mongoose.disconnect();
	});
};

router.ws('/chat', async (ws) => {
	let id = crypto.randomUUID();
	console.log('client connected! id=', id);
	activeConnections[id] = ws;
	const messages = await Message.find().sort({_id: -1}).limit(30)
	ws.on('close', () => {
		console.log('client disconnected! id=', id);
		delete activeConnections[id];
	});
	ws.on('message', async (msg) => {
		const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
		switch (decodedMessage.type) {

			case 'LOGIN':
				try{
					const login = decodedMessage.payload as IUserMutation;
					const user = await User.findOne({ username: login.username});
					if (!user) {
						ws.send(JSON.stringify({type: 'ERROR' ,payload: "Username not found" }));
						break;
					}
					const isMatch = await user.checkPassword(login.password);
					if (!isMatch) {
						ws.send(JSON.stringify({type: 'ERROR' ,payload: "Password is wrong" }));
						break;
					}
					user.generateToken();
					await user.save();
					ws.send(JSON.stringify({
						type: 'LOGIN',
						payload: user
					}));
						delete activeConnections[id];
						activeConnections[user.username] = ws;
						ws.send(JSON.stringify({
							type: 'EXISTING_MESSAGES',
							payload: messages,
						}));
					break;
				} catch (e){
					ws.send(JSON.stringify(e));
					break;
				}

			case 'REGISTRATION':
				const register = decodedMessage.payload as IUserMutation;
				try {
					const user = new User({
						username: register.username,
						password: register.password,
						displayName: register.displayName,
					});
					user.generateToken();
					await user.save();
					ws.send(JSON.stringify({
						type: 'LOGIN',
						payload: user
					}));
				} catch (error) {
					ws.send(JSON.stringify(error));
				}
				break;
			case 'SEND_MESSAGE':
				try {
					const messagePayload = decodedMessage.payload as MessageType;
					const message = new Message({
						author: messagePayload.author,
						text: messagePayload.text,
					})
					await message.save();
					Object.keys(activeConnections).forEach(connId => {
						const conn = activeConnections[connId];
						conn.send(JSON.stringify({
							type: 'NEW_MESSAGE',
							payload: decodedMessage.payload,
						}));
					});
				} catch (error) {
					ws.send(JSON.stringify(error));
				}
				break;
			case 'SEND_WHISPER':
				try {
					const messagePayload = decodedMessage.payload as MessageType;
					const message = new Message({
						author: messagePayload.author,
						text: messagePayload.text,
						type: messagePayload.type,
						to: messagePayload.to,
					})
					await message.save();
					const poster = await User.findOne({_id: messagePayload.author}) as HydratedDocument<IUser>;
					const getter = await User.findOne({_id: messagePayload.to}) as HydratedDocument<IUser>;
					activeConnections[poster.username].send(JSON.stringify({
						type: 'NEW_MESSAGE',
						payload: {
							author: poster.username,
							text: messagePayload.text,
							to: getter.username
						},
					}))
					activeConnections[getter.username].send(JSON.stringify({
						type: 'NEW_MESSAGE',
						payload: {
							author: poster.username,
							text: messagePayload.text,
							to: getter.username
						},
					}))
				} catch (error) {
					ws.send(JSON.stringify(error));
				}
				break;
			default:
				console.log('Unknown message type:', decodedMessage.type);
		}
	});
});
app.use(router);

app.listen(port, () => {
	console.log(`Server started on ${port} port!`);
});


run().catch(console.error);
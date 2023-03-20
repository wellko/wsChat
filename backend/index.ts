import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {ActiveConnections, IncomingMessage, IUserMutation} from "./types";
import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";

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

router.ws('/chat', (ws) => {
	let id = crypto.randomUUID();
	console.log('client connected! id=', id);
	activeConnections[id] = ws;
	ws.send(JSON.stringify({
		type: 'NEW_MESSAGES',
		payload: 'hello',
	}));
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
					ws.send(JSON.stringify({ error: "Username not found" }));
					break;
				}
				const isMatch = await user.checkPassword(login.password);
				if (!isMatch) {
					ws.send(JSON.stringify({ error: "Password is wrong" }));
					break;
				}
				user.generateToken();
				await user.save();
				ws.send(JSON.stringify({ message: "Username and password correct!", user }));
				if (user.token){
					delete activeConnections[id];
					activeConnections[user.username] = ws;
					console.log(activeConnections)
				}
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
					 ws.send(JSON.stringify({message: "registration complete!", user}));
				} catch (error) {
					 ws.send(JSON.stringify(error));
				}
				break;
			case 'SEND_MESSAGE':
				Object.keys(activeConnections).forEach(connId => {
					const conn = activeConnections[connId];
					conn.send(JSON.stringify({
						type: 'NEW_MESSAGE',
						payload: decodedMessage.payload,
					}));
				});
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
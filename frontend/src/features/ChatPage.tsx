import React, {useEffect, useRef, useState} from 'react';
import {IUser, LoginType, Message, RegisterMutation} from "../types";
import MessageForm from "../components/MessageForm";
import {Box, Button, Container, Grid, Paper, Typography} from "@mui/material";
import OnlineList from "../components/OnlineList";
import Register from "../components/Register";
import Login from "../components/Login";
import AppToolbar from "../components/AppToolbar";


const ChatPage = () => {
	const ws = useRef<WebSocket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [user, setUSer] = useState<IUser | null>(null);
	const [registered, setRegistered] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [online, setOnline] = useState<IUser[]>([]);

	useEffect(() => {
		const connect = ()=> {
			ws.current = new WebSocket('ws://localhost:8000/chat');
			ws.current.onclose = () => {
				onLogOut(user!.username);
				connect();
			};
			ws.current.onmessage = event => {
				const decodedMessage = JSON.parse(event.data);
				if (decodedMessage.type === 'EXISTING_MESSAGES') {
					decodedMessage.payload as Message[];
					setMessages(decodedMessage.payload.reverse());
				}
				if (decodedMessage.type === 'DELETE_MESSAGE') {
					setMessages(messages => messages.filter(el => el._id !== decodedMessage.payload));
				}
				if (decodedMessage.type === "ONLINE_USERS") {
					decodedMessage.payload as IUser[];
					setOnline(decodedMessage.payload);
				}
				if (decodedMessage.type === 'ERROR') {
					setError(decodedMessage.payload);
				}
				if (decodedMessage.type === 'NEW_MESSAGE') {
					decodedMessage.payload as Message;
					setMessages((messages) => messages.concat(decodedMessage.payload));
				}
				if (decodedMessage.type === 'LOGIN') {
					decodedMessage.payload as IUser;
					setUSer(decodedMessage.payload);
					setError(null);
				}
				if (decodedMessage.type === 'NEW_ONLINE') {
					decodedMessage.payload as IUser;
					setOnline(prev => prev.concat(decodedMessage.payload))
				}
				if (decodedMessage.type === 'OFFLINE') {
					decodedMessage.payload as string;
					setOnline(prev =>
						prev.filter(users => users.username !== decodedMessage.payload)
					)
				}
			};
		}
		connect();
		return () => {
			if (ws.current) {
				ws.current.close();
			}
		}
	}, []);


	const onLogOut = (arg: string) => {
		if (!ws.current)
			return;
		setUSer(null);
		ws.current.send(JSON.stringify({
			type: 'OFFLINE',
			payload: arg
		}));
	}

	const registration = (arg: RegisterMutation) => {
		if (!ws.current)
			return;
		ws.current.send(JSON.stringify({
			type: 'REGISTRATION',
			payload: arg
		}));
		ws.current.send(JSON.stringify({
			type: 'LOGIN',
			payload: {
				username: arg.username,
				password: arg.password,
			}
		}));
	}

	const MessageSender = (arg: string) => {
		if (!ws.current)
			return;
		ws.current.send(JSON.stringify({
			type: 'SEND_MESSAGE',
			payload: {
				author: user?._id,
				text: arg
			}
		}));
	}

	const login = (arg: LoginType) => {
		if (!ws.current)
			return;
		ws.current.send(JSON.stringify({
			type: 'LOGIN',
			payload: arg
		}));
	}

	const loginChange = () => {
		setRegistered(!registered);
	}

	const resetError = () => {
		setError(null);
	}

	const moderDelete = (id: string) => {
		if (!ws.current || user?.role !== 'moderator')
			return;
		ws.current.send(JSON.stringify({
			type: 'DELETE_MESSAGE',
			payload: id
		}));
	}


	return (
		<Container>
			{user ? <>
				<AppToolbar user={user} onLogout={onLogOut}/>
				<Grid container>
					<Grid item xs={4}>
						<OnlineList users={online}/>
					</Grid>
					<Grid item xs={8} height="700px" sx={{overflowY: 'scroll', overflowWrap: 'break-word'}}>
						{messages.map((el) => <Paper sx={{mb: 2}} elevation={3} key={Math.random()} ><Grid  sx={{overflow: 'hidden'}} container justifyContent='space-between'>
								<Typography sx={{wordWrap: 'break-word'}}><b>{el.author.displayName}:</b> {el.text} </Typography>
								{user?.role === 'moderator' &&
									<Grid item sx={{marginLeft: 'auto'}}>
									<Button type='button' variant='text' onClick={() => moderDelete(el._id)}>x</Button>
								</Grid>}
							</Grid></Paper>
						)}
					</Grid>
				</Grid>
				<Box sx={{position: 'sticky', bottom: '0px', left: '0px', width: '100%', zIndex: '99', bgcolor: 'FFF'}}>
					<MessageForm submitFormHandler={MessageSender}/>
				</Box>
			</> : registered ? <Register onRegister={registration} onLoginChange={loginChange}/> :
				<Login resetError={resetError} onLogin={login} onLoginChange={loginChange} error={error}/>}


		</Container>
	);
};

export default ChatPage;
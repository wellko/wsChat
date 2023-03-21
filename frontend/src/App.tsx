import {useEffect, useRef, useState} from "react";
import { IUser, LoginType, Message, RegisterMutation} from "./types";
import Register from "./components/Register";
import Login from "./components/Login";
import ChatPage from "./features/ChatPage";

function App() {
    const ws = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUSer] = useState<IUser | null>(null);
    const [registered, setRegistered] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [online, setOnline] = useState<IUser[]>([]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');
        ws.current.onclose = () => console.log("ws closed");
        ws.current.onmessage = event => {
            const decodedMessage = JSON.parse(event.data);
            if (decodedMessage.type === 'EXISTING_MESSAGES'){
                decodedMessage.payload as Message[];
                setMessages(decodedMessage.payload.reverse());
            }
            if (decodedMessage.type ==="ONLINE_USERS"){
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
            if (decodedMessage.type === 'NEW_ONLINE'){
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

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        }
    }, []);

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
                password:arg.password,
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
    return (
        <div className="App">
            {user ? <ChatPage online={online} messages={messages} onSubmit={MessageSender}/> : registered ? <Register onRegister={registration} onLoginChange={loginChange}/> :
                <Login onLogin={login} onLoginChange={loginChange} error={error}/>}
        </div>
    )
}

export default App

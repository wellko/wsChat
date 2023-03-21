import {useEffect, useRef, useState} from "react";
import {IUser, LoginType, Message, RegisterMutation} from "./types";
import Register from "./components/Register";

function App() {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user,setUSer] = useState<IUser | null>( null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');
    ws.current.onclose = () => console.log("ws closed");
    ws.current.onmessage = event => {
      const decodedMessage = JSON.parse(event.data);
      if (decodedMessage.type === 'NEW_MESSAGE') {
        decodedMessage.payload as Message;
        setMessages((messages) => [...messages, decodedMessage.payload]);
      }
      if (decodedMessage.type === 'LOGIN') {
        decodedMessage.payload as IUser;
        setUSer(decodedMessage.payload);
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
      {user? 'HERE' : <Register onRegister={registration} onLoginChange={loginChange}/>}
    </div>

  )
}

export default App

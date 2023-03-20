import {useEffect, useRef, useState} from "react";
import {IncomingMessage, Message} from "./types";

function App() {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');
    ws.current.onclose = () => console.log("ws closed");
    ws.current.onmessage = event => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;
      if (decodedMessage.type === 'NEW_MESSAGE') {
        setMessages((messages) => [...messages, decodedMessage.payload]);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    }
  }, []);
  return (
    <div className="App">
<button onClick={() => {
  ws.current?.send(JSON.stringify({
    type: 'LOGIN',
    payload: {
      username: 'me',
      password: 'pew',
    }
  }))
}}>login 1</button>

      <button onClick={() => {
        ws.current?.send(JSON.stringify({
          type: 'LOGIN',
          payload: {
            username: 'pawpaw',
            password: 'paw',
          }
        }))
      }}>login 2</button>

      <button onClick={() => {
        ws.current?.send(JSON.stringify({
          type: 'SEND_WHISPER',
          payload: {
            author: '641745f1342e03ab5cca72e1',
            text: 'paw',
            type: 'whisper',
            to: '64189227cdca88543f931096'
          }
        }))
      }}>message</button>
    </div>

  )
}

export default App

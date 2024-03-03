import '../App.css';
import { useEffect, useState, useContext, ChangeEvent, FormEvent } from 'react';
import { UserContext } from '../App';
import io, { Socket } from 'socket.io-client';

const Home = () => {
    const [chats, setChats] = useState([])
    const [users, setUsers] = useState<User[]>([])
    const { userId } = useContext(UserContext)
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
    const [receiverId, setReceiverId] = useState<number | null>(null)

    interface Message {
        content: string;
        senderId: number;
        receiverId: number;
    }

    useEffect(() => {
        const socket = io('http://localhost:3000');
        setSocket(socket);
    
        socket.on('receive-message', (message) => {
          setReceivedMessages((prevMessages) => [...prevMessages, message]);
        });
    
        return () => {
          socket.disconnect();
        };
      }, []);

      const sendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (socket && message.trim() !== '') {
          const newMessage = {
            content: message,
            senderId: userId,
            receiverId: receiverId
          };
          socket.emit('send-message', newMessage);
          setMessage('');
        }
      };
    
    const getChats = () => {
        fetch(`http://localhost:3000/rooms/${userId}`)
            .then((resp) => {
                return resp.json();
            })
            .then((resp) => {
                setChats(resp)
                return;
            })
    }

    const getAllUsers = () => {
        fetch('http://localhost:3000/users')
            .then((resp) => {
                return resp.json();
            })
            .then((resp) => {
                setUsers(resp.users[0])
                
            })
    }

    useEffect(() => {
        console.log(`all messages: ${JSON.stringify(receivedMessages)}`)
        console.log(`all chats: ${JSON.stringify(chats)}`)
    },[receivedMessages, chats])

    useEffect(() => {
        console.log(`user id: ${userId}`)
        getAllUsers()
        getChats()
    },[])

    interface User {
        id: number,
        first_name: string,
        last_name: string,
        username: string,
        password: string
    }

    const handleMsg = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const handleReceiverId = (id: number) => {
        setReceiverId(id)
    }

    return(
        <>
            <div>dis da home page gang</div>
            <form onSubmit={(e) => sendMessage(e)}>
                <select>
                { users && users.map((user, index) => {
                return(
                    <option key={index} value={user.id} onChange={() => handleReceiverId(user.id)}>{user.username}</option>
                )
            })}
                </select>
                <label>Messge:
                    <input type='text' value={message} onChange={(e) => handleMsg(e)} alt='Enter message...' />
                </label>
            </form>
             
        </>
    )
}

export default Home;
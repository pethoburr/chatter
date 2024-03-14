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
    const [receiverId, setReceiverId] = useState<number>(0)
    const [receiverErr, setReceiverErr] = useState(false)
    const [roomName, setRoomName] = useState('')
    const [memberId, setMemberId] = useState('')
    const [addedMembers, setAddedMembers] = useState<string[]>([])

    interface Message {
        content: string;
        sender_id: number;
        receiver_id: number;
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
        if (!userId) {
            console.log('user id is null')
            return;
        } else {
            const sender = parseInt(userId)
            if (socket && message.trim() !== '') {
                if (receiverId === 0) {
                    setReceiverErr(true);
                    return;
                } else {
                    const newMessage: Message = {
                        content: message,
                        sender_id: sender,
                        receiver_id: receiverId,
                      };
                      socket.emit('send-message', newMessage);
                      setMessage('');
                }
              }
        }
      };
    
    const getChats = () => {
        fetch(`http://localhost:3000/rooms/${userId}`)
            .then((resp) => {
                return resp.json();
            })
            .then((resp) => {
                setChats(resp.roomNames)
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

    const handleReceiverId = (e: ChangeEvent<HTMLSelectElement>) => {
        const num: number = parseInt(e.target.value)
        setReceiverId(num)
    }

    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value)
    }
    
    const getUsername = (id: string) => {
        const num = parseInt(id)
        users.map((user) => {
            if (user.id === num) {
                setAddedMembers([...addedMembers, user.username])
            }
        })
    }

    const handleMembers = (e: ChangeEvent<HTMLSelectElement>) => {
        setMemberId(e.target.value)
        getUsername(e.target.value)
    }

    const removeGuy = (guy: string) => {
        const arr = addedMembers.filter(name => name !== guy)
        setAddedMembers(arr)
    }

    const newRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(`room name: ${roomName}`)
        if (!userId) {
            console.log('no user id')
            return;
        } else {
            const sender = parseInt(userId)
            console.log(`sender: ${sender}`)
            if (socket && roomName !== '') {
                socket.emit('create-room', roomName, userId, addedMembers)
                setRoomName('')
            }
        }
    }

    return(
        <>
            <div>dis da home page das on gang</div>
            { chats && chats.map((chat) => {
                return(
                    <>
                        <button>{chat}</button>
                    </>
                )
            })}
            <form onSubmit={(e) => sendMessage(e)}>
                <h1>msg form</h1>
                <select value={receiverId} onChange={(e) => handleReceiverId(e)}>
                { users && users.map((user, index) => {
                return(
                    <option key={index} value={user.id} >{user.username}</option>
                )
                })}
                </select>
                { receiverErr && <p>please select user ya donkey</p> }
                <label htmlFor='msg'>Messge:
                    <input type='text' value={message} name='msg' onChange={(e) => handleMsg(e)} alt='Enter message...' />
                </label>
                <button type='submit'>Send</button>
            </form>
             <form onSubmit={(e) => newRoom(e)}>
                <h1>new room form</h1>
                <label htmlFor='title'>title:
                    <input type='text' name='title' alt='Enter room name...' onChange={(e) => handleTitle(e)} />
                </label>
                <label>Add users to group:
                    <select value={memberId} onChange={(e) => handleMembers(e)}>
                    { users && users.map((user, index) => {
                    return(
                        <option key={index} value={user.id} >{user.username}</option>
                    )
                    })}
                    </select>
                    { addedMembers && addedMembers.map((guy) => {
                        return <div>{guy}<button onClick={() => removeGuy(guy)}>-</button></div>
                    })}
                </label>
                <button type='submit'>Create</button>
             </form>
        </>
    )
}

export default Home;
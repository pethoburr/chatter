import '../App.css';
import { useEffect, useState, useContext, ChangeEvent, FormEvent } from 'react';
import { UserContext } from '../App';
import io, { Socket } from 'socket.io-client';

interface Chats {
    id: number,
    title: string
}

const Home = () => {
    const [chats, setChats] = useState<Chats[]>([])
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
    const [currentRoom, setCurrentRoom] = useState<number | null>(null)

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
                      socket.emit('send-message', newMessage, currentRoom);
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
                setChats(resp.room)
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
        console.log(`current room: ${currentRoom}`)
    },[receivedMessages, chats, currentRoom])

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

    const changeRoom = (id: number | null) => {
        setCurrentRoom(id)
    }

    return(
        <>
            <div className="page">
            <div className='sidebar'>
                <div className="chats">
                { chats && chats.map((chat) => {
                return(
                    <>
                        <button onClick={() => changeRoom(chat.id)}>{chat.title}</button>
                    </>
                )
                })}
                </div>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">+</button>
            <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">New message</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={(e) => newRoom(e)}>
                    <div className="form-group">
                        <label htmlFor="message-text" className="col-form-label">Group Name:</label>
                        <input type='text' className="form-control" id="message-text" onChange={(e) => handleTitle(e)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-name" className="col-form-label">Recipients:</label>
                        <select value={memberId} onChange={(e) => handleMembers(e)}>
                        { users && users.map((user, index) => {
                        return(
                            <option key={index} value={user.id} >{user.username}</option>
                        )
                        })}
                        { addedMembers && addedMembers.map((guy) => {
                        return <div>{guy}<button onClick={() => removeGuy(guy)}>-</button></div>
                    })}
                    </select>
                    </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary">Send message</button>
                </div>
                </div>
            </div>
            </div>
            </div>
            <div className="msgContainer">
                <div className='msgs'>msgs...</div>
                <form className='msgForm' onSubmit={(e) => sendMessage(e)}>
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
            </div>
            </div>
        </>
    )
}

export default Home;
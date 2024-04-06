import '../App.css';
import { useEffect, useState, useContext, ChangeEvent, FormEvent } from 'react';
import { UserContext } from '../App';
import io, { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

interface Chats {
    id: number,
    title: string
}

interface Msgs {
    id: number,
    content: string,
    room_id: number,
    timestamp: Date
}

interface Members {
    id: number,
    name: string
}

const Home = () => {
    const [chats, setChats] = useState<Chats[]>([])
    const [users, setUsers] = useState<User[]>([])
    const { userId, logout } = useContext(UserContext)
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Msgs[]>([])
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
    const [roomName, setRoomName] = useState('')
    const [memberId, setMemberId] = useState('')
    const [addedMembers, setAddedMembers] = useState<Members[]>([])
    const [currentRoom, setCurrentRoom] = useState<number | null>(null)
    const navigator = useNavigate()

    interface Message {
        content: string,
        user_id: number | null,
        room_id: number | null
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

      const getMsgs = async(id: number | null) => {
        const resp = await fetch(`http://localhost:3000/get-messages/${id}`)
        const jayed = await resp.json()
        console.log(`msgs: ${JSON.stringify(jayed.msgs)}`)
        setMessages(jayed.msgs)
      }

      useEffect(() => {
        getMsgs(currentRoom)
      },[currentRoom])

      const sendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!userId) {
            console.log('user id is null')
            return;
        } else {
            const sender = parseInt(userId)
            if (socket && message.trim() !== '') {
                    const newMessage: Message = {
                        content: message,
                        user_id: sender,
                        room_id: currentRoom
                      };
                      socket.emit('send-message', newMessage, roomName, addedMembers);
                      setMessage('');
                }
              }
        }
    
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
    },[receivedMessages, chats, currentRoom])

    useEffect(() => {
        if (userId === null) {
            navigator('/log-in')
        }
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

    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value)
    }
    
    const getUsername = (id: string) => {
        const num = parseInt(id)
        users.map((user) => {
            if (user.id === num) {
                setAddedMembers([...addedMembers, { id: user.id, name: user.username}])
            }
        })
    }

    const handleMembers = (e: ChangeEvent<HTMLSelectElement>) => {
        setMemberId(e.target.value)
        getUsername(e.target.value)
    }

    const removeGuy = (guy: Members) => {
        const arr = addedMembers.filter(dude => dude.name !== guy.name)
        setAddedMembers(arr)
    }

    const newRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!userId) {
            console.log('no user id')
            return;
        } else {
            const sender = parseInt(userId)
            if (socket && roomName !== '') {
                socket.emit('create-room', roomName, sender, addedMembers)
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
            <nav><button onClick={() => logout()}>logout</button></nav>
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
                        <label htmlFor="message-text" className="col-form-label">Chat Name:</label>
                        <input type='text' className="form-control" id="message-text" onChange={(e) => handleTitle(e)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipient-name" className="col-form-label">Recipients:</label>
                        <select value={memberId} onChange={(e) => handleMembers(e)}>
                        { users && users.map((user, index) => {
                        return(
                            <option key={index} value={user.id} ><div>{user.username}</div></option>
                        )
                        })}
                        
                    </select>
                    { addedMembers && addedMembers.map((guy) => {
                        return <div>{guy.name}<button onClick={() => removeGuy(guy)}>-</button></div>
                    })}
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
                {messages.length > 0 ? 
                    messages.map((oj) => (
                        <div className='msgs' key={oj.id}>
                            <p>{oj.content}</p>
                            <p>{oj.timestamp.toLocaleString()}</p>
                        </div>
                     )) : <p className='msgs'>no messages</p>
                }
                <form className='msgForm' onSubmit={(e) => sendMessage(e)}>
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
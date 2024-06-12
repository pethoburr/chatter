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
    room_id: number | null,
    timestamp: Date
}

interface Members {
    id: number,
    name: string
}

const Home = () => {
    const [chats, setChats] = useState<Chats[]>([])
    const [switcher, setSwitcher] = useState(false)
    const [users, setUsers] = useState<User[]>([])
    const { userId, token, logout } = useContext(UserContext)
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Msgs[]>([])
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
    const [roomName, setRoomName] = useState('')
    const [memberId, setMemberId] = useState('')
    const [addedMembers, setAddedMembers] = useState<Members[]>([])
    const [currentRoom, setCurrentRoom] = useState<number | null>(null)
    const navigator = useNavigate()
    const [newMsg, setNewMsg] = useState(false)
    const [firsty, setFirsty] = useState(false)
    const [newInv, setNewInv] = useState(false)
    const [invId, setInvId] = useState(null)
    const [invTitle, setInvTitle] = useState(false)
    const [invPpl, setInvPpl] = useState<string[]>([])
    const [invited, setInvited] = useState([])
    const [yesCheck, setYesCheck] = useState(false)
    const [noCheck, setNoCheck] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

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

      const closeModal = () => {
        const modal = document.getElementById('exampleModal');
                    if (modal) {
                        modal.classList.remove('show');
                        modal.setAttribute('aria-hidden', 'true');
                        modal.setAttribute('style', 'display: none');
                        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
                        modalBackdrop.parentNode?.removeChild(modalBackdrop);
                    }
      }

      const closeInviteModal = () => {
        const modal = document.getElementById('inviteModal');
                    if (modal) {
                        modal.classList.remove('show');
                        modal.setAttribute('aria-hidden', 'true');
                        modal.setAttribute('style', 'display: none');
                        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
                        modalBackdrop.parentNode?.removeChild(modalBackdrop);
                    }
      }

      const getMsgs = async(id: number | null) => {
        const resp = await fetch(`http://localhost:3000/get-messages/${id}`, {  headers: {
            'Authorization': `Bearer ${token}`
        }})
        const jayed = await resp.json()
        console.log(`msgs: ${JSON.stringify(jayed.msgs)}`)
        setMessages(jayed.msgs)
      }

      useEffect(() => {
        if (!firsty) {
            getMsgs(currentRoom)
        } else {
            setFirsty(false)
        }
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
                      console.log("currentRoom" + currentRoom)
                      socket.emit('send-message', newMessage, roomName, addedMembers.length ? addedMembers : []);
                      setMessages(prev =>  [
                        ...prev, { id: 69,
                        content: message,
                        room_id: currentRoom,
                        timestamp: new Date ()
                    }
                    ])
                    setMessage('');
                    closeModal()
                }
              }
        }
    
    const getChats = () => {
        fetch(`http://localhost:3000/rooms/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((resp) => {
                return resp.json();
            })
            .then((resp) => {
                setChats(resp.room)
                console.log(`this bitch right hurr: ${JSON.stringify(resp.room)}`)
                return;
            })
    }

    const getAllUsers = () => {
        fetch('http://localhost:3000/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
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

    const handleYesCheck = () => {
        setNoCheck(false)
        setYesCheck(true)
    }

    const handleNoCheck = () => {
        setNoCheck(true)
        setYesCheck(false)
    }

    const removeGuy = (guy: Members) => {
        const arr = addedMembers.filter(dude => dude.name !== guy.name)
        setAddedMembers(arr)
    }

    const newRoom = (e: FormEvent<HTMLFormElement>, name: string) => {
        e.preventDefault()
        if (!userId) {
            console.log('no user id')
            return;
        } else {
            const sender = parseInt(userId)
            if (socket !== null) {
                console.log(`roomName: ${roomName}, sender: ${sender}, addedMembers: ${JSON.stringify(addedMembers)}`)
                socket.emit('create-room', roomName !== '' ? roomName : name, sender, addedMembers)
                socket.once('created-room', (room) => {
                    console.log(`called room: ${JSON.stringify(room)}`)
                    setCurrentRoom(room.id)
                    setChats((prev) => [...prev, room])
                    setNewMsg(true)
                })
                setRoomName('')
                setAddedMembers([])
                closeModal()
            }
        }
    }

    useEffect(() => {
        console.log(`current room: ${currentRoom}`)
    },[currentRoom])

    const changeRoom = (id: number | null) => {
        setCurrentRoom(id)
    }

    const logOut = () => {
        logout()
        navigator('/log-in')
    }

    const switcheroo = () => {
        if (!switcher) {
            setSwitcher(true)
        } else {
            setSwitcher(false)
        }
    }

    const newMessage = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let username = '';
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === addedMembers[0].id) {
                username = users[i].username
                break;
            }
        }
        console.log('called in new msg')
        let sender = 0
        if (userId) { sender = parseInt(userId) }
        console.log(`ayo ${sender} wats happenin ${message}`)
            setMessages([
                { id: sender,
                content: message,
                room_id: currentRoom,
                timestamp: new Date ()
            }
            ])
            setFirsty(true)
        setRoomName(username)
        newRoom(e, username)
    }

    const leaveGroup = () => {
        if (socket !== null && userId !== null) {
            chats.map((chat) => {
                if (chat.id === currentRoom) {
                    const guy = parseInt(userId)
                    socket.emit('leave-room', chat.title, guy, chat.id)
                    const updated = chats.filter(chat => chat.id !== currentRoom)
                    console.log(`updated: ${updated}`)
                    setChats(updated)
                    setCurrentRoom(null)
                    setMessages([])
                }
            })
        }
    }

    useEffect(() => {
        if (socket !== null) {
            socket.on('invite', (id, title, people) => {
                setNewInv(true)
                setInvId(id)
                setInvTitle(title)
                setInvited(people)
            })
        }
    })

    const invite = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(`user: ${userId}, added in invite: ${JSON.stringify(addedMembers)}`)
        if (socket !== null) {
            chats.forEach((chat) => {
                if (chat.id === currentRoom) {
                    addedMembers.forEach(async (id) => {
                        const resp = await fetch(`https://localhost:3000/get-name/${id}`)
                        const jayed: string = await resp.json()
                        setInvPpl((prev) => [...prev, jayed])
                    })
                    socket.emit('invite', chat.id, chat.title, invPpl)
                }
            })
            
        }
        closeInviteModal()
    }
  
    const handleJoiner = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (yesCheck && !noCheck && socket !== null && userId) {
            const sender = parseInt(userId)
            socket.emit('join-room', invTitle, sender, invId)
        }   
    }

    useEffect(() => {
        if (newMsg) {
            if (!userId) {
                console.log('user id is null')
                return;
            } else {
                const sender = parseInt(userId)
                if (socket !== null) {
                        const newMessage: Message = {
                            content: message,
                            user_id: sender,
                            room_id: currentRoom
                          };
                          console.log("currentRoom" + currentRoom)
                          socket.emit('send-message', newMessage, roomName, addedMembers.length ? addedMembers : []);
                        setMessage('')
                        setAddedMembers([])
                        setNewMsg(false)
                    }
                  }
        }
    },[newMsg])

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    return(
        <>
            <div className="page">
                <nav className='navBar'>
                    <h1>Thiscord</h1>
                    <div className='navRight'>
                        
                        <div className='dropdown'>
                            <button onClick={toggleDropdown} className='avatar'>MP</button>
                            { isOpen && (
                                <div className='dropdown-menu'>
                                    <ul>
                                        <li>Profile</li>
                                        <li>Settings</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button className='logout' onClick={() => logOut()}>Log out</button>
                    </div>
                </nav>
                <div className="chatNbar">
                <div className='sidebar'>
                <div className="chats">
                { chats && chats.map((chat, index) => {
                return(
                        <button key={index}  onClick={() => changeRoom(chat.id)}>{chat.title}</button>
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
                    <button onClick={() => switcheroo()}>{ switcher ? 'New chat' : 'New group' }</button>
                    { switcher ? 
                        <form onSubmit={(e) => newRoom(e, 'nada')}>
                        <div className="form-group">
                            <label htmlFor="message-text" className="col-form-label">Group Name:</label>
                            <input type='text' className="form-control" id="message-text" onChange={(e) => handleTitle(e)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="recipient-name" className="col-form-label">Recipients:</label>
                            <select value={memberId} onChange={(e) => handleMembers(e)}>
                            { users && users.map((user) => {
                            return(
                                <option key={user.id} value={user.id} >{user.username}</option>
                            )
                            })}
                        </select>
                        { addedMembers && addedMembers.map((guy) => {
                            return <div>{guy.name}<button onClick={() => removeGuy(guy)}>-</button></div>
                        })}
                        </div>
                        <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary">Send</button>
                    </div>
                        </form>
                         :
                         <form onSubmit={(e) => newMessage(e)}>
                         <div className="form-group">
                      <label htmlFor="recipient-name" className="col-form-label">Recipient:</label>
                      <select value={memberId} onChange={(e) => handleMembers(e)}>
                      { users && users.map((user) => {
                      return(
                          <option key={user.id} value={user.id} >{user.username}</option>
                      )
                      })}
                      
                  </select>
                  </div>
                  <div className="form-group">
                      <label htmlFor="message-text" className="col-form-label">Enter message:</label>
                      <input type='text' className="form-control" id="message-text" value={message} onChange={(e) => handleMsg(e)} />
                  </div>
                  <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary">Send</button>
                    </div>
                      </form>
                    }
                </div>
                
                </div>
            </div>
            </div>
            { newInv && (
            <form onSubmit={(e) => handleJoiner(e)}>
                <p>Join Group? {invTitle}</p>
                <p>Group members:
                    <ul>
                        {invited && invited.map((guy) => {
                            return(
                                <li>{guy}</li>
                            )
                            
                        })}
                    </ul>
                </p>
                <input type='checkbox' onChange={handleYesCheck}>Yes</input>
                <input type='checkbox' onChange={handleNoCheck}>No</input>
                <button type='submit'>Submit</button>
            </form>
            )}
            </div>
            <div className="msgNform">
            <div className="msgContainer">
           { currentRoom && (
            <>
                <button onClick={() => leaveGroup()}>Leave Group</button>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#inviteModal">
            Invite
            </button>
            <div className="modal fade" id="inviteModal" tabIndex={-1} aria-labelledby="inviteModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="inviteModalLabel">Select user</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <form onSubmit={(e) => invite(e)}>
                                    <div className="form-group">
                                        <label htmlFor="recipient-name" className="col-form-label">Recipients:</label>
                                        <select value={memberId} onChange={(e) => handleMembers(e)}>
                                        { users && users.map((user) => {
                                        return(
                                            <option key={user.id} value={user.id} >{user.username}</option>
                                        )
                                        })}
                                    </select>
                                    { addedMembers && addedMembers.map((guy) => {
                                        return <div>{guy.name}<button onClick={() => removeGuy(guy)}>-</button></div>
                                    })}
                                    </div>
                                    <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Add</button>
                                </div>
                                    </form>
                </div>
                </div>
            </div>
            </div>
            </>)} 
                {messages.length > 0 ? 
                    messages.map((oj) => (
                        <div className='msgs' key={oj.id}>
                            <p>{oj.content}</p>
                            <p>{oj.timestamp.toLocaleString()}</p>
                        </div>
                     )) : <p className='msgs'>no messages</p>
                }
            </div>
            <form className='msgForm' onSubmit={(e) => sendMessage(e)}>
                    <label htmlFor='msg'>Message:
                        <input type='text' value={message} name='msg' onChange={(e) => handleMsg(e)} alt='Enter message...' />
                    </label>
                    <button type='submit'>Send</button>
                </form>
            </div> 
                </div>
            </div>
        </>
    )
}

export default Home;
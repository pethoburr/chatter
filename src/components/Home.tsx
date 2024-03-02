import '../App.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';

const Home = () => {
    const [chats, setChats] = useState([])
    const [users, setUsers] = useState<User[]>([])
    const { userId } = useContext(UserContext)
    
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
        console.log(`all users: ${JSON.stringify(users)}`)
    },[chats])

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

    return(
        <>
            <div>dis da home page gang</div>
            <form>
                <select>
                { chats && users.map((user, index) => {
                return(
                    <option key={index}>{user.username}</option>
                )
            })}
                </select>
            </form>
             
        </>
    )
}

export default Home;
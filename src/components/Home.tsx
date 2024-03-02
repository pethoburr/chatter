import '../App.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';

const Home = () => {
    const [chats, setChats] = useState([])
    const { userId } = useContext(UserContext)
    
    const getChats = () => {
        fetch(`http://localhost:3000/rooms/${userId}`)
            .then((resp) => {
                return resp.json();
            })
            .then((resp) => {
                console.log(`room response: ${JSON.stringify(resp)}`)
                setChats(resp)
                return;
            })
    }

    const getAllUsers = () => {
        fetch('http://localhost:3000/users')
            .then(resp => resp.json())
            .then((resp) => {
                console.log(`all users: ${JSON.stringify(resp)}`)
            })
    }

    useEffect(() => {
        console.log(`user id: ${userId}, chats: ${chats}`)
        getAllUsers()
        getChats()
    },[])

    return(
        <>
            <div>dis da home page gang</div>
            {/* <form>
                <select>
                    
                </select>
            </form> */}
            {/* { chats && chats.map((chat, index) => {
                return(
                    <div key={index}>{chat}</div>
                )
            })} */}
        </>
    )
}

export default Home;
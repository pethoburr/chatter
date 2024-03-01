import '../App.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';

const Home = () => {
    const [chats, setChats] = useState([])
    const { userId } = useContext(UserContext)
    
    const getChats = async () => {
        await fetch(`http://localhost:3000/rooms/${userId}`)
            .then((resp) => {
                return resp.json();
            })
            .then((resp) => {
                console.log(`room response: ${JSON.stringify(resp)}`)
                setChats(resp)
                return;
            })
    }

    useEffect(() => {
        getChats()
    },[])

    return(
        <>
            <div>dis da home page gang</div>
            { chats && chats.map((chat, index) => {
                return(
                    <div key={index}>{chat}</div>
                )
            })}
        </>
    )
}

export default Home;
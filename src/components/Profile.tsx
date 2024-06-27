import { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../App';

import Nav from './Nav'

const Profile = () => {
    const { userId } = useParams()
    const { token } = useContext(UserContext)
    const [userObj, setUserObj] = useState({
        first_name: '',
        last_name: '',
        username: ''
    })

    useEffect(() => {
        console.log(`user id in profile: ${userId}`)

        const fetchData = async() => {
            const data = await fetch(`http://localhost:3000/profile/${userId}`, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}})
            const jayed = await data.json()
            console.log('jayed data:' + JSON.stringify(jayed))
            const { first_name, last_name, username } = jayed
            setUserObj({ first_name, last_name, username})
        }
        fetchData()
    },[])
    
    return(
        <>
            <div className="profileContianer">
                <Nav />
                <div className='profilePage'>
                    <ul className='profileInfo'>
                        <li className='infoItem'>First name: {userObj.first_name}</li>
                        <li className='infoItem'>Last name: {userObj.last_name}</li>
                        <li className='infoItem'>Username: {userObj.username}</li>
                    </ul>
                </div>

            </div>
        </>
    )
}

export default Profile
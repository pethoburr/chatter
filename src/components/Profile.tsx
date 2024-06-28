import { useEffect, useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../App';

import Nav from './Nav'

// C:\Users\mpaha\.fly\bin\flyctl.exe 

const Profile = () => {
    const { userId } = useParams()
    const { token } = useContext(UserContext)
    const navigator = useNavigate()
    const [userObj, setUserObj] = useState({
        first_name: '',
        last_name: '',
        username: ''
    })

    useEffect(() => {
        console.log(`user id in profile: ${userId}`)

        const fetchData = async() => {
            const data = await fetch(`https://chat-app-patient-hill-6075.fly.dev/profile/${userId}`, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}})
            const jayed = await data.json()
            console.log('jayed data:' + JSON.stringify(jayed))
            const { first_name, last_name, username } = jayed
            setUserObj({ first_name, last_name, username})
        }
        fetchData()
    },[])

    const goBack = () => {
        navigator(-1)
    }
    
    return(
        <>
            <div className="profileContai ner">
                <Nav />
                <button className='backButton' onClick={goBack}>back</button>
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
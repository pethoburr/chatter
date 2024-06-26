import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Nav from './Nav'

const Profile = () => {
    const { userId } = useParams()

    useEffect(() => {
        console.log(`user id in profile: ${userId}`)
    })
    return(
        <>
            <Nav />
            <p>Profile page</p>
        </>
    )
}

export default Profile
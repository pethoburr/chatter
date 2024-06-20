import { useEffect } from 'react'
import { useParams } from 'react-router-dom'


const Profile = () => {
    const { userId } = useParams()

    useEffect(() => {
        console.log(`user id in profile: ${userId}`)
    })
    return(
        <>
            <p>Profile page</p>
        </>
    )
}

export default Profile
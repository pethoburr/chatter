import '../App.css';
import { useContext, } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { logout } = useContext(UserContext)
    const navigator = useNavigate()

    const logOut = () => {
        logout()
        navigator('/log-in')
    }

    return(
        <>
            <div>Settings page</div>
            <button className='logout' onClick={() => logOut()}>Log out</button>
        </>
    )
}

export default Settings
import '../App.css';
import { useContext, } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const Settings = () => {
    const { logout } = useContext(UserContext)
    const navigator = useNavigate()

    const logOut = () => {
        logout()
        navigator('/log-in')
    }

    const goBack = () => {
        navigator(-1)
    }

    return(
        <>
            <div className="settingsContainer">
                <Nav />
                <button className='backButton' onClick={goBack}>back</button>
                <div className="settingsContent">
                    <button className='logout' onClick={() => logOut()}>Log out</button>
                </div>
            </div>
        </>
    )
}

export default Settings
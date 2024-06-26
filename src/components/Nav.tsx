import '../App.css';
import { useState, useContext, } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { userId, logout } = useContext(UserContext)
    const navigator = useNavigate()

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const prof = () => {
        if (userId !== null) {
            const sender = parseInt(userId)
            navigator(`/profile/${sender}`)
        }  
    }

    const logOut = () => {
        logout()
        navigator('/log-in')
    }
    return(
        <nav className='navBar'>
                    <h1>Thiscord</h1>
                    <div className='navRight'>
                        
                        <div className='dropdown'>
                            <button onClick={toggleDropdown} className='avatar'>MP</button>
                            { isOpen && (
                                <div className='dropdown-menu'>
                                    <ul>
                                        <li onClick={prof}>Profile</li>
                                        <li>Settings</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button className='logout' onClick={() => logOut()}>Log out</button>
                    </div>
                </nav>
    )
}

export default Nav;
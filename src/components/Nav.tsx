import '../App.css';
import { useState, useContext, } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { userId } = useContext(UserContext)
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

    const goToSettings = () => {
        if (userId !== null) {
            const sender = parseInt(userId)
            navigator(`/settings/${sender}`)
        }
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
                                        <li className='navListItem' onClick={prof}>Profile</li>
                                        <li className='navListItem' onClick={goToSettings}>Settings</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
    )
}

export default Nav;
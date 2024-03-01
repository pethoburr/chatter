import '../App.css';
import { ChangeEvent, useState, FormEvent, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

interface DataObj {
    username: string,
    password: string
}
const LogIn = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(UserContext)

    const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`username: ${username}, password: ${password}`)
        const data: DataObj = { username, password }
        fetch('http://localhost:3000/log-in', {
       
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
    }).then((resp: Response) => {
        return resp.json();
    }).then((resp) => {
        console.log(`resp: ${JSON.stringify(resp)}`)
        if (resp.id) {
            localStorage.setItem('userId', resp.id)
            login(resp.id)
            navigate('/')
            return;
        }
    })
    }

    

    return(
        <>
            <form onSubmit={(e) => { handleSubmit(e)}}>
                <h1>Log In</h1>
                <label>Username:
                    <input type='text' onChange={(e) => handleUsername(e)} />
                </label>
                <label>Password:
                    <input type='text' onChange={(e) => handlePassword(e)} />
                </label>
                <button type='submit'>Log In</button>
            </form>
        </>
    )
}

export default LogIn;
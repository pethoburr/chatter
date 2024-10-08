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
    const [passErr, setPassErr] = useState(false)
    const [usernameErr, setUsernameErr] = useState(false)

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
        fetch('https://my-mysql-still-frost-808.fly.dev/log-in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
    }).then((resp: Response) => {
        return resp.json();
    }).then((resp) => {
        console.log(`resp: ${JSON.stringify(resp)}`)
        if (resp.user) {
            localStorage.setItem('userId', resp.user.id)
            localStorage.setItem('token', resp.token)
            login(resp.user.id, resp.token)
            console.log('here')
            navigate('/')
        }
        if (resp.message === 'Incorrect password') {
            setPassErr(true)
        }
        if (resp.message === 'Incorrect username') {
        setUsernameErr(true)
    }})
    }

    const navSignup = () => {
        navigate('/sign-up')
    }

    return(
        <>
            <form onSubmit={(e) => { handleSubmit(e)}}>
                <h1>Log In</h1>
                <label>Username:
                    <input type='text' onChange={(e) => handleUsername(e)} />
                </label>
                { usernameErr && <p className='userErr'>Incorrect username</p>}
                <label>Password:
                    <input type='password' onChange={(e) => handlePassword(e)} />
                </label>
                { passErr && <p className='passErr'>Incorrect password</p>}
                <button type='submit'>Log In</button>
                <p>Not a member?<button onClick={() => navSignup()}>Sign Up</button></p>
            </form>
        </>
    )
}

export default LogIn;
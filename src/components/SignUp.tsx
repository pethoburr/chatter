import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const handleFirstname = (e: ChangeEvent<HTMLInputElement>) => {
        setFirstname(e.target.value)
    }

    const handleLastname = (e: ChangeEvent<HTMLInputElement>) => {
        setLastname(e.target.value)
    }

    const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch('https://chat-app-patient-hill-6075.fly.dev/sign-up', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ first_name: first_name, last_name: last_name, username: username, password: password })
        }).then((resp: Response) => {
            return resp.json()
        }).then((resp: Response) => {
            console.log(`client response: ${JSON.stringify(resp)}`)
            navigate('/log-in')
        })
    }

    const handleLogin = () => {
        navigate('/log-in')
    }

    return(
        <>
            <h1>Sign Up</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor='first_name'>First name:
                    <input type='text' value={first_name} onChange={(e) => handleFirstname(e)} placeholder='Enter first name' />
                </label>
                <label htmlFor='last_name'>Last name:
                    <input type='text' value={last_name} onChange={(e) => handleLastname(e)} placeholder='Enter last name' />
                </label>
                <label htmlFor='username'>Username:
                    <input type='text' value={username} onChange={(e) => handleUsername(e)} placeholder='Enter Username' />
                </label>
                <label htmlFor='password'>Password:
                    <input type='text' value={password} onChange={(e) => handlePassword(e)} placeholder='Enter Password' />
                </label>
                <button type='submit'>Sign up</button>
                <p>Already a member? <button onClick={() => handleLogin()}>Log In</button></p>
            </form>
        </>
    )
}

export default SignUp;
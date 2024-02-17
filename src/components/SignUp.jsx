import { useState } from 'react';

const SignUp = () => {
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleFirstname = (e) => {
        setFirstname(e.target.value)
    }

    const handleLastname = (e) => {
        setLastname(e.target.value)
    }

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    return(
        <>
            <h1>Sign Up</h1>
            <form>
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
            </form>
        </>
    )
}

export default SignUp;
import '../App.css';
import { ChangeEvent, useState, FormEvent } from 'react';


const Home = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch('http://localhost:3000/log-in', {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({username, password})
    }).then((resp) => {
        resp.json()
        console.log(resp)
    })
    }

    

    return(
        <>
            <div>dis da home page gang</div>
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

export default Home;
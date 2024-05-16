import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home';
import { createContext, useState } from 'react';
import './App.css'
import SignUp from './components/SignUp';
import LogIn from './components/Login';

export const UserContext = createContext<{ userId: string | null, token: string | null, login: (param1: string, param2: string) => void, logout: () => void }>({
  userId: null,
  token: null,
  login: () => {},
  logout: () => {}
});


function App() {
  const saved = localStorage.getItem('userId')
  const savedToken = localStorage.getItem('token')
  const [userId, setUserId] = useState(saved ? saved : null)
  const [token, setToken] = useState(savedToken ? savedToken : null)

  const login = (id: string, coin: string) => {
    setUserId(id)
    setToken(coin)
  }

  const logout = () => {
    localStorage.clear()
    setUserId(null)
    setToken(null)
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/sign-up',
      element: <SignUp />
    },
    {
      path: '/log-in',
      element: <LogIn />
    }
  ])

  return (
    <>
      <UserContext.Provider value={{ userId, token, login, logout}}>
          <RouterProvider router={router} />
      </UserContext.Provider>
    </>
  )
}

export default App

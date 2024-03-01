import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home';
import { createContext, useState } from 'react';
import './App.css'
import SignUp from './components/SignUp';
import LogIn from './components/Login';

export const UserContext = createContext<{ userId: string | null, login: (param1: string) => void, logout: () => void }>({
  userId: null,
  login: () => {},
  logout: () => {}
});


function App() {
  const saved = localStorage.getItem('userId')
  const [userId, setUserId] = useState(saved ? saved : null)

  const login = (id: string) => {
    setUserId(id)
  }

  const logout = () => {
    localStorage.clear()
    setUserId(null)
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
      <UserContext.Provider value={{ userId, login, logout}}>
          <RouterProvider router={router} />
      </UserContext.Provider>
    </>
  )
}

export default App

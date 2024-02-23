import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home';
import { createContext } from 'react';
import './App.css'
import SignUp from './components/SignUp';
import LogIn from './components/Login';

export const AuthContext = createContext(undefined)

function App() {

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
      <AuthContext.Provider value={undefined}>
          <RouterProvider router={router} />
      </AuthContext.Provider>
    </>
  )
}

export default App

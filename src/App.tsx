import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home';
import { createContext } from 'react';
import './App.css'

export const AuthContext = createContext(undefined)

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
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

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import Home from './pages/home'
import Login from './login'
import Signup from './pages/signup'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext';

const router = createBrowserRouter([
  {path: "/", element: <Home />},
  {path: "/login", element: <Login />},
  {path: "/signup", element: <Signup />}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <AuthContextProvider>
        <RouterProvider router = {router}/>
      </AuthContextProvider>
    </>
  </StrictMode>,
)

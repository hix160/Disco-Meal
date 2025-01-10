import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import './index.css'

import AboutPage from './pages/AboutPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import SignInSignUpPage from './pages/SignInSignUpPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import App from './App.jsx'



const router = createBrowserRouter([
  {
    path:"/",
    element: <LandingPage/>,
  },
  {
    path:"about",
    element:<AboutPage/>,
  },
  {
    path:"products",
    element:<App/>,
  },
  {
    path:"dashboard",
    element:<DashboardPage/>,
  },
  {
    path:"sign-in",
    element:<SignInSignUpPage/>,
  }

])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

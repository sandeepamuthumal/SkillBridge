import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/public/HomePage.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import SignInPage from './pages/auth/SignInPage.jsx'
import SignUpPage from './pages/auth/SignUpPage.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import SeekerDashboard from './pages/seeker/dashboard/SeekerDashboard.jsx'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      }
    ]
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/seeker/dashboard',
        element: <SeekerDashboard />
      },
    ]
  },
  {
    path : '/sign-in',
    element : <SignInPage />
  },
  {
    path : '/sign-up',
    element : <SignUpPage />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <RouterProvider router={router} />
  </StrictMode>,
)

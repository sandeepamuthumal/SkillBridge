import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

import HomePage from './pages/public/HomePage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import Companies from './pages/public/Companies.jsx';
import ProfessionalsPage from './pages/public/ProfessionalsPage';
import MainLayout from './layouts/MainLayout.jsx';
import SignInPage from './pages/auth/SignInPage.jsx';
import SignUpPage from './pages/auth/SignUpPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import SeekerDashboard from './pages/seeker/dashboard/SeekerDashboard.jsx';
import JobsPage from './pages/public/JobsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'companies',
        element: <Companies />
      },
      {
        path: 'jobs',
        element: <JobsPage />
      },
      {
        path: 'professionals',
        element: <ProfessionalsPage />
      }
    ]
  },
  {
    path: '/seeker',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <SeekerDashboard />
      }
    ]
  },
  {
    path: '/sign-in',
    element: <SignInPage />
  },
  {
    path: '/sign-up',
    element: <SignUpPage />
  },
  {
    path: '*',
    element: <div className="p-10 text-center text-2xl text-red-600">404 - Page Not Found</div>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

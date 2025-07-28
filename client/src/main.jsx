// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import MainLayout from "./layouts/MainLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// Route Protection Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute.jsx";

// Public Pages
import HomePage from "./pages/public/HomePage.jsx";
import AboutPage from "./pages/public/AboutPage.jsx";
import Companies from "./pages/public/Companies.jsx";
import JobsPage from "./pages/public/JobsPage.jsx";
import ProfessionalsPage from "./pages/public/ProfessionalsPage.jsx";
import SeekerProfilePage from "./pages/public/SeekerProfilePage.jsx"; // <-- Import the new public seeker profile page


// Auth Pages
import SignIn from "./pages/auth/SignIn.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import EmailVerification from "./pages/auth/EmailVerification.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

// Jobseeker Pages
import SeekerDashboard from "./pages/seeker/dashboard/SeekerDashboard.jsx";
import SeekerProfile from "./pages/seeker/profile/SeekerProfile"; // This is the user's *own* profile for editing, etc.


// Employer Pages
import EmployerDashboard from "./pages/employer/dashboard/employerDashboard";


// Admin Pages
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";


// Error Pages
import Unauthorized from "./pages/errors/Unauthorized.jsx";
import NotFound from "./pages/errors/NotFound.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

const router = createBrowserRouter([
  // Public Routes with MainLayout
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "companies",
        element: <Companies />,
      },
      {
        path: "jobs",
        element: <JobsPage />,
      },
      {
        path: "professionals",
        element: <ProfessionalsPage />,
      },
      // ADD THE NEW ROUTE FOR THE PUBLIC SEEKER PROFILE HERE
      {
        path: "seeker-profile/:seekerId",
        element: <SeekerProfilePage />,
      },
    ],
  },
  
  // ... (the rest of your routes remain the same)
  
  // Authentication Routes (Public - only for non-authenticated users)
  {
    path: "/auth",
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "signin",
        element: (
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },
      {
        path: "reset-password/:token",
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        ),
      },
      {
        path: "email-verification",
        element: <EmailVerification />,
      },
      {
        path: "verify-email",
        element: <EmailVerification />,
      },
    ],
  },
  
  // Legacy auth routes (for backward compatibility)
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  
  // Jobseeker Protected Routes
  {
    path: "/jobseeker",
    element: (
      <ProtectedRoute requiredRole="Job Seeker">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "dashboard",
        element: <SeekerDashboard />,
      },
      {
        path: "profile",
        element: <SeekerProfile />,
      },
    ],
  },
  
  // Employer Protected Routes
  {
    path: "/employer",
    element: (
      <ProtectedRoute requiredRole="Employer">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "dashboard",
        element: <EmployerDashboard />,
      },
    ],
  },
  
  
  // Admin Protected Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="Admin">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
  
  // Error Routes
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16" // Add margin-top to avoid navbar overlap
      />
    </AuthProvider>
  </StrictMode>
);
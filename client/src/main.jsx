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
import JobDetailPage from "./pages/public/JobDetailPage";
import SeekerProfilePage from "./pages/public/SeekerProfilePage.jsx"; // <-- Import the new public seeker profile page

// Auth Pages
import SignIn from "./pages/auth/SignIn.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import EmailVerification from "./pages/auth/EmailVerification.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

// Jobseeker Pages
import SeekerDashboard from "./pages/seeker/dashboard/SeekerDashboard.jsx";
import SeekerProfile from "./pages/seeker/profile/SeekerProfile";
import AllJobs from "./pages/seeker/jobs/AllJobs";
import SavedJobs from "./pages/seeker/jobs/SavedJobs";
import RecommendedJobs from "./pages/seeker/jobs/RecommendedJobs";
import Settings from "./pages/seeker/settings/Settings";

// Employer Pages
import PostJob from "./pages/employer/job/PostJob.jsx";
import ManageJob from "./pages/employer/job/ManageJob.jsx";
import ProfileManagementPage from "./pages/employer/profile/ProfileManagementPage.jsx";

// Admin Pages
import UserManagementPage from "./pages/admin/users/UserManagementPage.jsx";
import JobManagementPage from "./pages/admin/jobs/JobManagementPage.jsx";
import AdminJobPostDetailsPage from "./pages/admin/jobs/AdminJobPostDetailsPage.jsx";
import JobSeekerManagementPage from "./pages/admin/users/JobSeekerManagementPage.jsx";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import JobDetail from "./pages/seeker/jobs/JobDetail";
import ApplicationsPage from "./pages/seeker/applications/ApplicationsPage";
import AdminManagementPage from "./pages/admin/users/AdminManagementPage.jsx";
import EmployerManagementPage from "./pages/admin/users/EmployerManagementPage.jsx";
import JobAnalyticsPage from "./pages/admin/reports/JobAnalyticsPage.jsx";
import ApplicationReportPage from "./pages/admin/reports/ApplicationReportPage.jsx";


// Error Pages
import Unauthorized from "./pages/errors/Unauthorized.jsx";
import NotFound from "./pages/errors/NotFound.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import EmployerDashboard from "./pages/employer/dashboard/employerDashboard";
import FeedbackPage from "./pages/seeker/feedbacks/FeedbackPage";
import CompanyDetailPage from "./pages/public/CompanyDetailPage";
import EmployerApplications from "./pages/employer/applications/EmployerApplications";
import CandidateFeedback from "./pages/employer/feedbacks/CandidateFeedback";
import EditJobPost from "./pages/employer/job/EditJobPost";
import JobPostView from "./pages/employer/job/JobPostView";
import SeekerSuggestion from "./pages/employer/job/SeekerSuggestion";

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
        path: "jobs/:jobId",
        element: <JobDetailPage />,
      },
      {
        path: "companies/:employerId",
        element: <CompanyDetailPage />,
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
      {
        path: "jobs",
        element: <AllJobs />,
      },
      {
        path: "jobs/:jobId",
        element: <JobDetail />,
      },
      {
        path: "jobs/recommended",
        element: <RecommendedJobs />,
      },
      {
        path: "jobs/saved",
        element: <SavedJobs />,
      },
      {
        path: "applications",
        element: <ApplicationsPage />,
      },
      {
        path: "feedbacks",
        element: <FeedbackPage />,
      },
      {
        path: "settings",
        element: <Settings />,
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
      {
        path: "jobs/create",
        element: <PostJob />,
      },
      {
        path: "applications",
        element: <EmployerApplications />,
      },
      {
        path: "candidate-feedbacks",
        element: <CandidateFeedback />,
      },
      {
        path: "profile",
        element: <ProfileManagementPage />,
      },
      {
        path: "jobs",
        element: <ManageJob />
      },
      {
        path: "jobs/edit/:id",
        element: <EditJobPost />
      },
      {
        path: "jobs/view/:id",
        element: <JobPostView />
      },
      {
        path: "jobs/seekers/suggestions/:id",
        element: <SeekerSuggestion />
      }
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
      {
        path: "users",
        element: <UserManagementPage />,
      },
      {
        path: "admins",
        element: <AdminManagementPage />,
      },
      {
        path: "users/seekers",
        element: <JobSeekerManagementPage />,
      },
      {
        path: "users/employers",
        element: <EmployerManagementPage />,
      },
      {
        path: "jobs",
        children: [
          {
            index: true,
            element: <JobManagementPage />,
          },
          {
            path: "pending",
            element: <JobManagementPage defaultFilter="pending" />,
          },
          {
            path: ":id",
            element: <AdminJobPostDetailsPage />,
          },
        ],
      },
      {
        path: "reports",
        children: [
          {
            path: "jobs",
            element: <JobAnalyticsPage />,
          },
          {
            path: "applications",
            element: <ApplicationReportPage />, 
          },
        ],
      }
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

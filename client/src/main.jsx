import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/public/HomePage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import SignIn from "./pages/auth/SignIn.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import SeekerDashboard from "./pages/seeker/dashboard/SeekerDashboard.jsx";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/seeker/dashboard",
        element: <SeekerDashboard />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);

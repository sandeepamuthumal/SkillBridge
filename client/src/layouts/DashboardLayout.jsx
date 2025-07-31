import React, { useEffect, useRef, useState } from "react";
import {
  Settings,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Menu,
  RefreshCw,
} from "lucide-react";
// Import shadcn/ui components

import { Link, Outlet, useNavigate } from "react-router-dom";
import AppSidebar from "@/components/dashboard/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Footer from "@/components/dashboard/Footer";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

function DashboardLayout() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const userRole = user?.role;
  const userInfo = user || {};
  const dropdownRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  const handleRefreshData = async () => {
    setLoading(true);
    location.reload();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getUserDisplayName = () => {
    return (
      userInfo.firstName ||
      userInfo.name ||
      userInfo.email?.split("@")[0] ||
      "User"
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} userInfo={userInfo} />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-surface bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 justify-between ">
          <div className="flex items-center space-x-3">
            {/* Mock SidebarTrigger - Replace with actual */}
            <SidebarTrigger className="-ml-1 text-secondary-600 hover:text-primary-600" />
            <div>
              <h1 className="text-lg font-semibold">
                {getGreeting()}, {getUserDisplayName()}! 👋{" "}
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Bridge Your Skills to Your Dream Career
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefreshData}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            {/* Notifications */}
            {/* <button className="relative p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button> */}

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
              >
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-primary-600" />
                </div>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border z-50">
                  <div className="py-2">
                    <a
                      href="javascript:void(0)"
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;

import React, { useState, useRef, useEffect } from 'react';
import { Users, Briefcase, Home, User, LogOut, Settings, ChevronDown, Building2, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRouteHelper } from '../../hooks/useRouteHelper';
import logo2 from '../../assets/logo2.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { getDashboardRoute, getProfileRoute } = useRouteHelper();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location for active states

  // Navigation items configuration
  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/companies', label: 'Companies', icon: Building2 },
    { path: '/professionals', label: 'Professionals', icon: Users },
    { path: '/about', label: 'About', icon: Info }
  ];

  // Helper function to check if a link is active
  const isLinkActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Get active link classes
  const getLinkClasses = (path, isMobile = false) => {
    const baseClasses = isMobile
      ? 'block px-3 py-2 rounded-md text-base font-medium transition-colors'
      : 'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors';

    const activeClasses = 'text-blue-600 bg-blue-50 border-b-2 border-blue-600';
    const inactiveClasses = 'text-gray-700 hover:text-blue-600 hover:bg-gray-50';

    return `${baseClasses} ${isLinkActive(path) ? activeClasses : inactiveClasses}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getAvatarText = () => {
    if (!user) return 'U';
    return user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
  };

  const UserAvatar = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {getAvatarText()}
        </div>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
              {user?.role}
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to={getDashboardRoute()}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to={getProfileRoute()}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Profile Settings
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo2} alt="SkillBridge Logo" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClasses(item.path)}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Auth dependent */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            ) : isAuthenticated ? (
              <UserAvatar />
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost" className="text-gray-700">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`h-0.5 bg-gray-600 transition-all ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
              <div className={`h-0.5 bg-gray-600 transition-all ${isOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-gray-600 transition-all ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClasses(item.path, true)}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 py-2 px-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getAvatarText()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                    </div>
                    <Link
                      to={getDashboardRoute()}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={getProfileRoute()}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left w-full"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <a href="/signin" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="text-gray-700 justify-start w-full">
                        Sign In
                      </Button>
                    </a>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 justify-start w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
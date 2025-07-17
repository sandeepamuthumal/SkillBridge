// pages/Unauthorized.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft, ImageOff } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { useRouteHelper } from "@/hooks/useRouteHelper";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDashboardRoute } = useRouteHelper();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldX className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page. This page is restricted to certain user roles.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          {user ? (
            <Link to={getDashboardRoute()}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/signin">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Sign In
              </Button>
            </Link>
          )}
          
          <Link to="/">
            <Button variant="ghost" className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
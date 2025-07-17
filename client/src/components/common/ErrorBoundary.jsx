// components/ErrorBoundary.jsx
import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';


const ErrorBoundary = () => {
  const error = useRouteError();
  
  console.error('Route Error:', error);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {error?.status === 404 ? 'Page Not Found' : 'Something went wrong'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error?.status === 404 
              ? "The page you're looking for doesn't exist or has been moved."
              : "We're sorry, but something unexpected happened. Please try again."}
          </p>
          {error?.statusText && (
            <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
              {error.statusText}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Link to="/">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
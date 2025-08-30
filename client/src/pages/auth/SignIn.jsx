import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AlertCircle } from "lucide-react";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import Header from "./components/signin/Header";
import SignInForm from "./components/signin/SignInForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouteHelper } from "@/hooks/useRouteHelper";

const SignIn = () => {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signin, error, clearError } = useAuth();
  const { navigateDashboard } = useRouteHelper();

  
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    const userData = {
      email: form.email,
      password: form.password,
    };

    try {
      const result = await signin(userData);
      
      if (result.success) {
        // Use your route helper logic or direct navigation
        navigateDashboard(result.user.role);
        return;
      } else {
        console.error("Sign-in error:", result.error);
        toast.error(result.error || "Failed to sign in. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <Header />

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600 text-base">
              Sign in to your account to continue
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <SignInForm
              primaryColor="blue"
              onSignIn={handleSignIn}
              onForgotPassword={handleForgotPassword}
              handleChange={handleChange}
              form={form}
              loading={loading}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  New to SkillBridge?
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <Link to="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <span>•</span>
            <Link to="/help" className="hover:text-blue-600 transition-colors">
              Help
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default SignIn;
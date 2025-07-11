import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import Header from "./components/signin/Header";
import SignInForm from "./components/signin/SignInForm";
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
  const [activeRole, setActiveRole] = useState("jobseeker");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signin, error, clearError } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleGoogleSignIn = () => {
    console.log(`Google sign in for ${activeRole}`);
    // Implement Google OAuth logic here
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    const userData = {
      email: form.email,
      password: form.password,
      role: activeRole,
    };

    const result = await signin(userData);
    setLoading(false);

    if (result.success) {
      // Redirect to the appropriate dashboard based on role
      if (activeRole === "jobseeker") {
        window.location.href = "/jobseeker/dashboard";
      } else {
        window.location.href = "/employer/dashboard";
      }
    }
    else{
      alert(result.message);
    }
  }


  const handleForgotPassword = () => {
    setIsForgotPasswordOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Header />

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-lg">Choose Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger
                  value="jobseeker"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Job Seeker
                </TabsTrigger>
                <TabsTrigger
                  value="employer"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Employer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobseeker" className="space-y-4">
                <SignInForm
                  role="jobseeker"
                  title="Job Seeker Sign In"
                  subtitle="Find your dream internship or entry-level position"
                  primaryColor="blue"
                  onGoogleSignIn={handleGoogleSignIn}
                  onEmailSignIn={handleEmailSignIn}
                  onForgotPassword={handleForgotPassword}
                  handleChange={handleChange}
                  form={form}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="employer" className="space-y-4">
                <SignInForm
                  role="employer"
                  title="Employer Sign In"
                  subtitle="Connect with talented undergraduates"
                  primaryColor="purple"
                  onGoogleSignIn={handleGoogleSignIn}
                  onEmailSignIn={handleEmailSignIn}
                  onForgotPassword={handleForgotPassword}
                  handleChange={handleChange}
                  form={form}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};

export default SignIn;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpHeader from "./components/signup/SignUpHeader";
import SignUpForm from "./components/signup/SignUpForm";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const SignUp = () => {
  const [activeRole, setActiveRole] = useState("jobseeker");
  const [loading, setLoading] = useState(false);
  const { signup, error, clearError } = useAuth();
  const navigate = useNavigate();
  

  const handleSubmit = async (formData, userType) => {
    setLoading(true);
    clearError();
    
    try {
      // Show loading toast
      const loadingToastId = toast.loading('Creating your account...');

      // Map form data to API format
      const userData = {
        role: userType === 'jobseeker' ? 'Job Seeker' : 'Employer',
        termsAccepted: true,
        privacyPolicyAccepted: true,
        ...formData
      };

      // For job seekers, map the email field
      if (userType === 'jobseeker') {
        userData.email = formData.email;
      } else {
        // For employers, map businessEmail to email
        userData.email = formData.businessEmail;
        delete userData.businessEmail; // Remove the original field
      }

      console.log("userData = " , userData);
      const result = await signup(userData, userType);
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      console.log("result = " , result);

      if (result.success) {
        toast.success('Account created successfully! Please check your email to verify your account.');
        navigate('/auth/email-verification', { 
          state: { 
            email: userData.email,
            userType: userType 
          }
        });
      } else {
        toast.error(result.error || 'Failed to create account. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUpHeader />

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
                <SignUpForm
                  role="jobseeker"
                  title="Student Registration"
                  subtitle="Start your career journey today"
                  primaryColor="blue"
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="employer" className="space-y-4">
                <SignUpForm
                  role="employer"
                  title="Employer Registration"
                  subtitle="Find the best student talent"
                  primaryColor="purple"
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpHeader from "./components/signup/SignUpHeader";
import SignUpForm from "./components/signup/SignUpForm";
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
  const [activeRole, setActiveRole] = useState("jobseeker");
  const [loading, setLoading] = useState(false);
  const { signup, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',   
    lastName: '', 
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    fieldOfStudy: '',
    companyName: '',
    contactName: '',
    companySize: '',
    industry: '',
  });

  const handleGoogleSignUp = () => {
    console.log(`Google sign up for ${activeRole}`);
    // Implement Google OAuth logic here
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    console.log("Sign up data:", form);

    // Basic validation
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    // Prepare user data based on role
    const userData = {
      email: form.email,
      password: form.password,
      role: activeRole,
    };

    if (activeRole === "jobseeker") {
      userData.firstName = form.firstName;
      userData.lastName = form.lastName;
      userData.university = form.university;
      userData.fieldOfStudy = form.fieldOfStudy;
    } else {
      userData.companyName = form.companyName;
      userData.contactName = form.contactName;
      userData.companySize = form.companySize;
      userData.industry = form.industry;
    }

    const result = await signup(userData);
    setLoading(false);

    if (result.success) {
      navigate("/signin");
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
                  title="Job Seeker Registration"
                  subtitle="Start your career journey today"
                  primaryColor="blue"
                  onGoogleSignUp={handleGoogleSignUp}
                  onEmailSignUp={handleEmailSignUp}
                  handleChange={handleChange}
                  form={form}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="employer" className="space-y-4">
                <SignUpForm
                  role="employer"
                  title="Employer Registration"
                  subtitle="Find the best talent for your company"
                  primaryColor="purple"
                  onGoogleSignUp={handleGoogleSignUp}
                  onEmailSignUp={handleEmailSignUp}
                  handleChange={handleChange}
                  form={form}
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

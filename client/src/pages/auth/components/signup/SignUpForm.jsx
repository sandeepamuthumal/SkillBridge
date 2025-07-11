import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GoogleButton from "../GoogleButton";
import JobSeekerFields from "./JobSeekerFields";
import EmployerFields from "./EmployerFields";

const SignUpForm = ({ 
  role, 
  title, 
  subtitle, 
  primaryColor, 
  onGoogleSignUp, 
  onEmailSignUp,
  handleChange,
  form,
  loading,
}) => {
  const colorClasses = {
    blue: {
      title: "text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700",
      link: "text-blue-600"
    },
    purple: {
      title: "text-purple-800",
      button: "bg-purple-600 hover:bg-purple-700",
      link: "text-purple-600"
    }
  };

  const colors = colorClasses[primaryColor];

   //handle loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-4">
        <h3 className={`font-semibold ${colors.title}`}>{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      
      <GoogleButton onClick={onGoogleSignUp} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <form onSubmit={onEmailSignUp} className="space-y-4">
        {role === "jobseeker" ? (
          <JobSeekerFields primaryColor={primaryColor} handleChange={handleChange} form={form}/>
        ) : (
          <EmployerFields primaryColor={primaryColor} handleChange={handleChange} form={form}/>
        )}
        
        <Button type="submit" className={`w-full ${colors.button} h-11`}>
          Create Account
        </Button>
      </form>
    </>
  );
};

export default SignUpForm;
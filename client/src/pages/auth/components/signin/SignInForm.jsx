import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import GoogleButton from "../GoogleButton";

const SignInForm = ({ 
  role, 
  title, 
  subtitle, 
  primaryColor, 
  onGoogleSignIn, 
  onEmailSignIn, 
  onForgotPassword,
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
      
      <GoogleButton onClick={onGoogleSignIn} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <form onSubmit={onEmailSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${role}-email`}>Email</Label>
          <Input
            id={`${role}-email`}
            name="email"
            onChange={handleChange}
            value={form.email}
            type="email"
            placeholder={role === "employer" ? "Enter your company email" : "Enter your email"}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${role}-password`}>Password</Label>
          <Input
            id={`${role}-password`}
            name="password"
            onChange={handleChange}
            value={form.password}
            type="password"
            placeholder="Enter your password"
            required
            className="h-11"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="rounded" />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className={`text-sm ${colors.link} hover:underline`}
          >
            Forgot password?
          </button>
        </div>
        <Button type="submit" className={`w-full ${colors.button} h-11`}>
          Sign In
        </Button>
      </form>
    </>
  );
};

export default SignInForm;
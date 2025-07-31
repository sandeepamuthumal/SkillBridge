import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import JobSeekerFields from "./JobSeekerFields";
import EmployerFields from "./EmployerFields";
import { jobSeekerSchema, employerSchema } from "@/lib/validations/authValidation";

const SignUpForm = ({ 
  role, 
  title, 
  subtitle, 
  primaryColor,
  onSubmit,
  loading,
}) => {
  const colorClasses = {
    blue: {
      title: "text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    purple: {
      title: "text-purple-800",
      button: "bg-purple-600 hover:bg-purple-700",
    }
  };

  const colors = colorClasses[primaryColor];

  // Choose validation schema based on role
  const validationSchema = role === "jobseeker" ? jobSeekerSchema : employerSchema;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: zodResolver(validationSchema),
    mode: 'onChange', // Validate on change for better UX
    defaultValues: role === "jobseeker" ? {
      firstName: '',
      lastName: '',
      email: '',
      university: '',
      fieldOfStudy: '',
      password: '',
      confirmPassword: ''
    } : {
      companyName: '',
      contactPersonName: '',
      businessEmail: '',
      companySize: '',
      industry: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Watch password for real-time confirmation validation
  const watchPassword = watch('password');

  const onFormSubmit = async (data) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...submitData } = data;
    await onSubmit(submitData, role);
  };

  return (
    <>
      <div className="text-center mb-4">
        <h3 className={`font-semibold ${colors.title}`}>{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
        {/* <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            {role === "jobseeker" 
              ? "✉️ Use your university email address for verification"
              : "🏢 Use your business email address for verification"
            }
          </p>
        </div> */}
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {role === "jobseeker" ? (
          <JobSeekerFields 
            control={control} 
            errors={errors} 
            primaryColor={primaryColor}
            watchPassword={watchPassword}
          />
        ) : (
          <EmployerFields 
            control={control} 
            errors={errors} 
            primaryColor={primaryColor}
            watchPassword={watchPassword}
          />
        )}
        
        <Button 
          type="submit" 
          className={`w-full ${colors.button} h-11`}
          disabled={loading || !isValid}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Creating Account...
            </>
          ) : (
            `Create ${role === "jobseeker" ? "Student" : "Employer"} Account`
          )}
        </Button>
      </form>
    </>
  );
};

export default SignUpForm;
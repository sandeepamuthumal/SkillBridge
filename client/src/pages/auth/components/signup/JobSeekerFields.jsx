import { Link } from "react-router-dom";
import { Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PasswordInput from "@/components/ui/PasswordInput";

const JobSeekerFields = ({ control, errors, primaryColor }) => {
  const colorClasses = {
    blue: { link: "text-blue-600" },
    purple: { link: "text-purple-600" }
  };

  const colors = colorClasses[primaryColor];

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="firstName"
                placeholder="John"
                className={`h-11 ${errors.firstName ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="lastName"
                placeholder="Doe"
                className={`h-11 ${errors.lastName ? 'border-red-500' : ''}`}
              />
            )}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">University Email *</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder="john@uoc.lk"
              className={`h-11 ${errors.email ? 'border-red-500' : ''}`}
            />
          )}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
        {/* <p className="text-xs text-gray-500">
          Use your official university email address
        </p> */}
      </div>

      <div className="space-y-2">
        <Label htmlFor="university">University *</Label>
        <Controller
          name="university"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className={`h-11 ${errors.university ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select your university" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="University of Sri Jayewardenepura">University of Sri Jayewardenepura</SelectItem>
                <SelectItem value="University of Colombo">University of Colombo</SelectItem>
                <SelectItem value="University of Moratuwa">University of Moratuwa</SelectItem>
                <SelectItem value="University of Peradeniya">University of Peradeniya</SelectItem>
                <SelectItem value="University of Kelaniya">University of Kelaniya</SelectItem>
                <SelectItem value="University of Ruhuna">University of Ruhuna</SelectItem>
                <SelectItem value="Sabaragamuwa University">Sabaragamuwa University</SelectItem>
                <SelectItem value="NSBM Green University">NSBM Green University</SelectItem>
                <SelectItem value="SLIIT">Sri Lanka Institute of Information Technology</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.university && (
          <p className="text-sm text-red-500">{errors.university.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fieldOfStudy">Field of Study *</Label>
        <Controller
          name="fieldOfStudy"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="fieldOfStudy"
              placeholder="Computer Science"
              className={`h-11 ${errors.fieldOfStudy ? 'border-red-500' : ''}`}
            />
          )}
        />
        {errors.fieldOfStudy && (
          <p className="text-sm text-red-500">{errors.fieldOfStudy.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
            {...field}
              id="password"
              name="password"
              placeholder="Create a strong password"
              className={`h-11 ${errors.password ? 'border-red-500' : ''}`}
              required
            />
          )}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Must contain uppercase, lowercase, number and special character
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <PasswordInput
              {...field}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              className={`h-11 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              required
            />
          )}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <input 
          type="checkbox" 
          className="mt-1 rounded" 
          required 
          id="terms-jobseeker"
        />
        <Label htmlFor="terms-jobseeker" className="text-sm text-gray-600 cursor-pointer">
          I agree to the{" "}
          <a href="/terms" className={`${colors.link} hover:underline`} target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className={`${colors.link} hover:underline`} target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </Label>
      </div>
    </>
  );
};

export default JobSeekerFields;
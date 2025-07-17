// components/auth/signup/EmployerFields.js
import { Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PasswordInput from '@/components/ui/PasswordInput';

const EmployerFields = ({ control, errors, primaryColor }) => {
  const colorClasses = {
    blue: { link: "text-blue-600" },
    purple: { link: "text-purple-600" }
  };

  const colors = colorClasses[primaryColor];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name *</Label>
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="companyName"
              placeholder="SkillBridge Tech Solutions"
              className={`h-11 ${errors.companyName ? 'border-red-500' : ''}`}
            />
          )}
        />
        {errors.companyName && (
          <p className="text-sm text-red-500">{errors.companyName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPersonName">Contact Person Name *</Label>
        <Controller
          name="contactPersonName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="contactPersonName"
              placeholder="Jane Smith"
              className={`h-11 ${errors.contactPersonName ? 'border-red-500' : ''}`}
            />
          )}
        />
        {errors.contactPersonName && (
          <p className="text-sm text-red-500">{errors.contactPersonName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessEmail">Business Email *</Label>
        <Controller
          name="businessEmail"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="businessEmail"
              type="email"
              placeholder="jane@company.com"
              className={`h-11 ${errors.businessEmail ? 'border-red-500' : ''}`}
            />
          )}
        />
        {errors.businessEmail && (
          <p className="text-sm text-red-500">{errors.businessEmail.message}</p>
        )}
        {/* <p className="text-xs text-gray-500">
          Use your company email address (not Gmail, Yahoo, etc.)
        </p> */}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companySize">Company Size *</Label>
          <Controller
            name="companySize"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={`h-11 ${errors.companySize ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                  <SelectItem value="small">Small (11-50 employees)</SelectItem>
                  <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                  <SelectItem value="large">Large (200+ employees)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.companySize && (
            <p className="text-sm text-red-500">{errors.companySize.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={`h-11 ${errors.industry ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="software">Software Development</SelectItem>
                  <SelectItem value="finance">Finance & Banking</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.industry && (
            <p className="text-sm text-red-500">{errors.industry.message}</p>
          )}
        </div>
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
              placeholder="Create a strong password"
              className={`h-11 ${errors.password ? 'border-red-500' : ''}`}
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
              placeholder="Confirm your password"
              className={`h-11 ${errors.confirmPassword ? 'border-red-500' : ''}`}
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
          id="terms-employer"
        />
        <Label htmlFor="terms-employer" className="text-sm text-gray-600 cursor-pointer">
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

export default EmployerFields;
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EmployerFields = ({ primaryColor, handleChange, form }) => {
  const colorClasses = {
    blue: { link: "text-blue-600" },
    purple: { link: "text-purple-600" }
  };

  const colors = colorClasses[primaryColor];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          onChange={handleChange}
          value={form.companyName}
          placeholder="Your Company Ltd."
          required
          className="h-11"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactName">Contact Person Name</Label>
        <Input
          id="contactName"
          name="contactName"
          onChange={handleChange}
          value={form.contactName}
          placeholder="Jane Smith"
          required
          className="h-11"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="businessEmail">Business Email</Label>
        <Input
          id="businessEmail"
          name="businessEmail"
          onChange={handleChange}
          value={form.businessEmail}
          type="email"
          placeholder="hr@company.com"
          required
          className="h-11"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="companySize">Company Size</Label>
        <Select 
          onChange={(value) => handleChange({ target: { name: "companySize", value } })}
          value={form.companySize}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
            <SelectItem value="small">Small (11-50 employees)</SelectItem>
            <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
            <SelectItem value="large">Large (200+ employees)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select
          onChange={(value) => handleChange({ target: { name: "industry", value } })}
          value={form.industry}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="employerPassword">Password</Label>
        <Input
          id="employerPassword"
          name="password"
          onChange={handleChange}
          value={form.password}
          type="password"
          placeholder="Create a strong password"
          required
          className="h-11"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="employerConfirmPassword">Confirm Password</Label>
        <Input
          id="employerConfirmPassword"
          name="confirmPassword"
          onChange={handleChange}
          value={form.confirmPassword}
          type="password"
          placeholder="Confirm your password"
          required
          className="h-11"
        />
      </div>
      
      <div className="flex items-start space-x-2">
        <input type="checkbox" className="mt-1 rounded" required />
        <p className="text-sm text-gray-600">
          I agree to the{" "}
          <Link to="/terms" className={`${colors.link} hover:underline`}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className={`${colors.link} hover:underline`}>
            Privacy Policy
          </Link>
        </p>
      </div>
    </>
  );
};

export default EmployerFields;
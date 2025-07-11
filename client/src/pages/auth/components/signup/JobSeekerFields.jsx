import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const JobSeekerFields = ({ primaryColor, handleChange, form }) => {
  const colorClasses = {
    blue: { link: "text-blue-600" },
    purple: { link: "text-purple-600" }
  };

  const colors = colorClasses[primaryColor];

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="John"
            onChange={handleChange}
            value={form.firstName}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            onChange={handleChange}
            value={form.lastName}
            required
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@university.edu"
          onChange={handleChange}
          value={form.email}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="university">University <span className="text-gray-500">(optional)</span></Label>
        <Select
          onValueChange={(value) => handleChange({ target: { name: "university", value } })}
          value={form.university}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select your university" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usj">University of Sri Jayewardenepura</SelectItem>
            <SelectItem value="uoc">University of Colombo</SelectItem>
            <SelectItem value="uom">University of Moratuwa</SelectItem>
            <SelectItem value="uop">University of Peradeniya</SelectItem>
            <SelectItem value="uok">University of Kelaniya</SelectItem>
            <SelectItem value="uor">University of Ruhuna</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="degree">Field of Study </Label>
        <Input
          id="degree"
          name="fieldOfStudy"
          placeholder="Computer Science"
          onChange={handleChange}
          value={form.fieldOfStudy}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          value={form.password}
          placeholder="Create a strong password"
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          onChange={handleChange}
          value={form.confirmPassword}
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

export default JobSeekerFields;
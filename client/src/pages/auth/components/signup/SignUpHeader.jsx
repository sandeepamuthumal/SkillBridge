import { Link } from "react-router-dom";
import logo2 from "@/assets/logo2.png";

const SignUpHeader = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center space-x-2 mb-8">
        <img src={logo2} alt="SkillBridge Logo" className="h-16 w-auto" />
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Join SkillBridge</h1>
      <p className="text-gray-600">Create your account to get started</p>
    </div>
  );
};

export default SignUpHeader;
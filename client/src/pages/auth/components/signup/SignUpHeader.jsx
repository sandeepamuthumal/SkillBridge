import { Link } from "react-router-dom";

const SignUpHeader = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center space-x-2 mb-8">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="font-bold text-xl text-gray-900">SkillBridge</span>
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Join SkillBridge</h1>
      <p className="text-gray-600">Create your account to get started</p>
    </div>
  );
};

export default SignUpHeader;
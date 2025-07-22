
import { Link } from "react-router-dom";
import logo2 from "@/assets/logo2.png"; // Adjust the path as necessary

const Header = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center space-x-2 mb-8">
        <img src={logo2} alt="SkillBridge Logo" className="h-20 w-auto" />
      </Link>
      
    </div>
  );
};

export default Header;
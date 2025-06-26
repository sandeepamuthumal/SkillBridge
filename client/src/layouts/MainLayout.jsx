import { Outlet } from "react-router-dom";

import Header from "../components/public/Header";
import Footer from "../components/public/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Outlet />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;

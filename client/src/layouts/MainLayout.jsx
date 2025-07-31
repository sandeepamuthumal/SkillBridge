import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import Lenis from "@studio-freight/lenis";

const MainLayout = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

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

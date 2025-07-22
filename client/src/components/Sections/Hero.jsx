import React from "react";
// Removed: import { ArrowDown, Users, Briefcase } from "lucide-react";
import { Users, Briefcase, ArrowDown } from "lucide-react"; // Keep these for your other buttons
import { Button } from "../ui/button";
import { Link } from "react-scroll"; // Import Link from react-scroll

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black opacity-50"></div>

      {/* Content container */}
      <div className="relative z-10 max-w-4xl px-6 text-center text-white">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-600/70 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></span>
          AI-Powered Job Matching for Undergraduates
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Bridge Your
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {" "}
            Skills{" "}
          </span>
          to Your Dream
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {" "}
            Career
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
          The first platform built exclusively for undergraduates and startups.
          We match based on <strong>skills and potential</strong>, not years of
          experience.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2">
            <Users className="h-5 w-5" />
            Find Opportunities
          </Button>
          <Button
            variant="outline"
            className="border-2 border-gray-300 text-white px-8 py-4 text-lg rounded-full hover:bg-gray-700 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-black"
          >
            <Briefcase className="h-5 w-5 " />
            Post Jobs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto text-gray-300">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-300 mb-2">
              AI-Powered
            </div>
            <div>Smart Matching</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-300 mb-2">100%</div>
            <div>Undergraduate Focused</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-300 mb-2">
              Sri Lanka
            </div>
            <div>Based Platform</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Modified to use react-scroll Link */}
      <Link
        to="features" // This should match the 'name' prop of the target <Element> in HomePage.jsx
        smooth={true}
        duration={750}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" // Add cursor-pointer for better UX
        aria-label="Scroll down to features"
      >
        <ArrowDown className="h-6 w-6 text-gray-300" />
      </Link>
    </section>
  );
};

export default Hero;

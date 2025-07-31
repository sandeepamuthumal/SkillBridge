import React, { useState, useEffect } from "react";
import { Users, Briefcase, ArrowDown } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import carousel1 from "../public/img/carousel-1.jpg";
import { Element, animateScroll as scroll } from 'react-scroll';

const backgroundImages = [
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80",
  carousel1, // local image
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out
      setTimeout(() => {
        // switch image after fade out
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % backgroundImages.length
        );
        setFade(true); // fade in new image
      }, 450); // 0.45 second fade out duration
    }, 8000); // every 8 seconds

    return () => clearInterval(interval);
  }, []);

   
    // Function to scroll to the bottom of the page
    const scrollToBottom = () => {
      window.scrollTo({ //
        top: document.body.scrollHeight,
        behavior: "smooth",
         // Smooth scroll animation
      });
    };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background images stacked for fade effect */}
      <img
        src={backgroundImages[currentIndex]}
        alt="Background"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Optional: preload next image hidden (to avoid flicker) */}
      <img
        src={backgroundImages[(currentIndex + 1) % backgroundImages.length]}
        alt="Background preload"
        className="hidden"
      />

      {/* Overlay layers */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black opacity-50"></div>

      {/* Content container */}
      <div className="relative z-10 max-w-4xl px-6 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-blue-600/70 px-4 py-2 rounded-full text-sm font-semibold mb-12 animate-fade-in">
          <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></span>
          AI-Powered Job Matching for Undergraduates
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-14 leading-tight">
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

        {/* <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
          The first platform built exclusively for undergraduates and startups.
          We match based on <strong>skills and potential</strong>, not years of
          experience.
        </p> */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/jobs">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              Find Opportunities
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-2 border-gray-300 text-white px-8 py-4 text-lg rounded-full hover:bg-gray-700 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-black"
          >
            <Briefcase className="h-5 w-5 " />
            <Link to="/employer/jobs/create">Post Jobs</Link>
          </Button>
        </div>

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

      <a
    
        onClick={() => scrollToBottom()}
      
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        aria-label="Scroll down to features"
      >
        <ArrowDown className="h-6 w-6 text-gray-300" />
      </a>
    </section>
  );
};

export default Hero;

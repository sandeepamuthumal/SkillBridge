import React, { useState, useEffect } from 'react';
import Navbar from "../../components/public/Header";
import Footer from "../../components/public/Footer";
import { Element, animateScroll as scroll } from 'react-scroll';
import { ArrowUp } from 'lucide-react'; // Import the ArrowUp icon

// Section components
import Hero from "../../components/sections/Hero";
import Features from "../../components/sections/Features";
import HowItWorks from "../../components/sections/HowItWorks";
import Stats from "../../components/sections/Stats";

const HomePage = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 1600, // Duration of the scroll animation in milliseconds
      smooth: true,  // Enable smooth scrolling
    });
  };

  // Effect hook to add and remove scroll event listener
  useEffect(() => {
    // Handler for the scroll event
    const handleScroll = () => {
      // Show the button if the user has scrolled down more than 300 pixels
      if (window.scrollY > 100) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    // Add the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount and cleans up on unmount

  return (
    <div>
     
      <Element name="hero">
        <Hero />
      </Element>

      <Element name="features">
        <Features />
      </Element>

      <Element name="how-it-works">
        <HowItWorks />
      </Element>

      <Element name="stats">
        <Stats />
      </Element>

      {/* Conditional rendering for the Scroll to Top button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top of the page"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

     
    </div>
  );
};

export default HomePage;
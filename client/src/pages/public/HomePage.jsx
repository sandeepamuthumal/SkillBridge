import React from 'react';
import Navbar from "../../components/public/Header";
import Footer from "../../components/public/Footer";


// Section components
import Hero from "../../components/sections/Hero";
import Features from "../../components/sections/Features";
import HowItWorks from "../../components/sections/HowItWorks";
import Stats from "../../components/sections/Stats";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      
    </div>
  );
};

export default HomePage;

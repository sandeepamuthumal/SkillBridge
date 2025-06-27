import React from "react";
import { ArrowDown, Users, Briefcase } from "lucide-react";
import { Button } from "../ui/button"; // Changed from '@/components/ui/button'

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            AI-Powered Job Matching for Undergraduates
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
            Bridge Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Skills{" "}
            </span>
            to Your Dream
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Career
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            The first platform built exclusively for undergraduates and
            startups. We match based on <strong>skills and potential</strong>,
            not years of experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Users className="mr-2 h-5 w-5" />
              Find Opportunities
            </Button>
            <Button
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 text-lg rounded-full hover:bg-gray-50 transition-all duration-300 hover:scale-105"
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Post Jobs
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                AI-Powered
              </div>
              <div className="text-gray-600">Smart Matching</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                100%
              </div>
              <div className="text-gray-600">Undergraduate Focused</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                Sri Lanka
              </div>
              <div className="text-gray-600">Based Platform</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

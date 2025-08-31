import React from 'react';
import { ArrowDown, Upload, Users, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="h-12 w-12 text-white" />,
      title: "Upload Your Resume",
      description: "Our AI analyzes your skills, projects, and academic achievements to understand your unique potential.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="h-12 w-12 text-white" />,
      title: "Get Smart Matches",
      description: "Receive personalized job and internship recommendations based on your skills and learning goals.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Check className="h-12 w-12 text-white" />,
      title: "Connect & Grow",
      description: "Apply to opportunities that value your potential and start building your career with innovative startups.",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How SkillBridge
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to connect your skills with amazing opportunities
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                {/* Step number and icon */}
                <div className="flex-shrink-0 relative">
                  <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-700 shadow-md">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>

              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="flex justify-center mb-8">
                  <ArrowDown className="h-8 w-8 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Bridge Your Future?</h3>
            <p className="text-gray-600 mb-6">Join thousands of undergraduates who are already connecting with innovative startups.</p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Link to="/signup">Get Started Now</Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
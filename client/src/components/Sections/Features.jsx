
import React from 'react';
import { Check, Users, Briefcase, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';


const Features = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Matching",
      description: "Our AI analyzes skills, academic background, and learning potential instead of relying on years of experience.",
      highlights: ["Skills-based matching", "Academic focus", "Learning potential assessment"]
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Built for Undergraduates",
      description: "Designed specifically for emerging talent, not generic job seekers. We understand what undergraduates bring to the table.",
      highlights: ["Undergraduate-focused", "Emerging talent priority", "Academic achievements valued"]
    },
    {
      icon: <Briefcase className="h-8 w-8 text-pink-600" />,
      title: "Startup Ecosystem",
      description: "Connect with innovative startups offering internships, part-time roles, and project-based opportunities.",
      highlights: ["Startup connections", "Internship opportunities", "Project-based roles"]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why SkillBridge is 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Different</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlike generic job portals, we're built from the ground up for undergraduates and startups. 
            Here's what makes us unique:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Comparison section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Traditional vs SkillBridge</h3>
            <p className="text-gray-600">See how we're revolutionizing job matching for undergraduates</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h4 className="text-xl font-bold text-red-600 mb-4">Traditional Job Portals</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-gray-700">Focus on years of experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-gray-700">Generic job titles matter most</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-gray-700">Limited internship opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span className="text-gray-700">Corporate-focused only</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <h4 className="text-xl font-bold mb-4">SkillBridge Approach</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Skills and learning potential first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Academic achievements valued</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Rich internship & project opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300 mt-1">✓</span>
                  <span>Startup ecosystem integration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
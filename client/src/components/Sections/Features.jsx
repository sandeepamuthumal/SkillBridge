import React from 'react';
import { Check, Users, Briefcase, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const Features = () => {
  const features = [
    {
      icon: <Search className="h-10 w-10 text-white" />,
      title: "AI-Powered Matching",
      description:
        "Our AI analyzes skills, academic background, and learning potential instead of relying on years of experience.",
      highlights: [
        "Skills-based matching",
        "Academic focus",
        "Learning potential assessment",
      ],
      bg: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      icon: <Users className="h-10 w-10 text-white" />,
      title: "Built for Undergraduates",
      description:
        "Designed specifically for emerging talent, not generic job seekers. We understand what undergraduates bring to the table.",
      highlights: [
        "Undergraduate-focused",
        "Emerging talent priority",
        "Academic achievements valued",
      ],
      bg: "bg-gradient-to-br from-purple-500 to-purple-700",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-white" />,
      title: "Startup Ecosystem",
      description:
        "Connect with innovative startups offering internships, part-time roles, and project-based opportunities.",
      highlights: [
        "Startup connections",
        "Internship opportunities",
        "Project-based roles",
      ],
      bg: "bg-gradient-to-br from-pink-500 to-pink-700",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Why SkillBridge is{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Different
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlike generic job portals, we're built from the ground up for
            undergraduates and startups. Here's what makes us unique:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`${feature.bg} border-0 shadow-xl hover:shadow-2xl transition-transform duration-500 hover:scale-105 rounded-3xl text-white`}
            >
              <CardContent className="p-10">
                <div className="mb-6 flex items-center justify-center rounded-full bg-white/20 w-16 h-16 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-5 text-center">
                  {feature.title}
                </h3>
                <p className="mb-8 leading-relaxed text-center">
                  {feature.description}
                </p>
                <ul className="space-y-3 max-w-sm mx-auto">
                  {feature.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Check className="h-5 w-5 text-green-300 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 md:p-16 shadow-xl max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-6">
              Traditional vs SkillBridge
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              See how we're revolutionizing job matching for undergraduates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-500">
              <h4 className="text-xl font-bold text-red-600 mb-6">
                Traditional Job Portals
              </h4>
              <ul className="space-y-4 text-gray-700 text-base">
                {[
                  "Focus on years of experience",
                  "Generic job titles matter most",
                  "Limited internship opportunities",
                  "Corporate-focused only",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-500 mt-1 text-xl">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg hover:shadow-2xl transition-shadow duration-500">
              <h4 className="text-xl font-bold mb-6">SkillBridge Approach</h4>
              <ul className="space-y-4 text-base">
                {[
                  "Skills and learning potential first",
                  "Academic achievements valued",
                  "Rich internship & project opportunities",
                  "Startup ecosystem integration",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-300 mt-1 text-xl">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

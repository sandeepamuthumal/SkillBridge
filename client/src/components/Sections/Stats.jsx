import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Check, Search } from 'lucide-react';

const Stats = () => {
  const [counters, setCounters] = useState({ students: 0, startups: 0, matches: 0, success: 0 });

  useEffect(() => {
    const targets = { students: 1200, startups: 350, matches: 2800, success: 94 };
    const duration = 2000;
    const increment = 50;

    Object.keys(targets).forEach(key => {
      let current = 0;
      // RESOLVED: Removed 'as keyof typeof targets' as it's TypeScript syntax.
      const target = targets[key]; 
      const step = target / (duration / increment);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, increment);
      
      // Cleanup function for setInterval
      return () => clearInterval(timer);
    });
  }, []);

  const stats = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      value: counters.students,
      suffix: "+",
      label: "Students Connected",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Briefcase className="h-8 w-8 text-purple-600" />,
      value: counters.startups,
      suffix: "+",
      label: "Startup Partners",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Search className="h-8 w-8 text-green-600" />,
      value: counters.matches,
      suffix: "+",
      label: "AI Matches Made",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Check className="h-8 w-8 text-pink-600" />,
      value: counters.success,
      suffix: "%",
      label: "Success Rate",
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by Sri Lanka's
            <span className="text-yellow-300"> Best Talent</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join the growing community of undergraduates and startups finding perfect matches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-blue-100 text-lg">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              "Finally, a platform that understands what we bring as students!"
            </h3>
            <p className="text-blue-100 mb-4">
              - Kasun Perera, Computer Science Student, University of Colombo
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-300 text-xl">★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
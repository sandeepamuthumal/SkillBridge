import React, { useState, useEffect } from "react"; // Import useState and useEffect
import {
  ArrowRight,
  Target,
  Users,
  Zap,
  Award,
  Globe,
  Heart,
  Lightbulb,
  TrendingUp,
  Code,
  Palette,
  Brain,
  Shield,
  ArrowUp, // Import ArrowUp icon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const About = () => {
  // Dynamic content arrays defined inside the component
  const stats = [
    {
      number: "1000+",
      label: "Students Connected",
      icon: Users,
      color: "from-blue-500 to-purple-500",
    },
    {
      number: "500+",
      label: "Startup Partners",
      icon: Target,
      color: "from-green-500 to-teal-500",
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: Award,
      color: "from-orange-500 to-red-500",
    },
    {
      number: "24/7",
      label: "AI Matching",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description:
        "Our advanced AI algorithms analyze skills, potential, and compatibility to create perfect matches between students and startups.",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Users,
      title: "Skill-Based Hiring",
      description:
        "We focus on skills and potential rather than years of experience, giving undergraduates equal opportunities to showcase their talents.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: Globe,
      title: "Sri Lankan Focus",
      description:
        "Built specifically for the Sri Lankan market, understanding local needs, culture, and opportunities in the startup ecosystem.",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Heart,
      title: "Student-Centric",
      description:
        "Every feature is designed with students in mind, from resume feedback to career guidance and mentorship opportunities.",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
      color: "from-pink-500 to-purple-500",
    },
    {
      icon: Lightbulb,
      title: "Innovation Hub",
      description:
        "Connect with the most innovative startups and be part of building the next generation of Sri Lankan businesses.",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description:
        "Not just job placement - we focus on long-term career development and growth opportunities for every student.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      color: "from-teal-500 to-green-500",
    },
  ];

  const team = [
    {
      name: "H.W.S. Muthumal",
      role: "Project Manager & Lead Developer",
      image:
        "https://avatars.githubusercontent.com/u/104885821?v=4",
      bio: "Full-stack developer and AI engineer with expertise in building scalable web applications.",
      icon: Code,
      color: "from-blue-500 to-purple-500",
    },
    {
      name: "S.A.T.P. Perera",
      role: "Full-Stack Developer & QA Engineer",
      image:
        "https://avatars.githubusercontent.com/u/193111282?s=400&u=883cf4a247826bad900aca18e4e24ec83947c523&v=4",
      bio: "Experienced developer focused on quality assurance and DevOps practices.",
      icon: Shield,
      color: "from-green-500 to-teal-500",
    },
    {
      name: "R.C.P. Malalanayake",
      role: "Full-Stack Developer",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      bio: "Backend specialist with expertise in cloud deployment and infrastructure.",
      icon: Globe,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "M.S.M. Inshaf",
      role: "AI/NLP Engineer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      bio: "AI specialist focusing on natural language processing and machine learning algorithms.",
      icon: Brain,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "P.R. Wayendra",
      role: "UX/UI Designer",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b9c84c8a?w=150&h=150&fit=crop&crop=face",
      bio: "Creative designer passionate about creating beautiful and intuitive user experiences.",
      icon: Palette,
      color: "from-pink-500 to-purple-500",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "We embrace cutting-edge technology to solve real-world problems.",
      icon: Lightbulb,
      color: "text-yellow-600",
    },
    {
      title: "Accessibility",
      description:
        "Equal opportunities for all students, regardless of their background.",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Excellence",
      description: "We strive for the highest quality in everything we do.",
      icon: Award,
      color: "text-green-600",
    },
    {
      title: "Community",
      description: "Building a supportive ecosystem for students and startups.",
      icon: Heart,
      color: "text-red-600",
    },
  ];

  // State for scroll-to-top button visibility
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Effect for scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 100px (adjust for sensitivity)
      if (window.scrollY > 100) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll); // Add scroll event listener
    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up the event listener
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll animation
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-black/60 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop')] bg-cover bg-center bg-blend-overlay"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-10 animate-fade-in">
              About <span className="text-yellow-300">SkillBridge</span>
            </h1>
            <p className="text-xl max-w-4xl mx-auto mb-10 opacity-90 leading-relaxed">
              We're revolutionizing how undergraduates connect with startup
              opportunities in Sri Lanka. Our AI-powered platform bridges the
              gap between student potential and startup innovation.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Join Our Mission
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl text-black"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="relative text-center border-0 bg-white shadow-xl group overflow-hidden transition-all duration-500 rounded-2xl hover:shadow-3xl hover:-translate-y-1 hover:border hover:border-indigo-200"
              >
                {/* Background glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                <CardContent className="relative z-10 px-6 py-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-4 sm:p-5 bg-gradient-to-br ${stat.color} rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110`}
                    >
                      <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                  </div>

                  {/* Number */}
                  <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 transition-transform duration-300 transform group-hover:scale-110 group-hover:text-indigo-700">
                    {stat.number}
                  </h3>

                  {/* Label */}
                  <p className="text-gray-600 font-medium text-sm sm:text-base transition-colors duration-300 group-hover:text-indigo-600">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose SkillBridge?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another job board. We're a comprehensive ecosystem
              designed to empower students and startups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 group overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div
                      className={`p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A passionate group of developers, designers, and innovators
              dedicated to transforming the job market in Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 text-center group overflow-hidden"
              >
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  ></div>
                  <CardHeader className="relative pb-2">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <Avatar className="h-28 w-28 border-4 border-white shadow-xl group-hover:scale-105 transition-transform">
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback
                            className={`text-xl font-bold bg-gradient-to-br ${member.color} text-white`}
                          >
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-2 -right-2 p-2 bg-gradient-to-br ${member.color} rounded-full shadow-lg`}
                        >
                          <member.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {member.name}
                    </CardTitle>
                    <Badge
                      className={`bg-gradient-to-r ${member.color} text-white border-0 mt-3 px-4 py-1`}
                    >
                      {member.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at SkillBridge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-500 text-center group hover:-translate-y-2"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-gray-100 transition-colors">
                      <value.icon
                        className={`h-12 w-12 ${value.color} group-hover:scale-110 transition-transform`}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll-to-Top Button */}
      {showScrollToTop && (
        <Button
          variant="default"
          size="icon"
          onClick={scrollToTop}
         className="fixed bottom-6 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 z-50"
          style={{ width: '56px', height: '56px' }} // Explicit size for the circle
        >
          <ArrowUp className="h-6 w-6" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      )}
    </div>
  );
};

export default About;
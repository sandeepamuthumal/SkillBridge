// src/pages/ProfessionalsPage.jsx

import React, { useState, useEffect } from "react";
import api from "@/services/api";

import {
  Search,
  MapPin,
  Briefcase,
  Star,
  Filter,
  ArrowRight,
  Badge as BadgeIcon,
  Award,
  Globe,
  MessageCircle,
  Calendar,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfessionalsPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");

  // Define role options matching your UI expectations
  const roles = [
    { value: "all", label: "All Roles" },
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "manager", label: "Manager" },
    { value: "analyst", label: "Analyst" },
    { value: "consultant", label: "Consultant" },
  ];

  const experienceLevels = [
    { value: "all", label: "All Levels" },
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6+ years)" },
    { value: "expert", label: "Expert Level (10+ years)" },
  ];

  useEffect(() => {
    api
      .get("/professionals")
      .then((response) => {
        // Map your backend data to your UI model
        const mappedProfessionals = response.data.map((professional) => ({
          id: professional._id,
          name: professional.contactPersonName || "Unknown",
          title: professional.industry || "Professional",
          company: professional.companyName || "N/A",
          location: professional.contactInfo?.address || "Unknown",
          experience: "mid", // You can adjust or get from your API if available
          rating: 4.5, // Static or dynamic if available
          reviews: 10,
          hourlyRate: "LKR 2,000/hr", // Static placeholder
          profileImage:
            professional.logoUrl ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          coverImage:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop",
          bio: professional.companyDescription || "",
          skills: ["Skill1", "Skill2"], // You can enhance this by adding skills field
          achievements: [],
          availability: "Available", // Or "Busy" if you track that
          languages: ["English"], // Static or dynamic
          category: "consultant", // Map properly if you have category in backend
          responseTime: "< 2 hours",
          completedProjects: 20,
        }));

        setProfessionals(mappedProfessionals);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load professionals");
        setLoading(false);
      });
  }, []);

  const filteredProfessionals = professionals.filter((professional) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      professional.name.toLowerCase().includes(searchLower) ||
      professional.title.toLowerCase().includes(searchLower) ||
      professional.skills.some((skill) =>
        skill.toLowerCase().includes(searchLower)
      );

    const matchesRole =
      selectedRole === "all" || professional.category === selectedRole;

    const matchesExperience =
      selectedExperience === "all" || professional.experience === selectedExperience;

    return matchesSearch && matchesRole && matchesExperience;
  });

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-200";
      case "Busy":
        return "bg-red-100 text-red-800 border-red-200";
      case "Part-time":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getExperienceLabel = (experience) => {
    switch (experience) {
      case "entry":
        return "Entry Level";
      case "mid":
        return "Mid Level";
      case "senior":
        return "Senior Level";
      case "expert":
        return "Expert Level";
      default:
        return experience;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading professionals...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop')] bg-cover bg-center bg-blend-overlay">
          <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <br />
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Connect with Top{" "}
              <span className="text-yellow-300">Professionals</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Find experienced professionals and mentors to help your startup
              grow and succeed
            </p>
          </div>

          {/* Search */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search professionals, skills, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg border-4 border-gray-400 hover:border-purple-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl text-black transition-colors duration-300"
                  />
                </div>
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-14 border-4 border-gray-400 rounded-xl text-gray-700 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-colors duration-300">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedExperience}
                onValueChange={setSelectedExperience}
              >
                <SelectTrigger className="h-14 border-4 border-gray-400 rounded-xl text-gray-700 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-colors duration-300">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {filteredProfessionals.length} Professionals Found
          </h2>
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProfessionals.map((p) => (
            <Card
              key={p.id}
              className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white overflow-hidden transform hover:-translate-y-2"
            >
              {/* Card top */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <Badge
                  className={`absolute top-4 left-4 ${getAvailabilityColor(
                    p.availability
                  )} border font-medium px-3 py-1`}
                >
                  {p.availability}
                </Badge>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white transition-colors"
                  >
                    <Video className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarImage src={p.profileImage} alt={p.name} />
                    <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-green-500 to-teal-500 text-white">
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-white text-xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-white/90 font-medium">{p.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-medium">{p.rating}</span>
                      <span className="text-white/70">({p.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-1">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{p.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{p.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {p.hourlyRate}
                    </div>
                    <div className="text-sm text-gray-500">
                      Response: {p.responseTime}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {p.bio}
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      Skills & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {p.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-600" />
                      Achievements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {p.achievements.map((ach) => (
                        <Badge
                          key={ach}
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50 transition-colors px-3 py-1"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          {ach}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <BadgeIcon className="h-4 w-4" />
                      <span>{getExperienceLabel(p.experience)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{p.completedProjects} projects</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <span>{p.languages.join(", ")}</span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white flex items-center gap-2 group px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Contact
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-colors"
          >
            Load More Professionals
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsPage;

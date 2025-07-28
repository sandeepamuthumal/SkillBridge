import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api";
import {
  Briefcase,
  MapPin,
  Calendar, // Keeping Calendar, though not explicitly used for dates in the image, useful for future.
  Award,
  BookOpen, // Not explicitly used, but can be for certifications etc.
  DollarSign,
  Globe,
  Github,
  Linkedin,
  FileText, // Not explicitly used
  User,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Mail,
  Star,
  ChevronRight,
  Eye, // Used for profile views icon
  Download, // For resume download, though removed from Hero, could be in a contact card.
  Clock, // Can be used for availability if we reintroduce it or for experience duration.
  Building, // For university/company
  GraduationCap, // For education
  Code, // For projects
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Card components are great for consistent styling
import { Progress } from "@/components/ui/progress"; // For the progress bar placeholder
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SeekerProfilePage = () => {
  const { seekerId } = useParams();
  const [seeker, setSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("about");
  const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchSeekerProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/jobseeker/${seekerId}`);
        if (response.data) {
          setSeeker(response.data);
        } else {
          setError("Job Seeker profile data is empty or malformed.");
          setSeeker(null);
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setError("Job Seeker profile not found or is private.");
          } else if (err.response.data && err.response.data.message) {
            setError(`Error: ${err.response.data.message}`);
          } else {
            setError(`Server error: ${err.response.status}`);
          }
        } else if (err.request) {
          setError("Network error: No response from server. Please check your internet connection.");
        } else {
          setError("An unexpected error occurred while fetching the profile.");
        }
        console.error("Error fetching seeker profile:", err);
        setSeeker(null);
      } finally {
        setLoading(false);
      }
    };

    if (seekerId) {
      fetchSeekerProfile();
    }
  }, [seekerId]);

  const getExperienceLabel = (experienceLevel) => {
    switch (experienceLevel) {
      case "entry":
        return "Entry Level";
      case "mid":
        return "Mid Level";
      case "senior":
        return "Senior Level";
      case "expert":
        return "Expert Level";
      default:
        return "N/A";
    }
  };

  const getAvailabilityLabel = (availability) => {
    switch (availability) {
      case "immediately":
        return "Available Immediately"; // More descriptive
      case "two_weeks":
        return "Within 2 weeks";
      case "one_month":
        return "Within 1 month";
      case "three_months":
        return "Within 3 months";
      default:
        return "N/A";
    }
  };

  const getExperienceColor = (level) => {
    switch (level) {
      case "entry":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"; // Changed to emerald for consistency
      case "mid":
        return "bg-sky-100 text-sky-700 border-sky-200"; // Changed to sky
      case "senior":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"; // Changed to indigo
      case "expert":
        return "bg-rose-100 text-rose-700 border-rose-200"; // Changed to rose
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" /> {/* Changed primary color */}
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-indigo-300/20 pulse-glow"></div> {/* Changed primary color */}
        </div>
        <p className="mt-4 text-gray-600 animate-pulse">Loading professional profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center bg-gray-50">
        <Card className="w-full max-w-md shadow-lg rounded-xl p-8 bg-white border border-gray-100">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-300">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!seeker) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center bg-gray-50">
        <Card className="w-full max-w-md shadow-lg rounded-xl p-8 bg-white border border-gray-100">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Profile Not Found</h2>
            <p className="text-gray-600 mb-6">The requested professional profile does not exist or is not public.</p>
            <Button onClick={() => window.location.href = '/'} className="bg-gray-800 hover:bg-gray-700 text-white shadow-md transition-all duration-300">
                Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    userId,
    profilePictureUrl,
    statementHeader,
    statement,
    cityId,
    university,
    availability,
    profileCompleteness, // Keeping for potential use
    skills,
    experiences,
    educations,
    projects,
    expectedSalary,
    jobPreferences,
    socialLinks,
    resumeUrl, // Keeping for potential use (e.g., download button)
    experience,
  } = seeker;

  const fullName =
    userId?.firstName && userId?.lastName
      ? `${userId.firstName} ${userId.lastName}`
      : "Professional";

  const displayProfileImageUrl =
    profilePictureUrl && profilePictureUrl.trim().length > 0
      ? `${backendBaseUrl}${profilePictureUrl.startsWith("/") ? "" : "/"}${profilePictureUrl}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=374151&color=ffffff&size=256`; // Darker gray for fallback

  const sections = [
    { id: "about", label: "About", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: Code },
    { id: "skills", label: "Skills", icon: Award },
  ];

  return (
    <div className="min-h-screen py-8 bg-gray-50 font-sans">
        <br></br><br></br>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Hero Section */}
        <div className="relative bg-gray-900 rounded-3xl p-8 mb-8 overflow-hidden text-white shadow-xl
                    transition-all duration-300 ease-in-out transform hover:scale-[1.005]">
          {/* Subtle background pattern/gradient */}
          <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '20px 20px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            <div className="relative group">
              <Avatar className="h-36 w-36 border-4 border-indigo-400/50 shadow-2xl interactive-hover transition-transform duration-300 group-hover:scale-105">
                <AvatarImage src={displayProfileImageUrl} alt={fullName} />
                <AvatarFallback className="text-5xl font-bold bg-indigo-600 text-white">
                  {fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* Eye icon for "viewed" status or active indicator, if applicable */}
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-2 shadow-lg border-2 border-white">
                <Eye className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-2 text-white leading-tight">{fullName}</h1>
              <p className="text-xl lg:text-2xl text-indigo-200 mb-4">{statementHeader || "Aspiring Professional"}</p>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 text-gray-300 text-base mb-6">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-300" />
                  {cityId?.name || "Location N/A"}
                </span>
                <span className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-indigo-300" />
                  {university || "University N/A"}
                </span>
                {availability && availability !== "immediately" && availability !== "N/A" && (
                    <span className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-indigo-300" />
                        {getAvailabilityLabel(availability)}
                    </span>
                )}
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Button
                  className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                  onClick={() => userId?.email && window.open(`mailto:${userId.email}`, "_blank")}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact {userId?.firstName || "Me"}
                </Button>
                {resumeUrl && (
                    <Button
                        variant="outline"
                        className="bg-white/20 text-white border border-white/30 px-6 py-3 rounded-full hover:bg-white hover:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                        onClick={() => window.open(`${backendBaseUrl}${resumeUrl.startsWith("/") ? "" : "/"}${resumeUrl}`, "_blank")}
                    >
                        <Download className="h-5 w-5 mr-2" />
                        Download CV
                    </Button>
                )}
              </div>
            </div>

            
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-0 md:top-4 z-20 bg-white shadow-md rounded-xl p-2 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant="ghost" // Use ghost variant for cleaner look
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-medium
                    transition-all duration-300 ease-in-out
                    ${activeSection === section.id
                      ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700" // Active tab style
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600" // Inactive tab style
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  {section.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* About Section */}
            {activeSection === "about" && (
              <Card className="p-8 shadow-lg rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="p-0 mb-6 border-b pb-4 border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <User className="h-7 w-7 text-indigo-600" />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <p className="text-lg leading-relaxed text-gray-700">
                    {statement || "No detailed description provided."}
                  </p>

                  <Separator className="bg-gray-200 my-6" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center justify-center p-5 bg-gray-50 rounded-xl border border-gray-100 text-center shadow-sm">
                      <DollarSign className="h-8 w-8 text-indigo-600 mb-3" />
                      <div className="font-semibold text-gray-800 mb-1">Salary Range</div>
                      <div className="text-sm text-gray-600">
                        {expectedSalary?.min && expectedSalary?.max
                          ? `$${expectedSalary.min.toLocaleString()} - $${expectedSalary.max.toLocaleString()}`
                          : "Negotiable"}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-5 bg-gray-50 rounded-xl border border-gray-100 text-center shadow-sm">
                      <Briefcase className="h-8 w-8 text-indigo-600 mb-3" />
                      <div className="font-semibold text-gray-800 mb-1">Experience Level</div>
                      <Badge className={`mt-1 text-sm font-medium px-3 py-1.5 rounded-full ${getExperienceColor(experience || "")}`}>
                        {getExperienceLabel(experience || "")}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-center justify-center p-5 bg-gray-50 rounded-xl border border-gray-100 text-center shadow-sm">
                      <Globe className="h-8 w-8 text-indigo-600 mb-3" />
                      <div className="font-semibold text-gray-800 mb-1">Work Preference</div>
                      <div className="text-sm text-gray-600">
                        {jobPreferences?.remoteWork ? "Remote" : "On-site"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience Section */}
            {activeSection === "experience" && experiences && experiences.length > 0 && (
              <Card className="p-8 shadow-lg rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="p-0 mb-6 border-b pb-4 border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <Briefcase className="h-7 w-7 text-indigo-600" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-8">
                    {experiences.map((exp, index) => (
                      <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-100 interactive-hover transition-all duration-200 hover:bg-gray-100 hover:shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                          <div>
                            <h5 className="text-xl font-bold text-gray-800">{exp.title}</h5>
                            <p className="text-lg text-gray-600">{exp.company}</p>
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-2 md:mt-0 flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(exp.startDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short' })} -{" "}
                            {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short' }) : 'N/A'}
                          </div>
                        </div>
                        {exp.description && (
                            <p className="text-gray-700 leading-relaxed mt-3">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education Section */}
            {activeSection === "education" && educations && educations.length > 0 && (
              <Card className="p-8 shadow-lg rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="p-0 mb-6 border-b pb-4 border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <GraduationCap className="h-7 w-7 text-indigo-600" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-8">
                    {educations.map((edu, index) => (
                      <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-100 interactive-hover transition-all duration-200 hover:bg-gray-100 hover:shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                          <div>
                            <h5 className="text-xl font-bold text-gray-800">{edu.degree} in {edu.fieldOfStudy}</h5>
                            <p className="text-lg text-gray-600">{edu.university}</p>
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-2 md:mt-0 flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {edu.startYear} - {edu.currentlyStudying ? "Present" : edu.endYear}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projects Section */}
            {activeSection === "projects" && projects && projects.length > 0 && (
              <Card className="p-8 shadow-lg rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="p-0 mb-6 border-b pb-4 border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <Code className="h-7 w-7 text-indigo-600" />
                    Featured Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((proj, index) => (
                      <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm interactive-hover transition-all duration-200 hover:bg-gray-100 hover:shadow-md">
                        <h5 className="text-xl font-bold text-gray-800 mb-3">{proj.title}</h5>
                        <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">{proj.description}</p> {/* line-clamp for neatness */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {proj.technologies?.map((tech, i) => (
                            <Badge key={i} className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-300 transition-colors">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-3 mt-auto pt-2"> {/* mt-auto to push buttons to bottom */}
                          {proj.projectUrl && (
                            <Button
                              size="sm"
                              className="bg-indigo-600 text-white hover:bg-indigo-700 text-sm px-4 py-2 rounded-full shadow-md transition-all duration-300"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Live Demo
                            </Button>
                          )}
                          {proj.githubUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm px-4 py-2 rounded-full shadow-sm transition-all duration-300"
                            >
                              <Github className="h-4 w-4 mr-2" />
                              Code
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills Section */}
            {activeSection === "skills" && skills && skills.length > 0 && (
              <Card className="p-8 shadow-lg rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="p-0 mb-6 border-b pb-4 border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <Award className="h-7 w-7 text-indigo-600" />
                    Technical Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill, index) => {
                      let skillName = 'Unknown Skill';

                      // Improved handling for various skill formats from backend
                      if (typeof skill === 'object' && skill !== null) {
                        if ('name' in skill) {
                          skillName = skill.name;
                        } else {
                          // Attempt to reconstruct string from array-like object if 'name' is not present
                          const charArray = [];
                          let i = 0;
                          while (skill.hasOwnProperty(String(i))) {
                            charArray.push(skill[String(i)]);
                            i++;
                          }
                          if (charArray.length > 0) {
                            skillName = charArray.join('');
                          }
                        }
                      } else if (typeof skill === 'string') {
                        skillName = skill;
                      }

                      // Only render if skillName is a non-empty string
                      if (typeof skillName !== 'string' || skillName.trim() === '') {
                        return null;
                      }

                      return (
                        <Badge key={index} className="bg-emerald-100 text-emerald-800 text-sm px-4 py-2 rounded-full font-medium shadow-sm hover:bg-emerald-200 transition-colors cursor-pointer">
                          {skillName}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card className="p-6 shadow-lg rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <Star className="h-6 w-6 text-yellow-500" /> {/* Changed icon color */}
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="flex justify-between items-center text-gray-700">
                  <span className="text-base">Profile Views</span>
                  <span className="font-semibold text-gray-900">1,247</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="text-base">Response Rate</span>
                  <span className="font-semibold text-green-600">98%</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="text-base">Projects</span>
                  <span className="font-semibold text-gray-900">{projects?.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {socialLinks && (
              <Card className="p-6 shadow-lg rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <Globe className="h-6 w-6 text-blue-500" />
                    Connect
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex gap-4">
                    {socialLinks.linkedin && (
                      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 transition-colors duration-200 transform hover:scale-110"
                      >
                        <Linkedin className="h-7 w-7" />
                      </a>
                    )}
                    {socialLinks.github && (
                      <a href={socialLinks.github} target="_blank" rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 transition-colors duration-200 transform hover:scale-110"
                      >
                        <Github className="h-7 w-7" />
                      </a>
                    )}
                    {socialLinks.portfolio && (
                      <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer"
                        className="text-gray-500 hover:text-purple-600 transition-colors duration-200 transform hover:scale-110"
                      >
                        <ExternalLink className="h-7 w-7" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Card */}
            <Card className="p-6 bg-indigo-600 text-white rounded-xl shadow-lg border border-indigo-700 text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.005]">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-xl font-bold mb-1">Ready to Connect?</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-indigo-100 mb-5 leading-relaxed">
                  Let's discuss how we can work together to bring your ideas to life. Reach out and let's start a conversation!
                </p>
                <Button
                  className="w-full bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                  onClick={() => userId?.email && window.open(`mailto:${userId.email}`, "_blank")}
                >
                  Start Conversation
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfilePage;
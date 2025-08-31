import React, { useEffect, useState } from "react";
import {
  Globe,
  MapPin,
  Calendar,
  Users,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  ExternalLink,
  Building2,
  Award,
  CheckCircle,
  Eye,
  Heart,
  Briefcase,
  Star,
  MessageSquare,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "@/services/api";
import { employerProfileAPI } from "@/services/employer/employerProfileAPI";
import { jobPostAPI } from "@/services/jobPostAPI";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const CompanyStats = ({ data }) => {
  const stats = [
    {
      label: "Total Jobs Posted",
      value: data.jobStats?.allJobCount,
      icon: Briefcase,
      color: "blue",
    },
    {
      label: "Active Positions",
      value: data.jobStats?.activeJobCount,
      icon: Users,
      color: "green",
    },
    {
      label: "Successful Hires",
      value: data.jobStats?.hiredCount,
      icon: Award,
      color: "purple",
    },
  ];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${
            colorClasses[stat.color]
          } rounded-lg p-4 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <stat.icon className="text-white/80" size={24} />
          </div>
        </div>
      ))}
    </div>
  );
};

const CompanyDetailPage = () => {
  const { employerId } = useParams();
  const [employer, setEmployer] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    if (employerId) {
      fetchEmployerDetails();
      fetchEmployerJobs();

      // Check if job is saved in local storage
      const savedCompanies =
        JSON.parse(localStorage.getItem("savedCompanies")) || [];
      setIsSaved(
        savedCompanies.some((savedCompany) => savedCompany._id === employerId)
      );
    }

    // Add scroll event listener for the "bottom to up" button
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Show button after scrolling down 300px
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [employerId]);

  const fetchEmployerDetails = async () => {
    setLoading(true);
    const result = await employerProfileAPI.getEmployerById(employerId);
    if (result.success) {
      setEmployer(result.data);
    } else {
      console.error("Failed to load job details:", result.error);
    }

    // if (isAuthenticated) {
    //     const savedJobResult = await jobPostAPI.getSavedJobs();
    //     if (savedJobResult.success) {
    //         const savedJobs = savedJobResult.data;
    //         setIsSaved(savedJobs.some((savedJob) => savedJob._id === jobId));
    //     } else {
    //         console.error("Failed to load jobs:", result.error);
    //     }
    // }
    setLoading(false);
  };

  const fetchEmployerJobs = async () => {
    setLoading(true);
    const result = await jobPostAPI.getJobPostsByEmployer(employerId);
    if (result.success) {
      setJobs(result.data);
    } else {
      console.error("Failed to load jobs:", result.error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "about", label: "About", icon: Building2 },
    { id: "jobs", label: "Open Positions", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Companies</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Company Header */}
        <CompanyInfo employer={employer} />

        {/* Stats */}
        <CompanyStats data={employer} />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "about" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Company Overview
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {employer.companyDescription}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Company Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Industry:</span>
                        <span className="font-medium">{employer.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company Size:</span>
                        <span className="font-medium">
                          {employer.companySize}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Founded:</span>
                        <span className="font-medium">
                          {employer.foundedYear}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Verification:</span>
                        <span
                          className={`font-medium ${
                            employer.verified
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {employer.verified ? "Verified" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      {employer.contactInfo && (
                        <div>
                          <div className="flex items-start gap-2">
                            <MapPin
                              size={14}
                              className="text-gray-500 mt-0.5"
                            />
                            <span className="text-gray-700">
                              {employer.contactInfo.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-500" />
                            <span className="text-gray-700">
                              {employer.contactInfo.phone}
                            </span>
                          </div>
                        </div>
                      )}
                      {employer.contactPersonName && (
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-500" />
                          <span className="text-gray-700">
                            Contact: {employer.contactPersonName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "jobs" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Current Openings
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {jobs.filter((j) => j.status === "Published").length} Active
                  </span>
                </div>

                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {job.title}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Briefcase size={14} />
                              {job.categoryId.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {job.cityId.name}
                            </span>
                          </p>
                        </div>
                        <Link to={`/jobs/${job._id}`}>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                          View Details
                        </button>
                        </Link>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {job.applicationCount} applicants
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {jobs.length === 0 && (
                  <div className="text-center py-12">
                    <Briefcase
                      className="mx-auto text-gray-400 mb-3"
                      size={48}
                    />
                    <p className="text-gray-600">No open positions available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyInfo = ({ employer }) => {
  console.log(employer);
  const getSizeLabel = (size) => {
    const labels = {
      startup: "Startup (1-10 employees)",
      small: "Small (11-50 employees)",
      medium: "Medium (51-200 employees)",
      large: "Large (200+ employees)",
    };
    return labels[size] || size;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Company Logo and Basic Info */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={serverUrl + employer.logoUrl}
              alt={employer.companyName}
              className="w-32 h-32 rounded-lg object-cover border-4 border-gray-100"
            />
            {employer.verified && (
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                <CheckCircle className="text-white" size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Company Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                {employer.companyName}
                {employer.verified && (
                  <CheckCircle className="text-green-500" size={24} />
                )}
              </h1>
              <p className="text-lg text-gray-600">{employer.industry}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Heart size={16} />
                Follow
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 size={16} />
              <span>{getSizeLabel(employer.companySize)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <span>Founded in {employer.foundedYear}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span>
                {employer.contactInfo ? employer.contactInfo.address : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={16} />
              <span>
                {employer.contactInfo ? employer.contactInfo.phone : "N/A"}
              </span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {employer.companyWebsite && (
              <a
                href={employer.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Globe size={16} />
                <span className="text-sm">Website</span>
                <ExternalLink size={12} />
              </a>
            )}
            {employer.socialLinks?.linkedin && (
              <a
                href={employer.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            )}

            {employer.socialLinks?.twitter && (
              <a
                href={employer.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 transition-colors"
              >
                <Twitter size={20} />
              </a>
            )}

            {employer.socialLinks?.facebook && (
              <a
                href={employer.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 transition-colors"
              >
                <Facebook size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;

import React, { useState, useEffect } from "react";
import api from "@/services/api";
import {
  Search,
  MapPin,
  DollarSign,
  Filter,
  Briefcase,
  Users,
  Bookmark,
  Building2,
  Calendar,
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

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const jobCategories = [
    { value: "all", label: "All Categories" },
    { value: "Technology", label: "Technology" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Finance" },
    { value: "Operations", label: "Operations" },
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "Colombo", label: "Colombo" },
    { value: "Kandy", label: "Kandy" },
    { value: "Galle", label: "Galle" },
    { value: "Remote", label: "Remote" },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobListings(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobListings.filter((job) => {
    const title = job.title?.toLowerCase() || "";
    const company = job.employerId?.companyName?.toLowerCase() || "";
    const skills = (job.preferredSkills || []).join(" ").toLowerCase();

    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      company.includes(searchTerm.toLowerCase()) ||
      skills.includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || job.categoryId?.name === selectedCategory;

    const matchesLocation =
      selectedLocation === "all" ||
      job.cityId?.name?.toLowerCase() === selectedLocation.toLowerCase();

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    newSavedJobs.has(jobId)
      ? newSavedJobs.delete(jobId)
      : newSavedJobs.add(jobId);
    setSavedJobs(newSavedJobs);
  };

  const applyNow = (jobId) => {
    console.log("Applying for job:", jobId);
    // Add logic to handle the apply action
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop')] bg-cover bg-center bg-blend-overlay">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Find Your Perfect{" "}
              <span className="text-yellow-300">Opportunity</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Discover internships, part-time roles, and freelance opportunities
              with innovative startups
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 text-black" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-4 border-gray-400 focus:border-purple-600 hover:border-purple-600 focus:ring-4 focus:ring-blue-300 rounded-xl text-black bg-white"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-14 border-4 border-gray-400 rounded-xl text-gray-700 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-colors duration-300">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="h-14 border-4 border-gray-400 rounded-xl text-gray-700 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-colors duration-300">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
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
            {loading
              ? "Loading..."
              : `${filteredJobs.length} Opportunities Found`}
          </h2>
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">
            Please wait while we load jobs...
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredJobs.map((job) => (
              <Card
                key={job._id}
                className="bg-green-100 p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group hover:border-purple-400 border-4"
              >
                <CardContent className="p-0">
                  
                  {/* Card Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {/* Company logo placeholder */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {job.title || "Job Title"}
                        </h3>
                        <p className="font-medium text-sm text-gray-500">
                          {job.employerId?.companyName || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 sm:mt-0">
                      {job.status === "Urgent" && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs font-semibold px-3 py-1 rounded-full"
                        >
                          Urgent
                        </Badge>
                      )}
                      <button
                        className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleSaveJob(job._id)}
                      >
                        <Bookmark
                          className={`h-5 w-5 transition ${
                            savedJobs.has(job._id)
                              ? "text-purple-600 fill-purple-600"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Job Description */}
                  {job.description && (
                    <p className="text-gray-700 mb-6">{job.description}</p>
                  )}

                  {/* Details Grid - Consistent Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4 text-sm text-gray-600 mb-6">
                    {/* Location */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500">Location</span>
                        <span className="font-semibold text-gray-900">
                          {job.cityId?.name || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500">Type</span>
                        <span className="font-semibold text-gray-900">
                          {job.typeId?.name || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500">Experience</span>
                        <span className="font-semibold text-gray-900">
                          {job.experienceLevel || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500">Salary</span>
                        <span className="font-semibold text-gray-900">
                          {job.salaryRange?.min && job.salaryRange?.max
                            ? `${job.salaryRange.min} - ${job.salaryRange.max} ${job.salaryRange.currency}`
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500">Deadline</span>
                        <span className="font-semibold text-gray-900">
                          {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Work Style */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <Building2 className="h-5 w-5 text-purple-600" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500">Work Style</span>
                        <span className="font-semibold text-gray-900">
                          {job.workArrangement || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Technologies */}
                  <div className="space-y-4">
                    <p className="text-gray-900 font-semibold">Skills & Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {job.preferredSkills?.slice(0, 6).map((skill, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="bg-purple-100 text-purple-800 border-none text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {job.preferredSkills && job.preferredSkills.length > 6 && (
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 border-none text-xs px-3 py-1 rounded-full font-medium"
                        >
                          +{job.preferredSkills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                {/* Footer Section with Apply Button */}
                <div className="flex justify-between items-center pt-4 text-sm text-gray-500">
                  <p>Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
                    onClick={() => applyNow(job._id)}
                  >
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-colors"
          >
            Load More Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
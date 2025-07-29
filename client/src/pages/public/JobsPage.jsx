import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X, // Added X icon for clear filters
  MapPin, // Added for job card details
  DollarSign, // Added for job card details
  Briefcase, // Added for job card details
  Users, // Added for job card details
  Bookmark, // Added for job card details
  Building2, // Added for job card details
  Calendar, // Added for job card details
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
import { jobPostAPI } from "@/services/jobPostAPI";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import JobCard from "@/components/jobposts/JobCard";

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedWorkStyle, setSelectedWorkStyle] = useState("all");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // New: Current page number
  const [jobsPerPage] = useState(6); // New: Number of jobs to load per page
  const [hasMoreJobs, setHasMoreJobs] = useState(true); // New: To control visibility of "Load More" button
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    
  ];

  // Load initial jobs and saved jobs
  useEffect(() => {
    loadJobPosts(page, jobsPerPage, true); // Pass true for initial load
  }, [page, jobsPerPage, isAuthenticated]); // Re-run when page, jobsPerPage or auth status changes

  /**
   * Loads job posts from the API and updates the job listings state.
   * If `isInitialLoad` is true, it resets the job listings. Otherwise, it appends.
   * Also loads saved jobs if authenticated.
   * @param {number} currentPage - The current page number to fetch.
   * @param {number} limit - The number of jobs to fetch per page.
   * @param {boolean} isInitialLoad - True if this is the first load (resets jobListings), false otherwise.
   * @returns {undefined}
   */
  const loadJobPosts = async (currentPage, limit, isInitialLoad = false) => {
    setLoading(true);
    try {
      // Assuming jobPostAPI.getAllJobs can take pagination parameters
      // You might need to adjust your jobPostAPI to support this
      const result = await jobPostAPI.getAllJobs({ page: currentPage, limit: limit });

      if (result.success) {
        if (isInitialLoad) {
          setJobListings(result.data);
        } else {
          setJobListings((prevJobs) => [...prevJobs, ...result.data]);
        }
        // Determine if there are more jobs to load
        setHasMoreJobs(result.data.length === limit);
      } else {
        console.error("Failed to load jobs:", result.error);
        setHasMoreJobs(false); // No more jobs if loading failed
      }

      if (isAuthenticated) {
        const savedJobResult = await jobPostAPI.getSavedJobs();
        if (savedJobResult.success) {
          const savedJobsArray = savedJobResult.data;
          const savedJobIds = new Set(savedJobsArray.map((job) => job._id));
          setSavedJobs(savedJobIds);
          setJobListings((prevJobs) =>
            prevJobs.map((job) => ({
              ...job,
              isSaved: savedJobIds.has(job._id),
            }))
          );
          console.log("Saved jobs loaded");
        } else {
          console.error("Failed to load saved jobs:", savedJobResult.error);
        }
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      setHasMoreJobs(false); // No more jobs if an error occurs
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // Function to reset all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedWorkStyle("all");
    setPage(1); // Reset page to 1 when filters are cleared
    setHasMoreJobs(true); // Assume there are more jobs after clearing filters
    loadJobPosts(1, jobsPerPage, true); // Reload jobs for the first page
  };

  // Check if any filter is active
  const isFilterActive =
    searchTerm !== "" ||
    selectedCategory !== "all" ||
    selectedLocation !== "all" ||
    selectedWorkStyle !== "all";

  // Note: Filtering is now done client-side on the currently loaded jobs.
  // For truly scalable pagination with filtering, your API should handle filters as well.
  const filteredJobs = jobListings.filter((job) => {
    const title = job.title?.toLowerCase() || "";
    const company = job.employerId?.companyName?.toLowerCase() || "";
    const skills = (job.preferredSkills || []).join(" ").toLowerCase();

    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      company.includes(searchTerm.toLowerCase()) ||
      skills.includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      job.categoryId?.name?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesLocation =
      selectedLocation === "all" ||
      job.cityId?.name?.toLowerCase() === selectedLocation.toLowerCase();

    const matchesWorkStyle =
      selectedWorkStyle === "all" ||
      job.workArrangement?.toLowerCase() === selectedWorkStyle.toLowerCase();

    return (
      matchesSearch && matchesCategory && matchesLocation && matchesWorkStyle
    );
  });

  const toggleSaveJob = async (jobId) => {
    try {
      if (savedJobs.has(jobId)) {
        await jobPostAPI.removeSavedJob(jobId);
        setSavedJobs((prev) => {
          const newSavedJobs = new Set(prev);
          newSavedJobs.delete(jobId);
          return newSavedJobs;
        });
      } else {
        await jobPostAPI.saveJob(jobId);
        setSavedJobs((prev) => new Set(prev).add(jobId));
      }
      setJobListings((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        )
      );
    } catch (error) {
      console.error("Error saving/unsaving job:", error);
    }
  };

  const applyNow = (jobId) => {
    console.log("Applying for job:", jobId);
    // Add logic to handle the apply action
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment page to load next set of jobs
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
          <div className="text-center mb-8 mt-5">
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
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 text-black" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-4 border-gray-400 focus:border-purple-600 hover:border-purple-600 focus:ring-4 focus:ring-blue-300 rounded-xl text-black bg-white w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
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

                <Select
                  value={selectedWorkStyle}
                  onValueChange={setSelectedWorkStyle}
                >
                  <SelectTrigger className="h-14 border-4 border-gray-400 rounded-xl text-gray-700 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-colors duration-300">
                    <SelectValue placeholder="Work Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Work Styles</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {loading && page === 1 // Only show loading for initial fetch
              ? "Loading..."
              : `${filteredJobs.length} Opportunities Found`}
          </h2>
          <div className="flex gap-4 items-center">
            {/* Conditional Clear Filters button */}
            {isFilterActive && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 transition-colors"
              >
                Clear Filters
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {loading && page === 1 ? ( // Only show spinner for initial load
          <div className="text-center py-12 text-gray-500">
            <svg
              className="animate-spin h-10 w-10 text-purple-600 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p>Loading jobs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={{ ...job, isSaved: savedJobs.has(job._id) }}
                onClick={() => handleJobClick(job._id)}
                onApply={applyNow}
                onSaveToggle={toggleSaveJob}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMoreJobs && !loading && filteredJobs.length > 0 && ( // Show button if there might be more jobs and not currently loading, and some jobs are displayed
          <div className="text-center mt-16">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-colors"
            >
              {loading ? "Loading More..." : "Load More Opportunities"}
            </Button>
          </div>
        )}
         {/* Message when no jobs are found after filtering */}
         {!loading && filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 py-8">No opportunities found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
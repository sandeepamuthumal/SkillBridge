import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  X,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Bookmark,
  Building2,
  Calendar,
  ArrowUp,
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
import { seekerProfileAPI } from "@/services/jobseeker/seekerProfileAPI";
import { toast } from "react-toastify";

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedWorkStyle, setSelectedWorkStyle] = useState("all");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [jobsPerPage] = useState(6);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [cities, setCities] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const citiesRes = await seekerProfileAPI.getCities();
        setCities(citiesRes.data);
        const jobCategoriesRes = await seekerProfileAPI.getJobCategories();
        setJobCategories(jobCategoriesRes.data);
      } catch (err) {
        toast.error("Failed to load data");
        console.error("Data load failed", err);
      }
    })();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 and clear hasMoreJobs when filters change
  useEffect(() => {
    setPage(1);
    setHasMoreJobs(true);
    setTotalJobs(0);
  }, [debouncedSearchTerm, selectedCategory, selectedLocation, selectedWorkStyle]);

  // Load jobs when filters change (reset to page 1)
  useEffect(() => {
    console.log("Filters changed, loading jobs..."); // Debug log
    setPage(1);
    setJobListings([]); // Clear existing jobs
    loadJobPosts(1, jobsPerPage, true);
  }, [debouncedSearchTerm, selectedCategory, selectedLocation, selectedWorkStyle]);

  // Load more jobs when page changes (and it's not page 1)
  useEffect(() => {
    if (page > 1) {
      loadJobPosts(page, jobsPerPage, false);
    }
  }, [page]);

  // Scroll-to-top button logic
  useEffect(() => {
    const handleScroll = () => setShowScrollToTop(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load saved jobs when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedJobs();
    } else {
      setSavedJobs(new Set());
    }
  }, [isAuthenticated]);

  const loadJobPosts = async (currentPage, limit, isInitialLoad = false) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit,
      };

      // Add filters only if they're not "all"
      if (debouncedSearchTerm.trim()) {
        params.search = debouncedSearchTerm.trim();
      }

      if (selectedCategory !== "all") {
        params.categoryId = selectedCategory;
      }

      if (selectedLocation !== "all") {
        params.cityId = selectedLocation;
      }

      if (selectedWorkStyle !== "all") {
        params.workArrangement = selectedWorkStyle;
      }

      console.log("API params being sent:", params); // Debug log

      const result = await jobPostAPI.getAllJobs(params);
      console.log("API response:", result); // Debug log

      if (result.success) {
        const jobs = result.data || [];

        if (isInitialLoad) {
          setJobListings(jobs);
        } else {
          setJobListings((prev) => [...prev, ...jobs]);
        }

        // Determine if there are more jobs
        setHasMoreJobs(jobs.length === limit);
        setTotalJobs(isInitialLoad ? jobs.length : (prev) => prev + jobs.length);

        // Mark saved jobs if authenticated
        if (isAuthenticated && savedJobs.size > 0) {
          setJobListings((current) =>
            current.map((job) => ({
              ...job,
              isSaved: savedJobs.has(job._id),
            }))
          );
        }
      } else {
        console.error("Failed to load jobs:", result.error);
        setHasMoreJobs(false);
        if (isInitialLoad) {
          setJobListings([]);
          setTotalJobs(0);
        }
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
      setHasMoreJobs(false);
      if (isInitialLoad) {
        setJobListings([]);
        setTotalJobs(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    if (!isAuthenticated) return;

    try {
      const savedResult = await jobPostAPI.getSavedJobs();
      if (savedResult.success) {
        const savedIds = new Set(savedResult.data.map((job) => job._id));
        setSavedJobs(savedIds);

        // Update existing job listings to reflect saved status
        setJobListings((prev) =>
          prev.map((job) => ({
            ...job,
            isSaved: savedIds.has(job._id),
          }))
        );
      }
    } catch (err) {
      console.error("Error loading saved jobs:", err);
    }
  };

  const handleJobClick = (jobId) => navigate(`/jobs/${jobId}`);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedWorkStyle("all");
    setPage(1);
    setHasMoreJobs(true);
    // loadJobPosts will be called automatically due to useEffect dependencies
  };

  const isFilterActive =
    searchTerm !== "" ||
    selectedCategory !== "all" ||
    selectedLocation !== "all" ||
    selectedWorkStyle !== "all";

  const toggleSaveJob = async (jobId) => {
    if (!isAuthenticated) {
      // Redirect to login or show authentication modal
      navigate('/login');
      return;
    }

    try {
      if (savedJobs.has(jobId)) {
        const result = await jobPostAPI.unsaveJobPost(jobId);
        if (result.success) {
          setSavedJobs((prev) => {
            const copy = new Set(prev);
            copy.delete(jobId);
            return copy;
          });
        }
      } else {
        const result = await jobPostAPI.saveJobPost(jobId);
        if (result.success) {
          setSavedJobs((prev) => new Set(prev).add(jobId));
        }
      }

      // Update job listings to reflect the change
      setJobListings((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, isSaved: !job.isSaved } : job
        )
      );
    } catch (err) {
      console.error("Error toggling save:", err);
      // Optionally show error message to user
    }
  };

  const applyNow = (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/jobs/${jobId}/apply`);
  };

  const handleLoadMore = () => setPage((prev) => prev + 1);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
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
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-14 border-4 border-gray-400 rounded-xl text-gray-700 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-colors duration-300">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {jobCategories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-14 border-4 border-gray-400 rounded-xl text-gray-700 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-colors duration-300">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {cities.map((loc) => (
                      <SelectItem key={loc._id} value={loc._id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedWorkStyle} onValueChange={setSelectedWorkStyle}>
                  <SelectTrigger className="h-14 border-4 border-gray-400 rounded-xl text-gray-700 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-colors duration-300">
                    <SelectValue placeholder="Work Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Work Styles</SelectItem>
                    <SelectItem value="On-site">Onsite</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {loading && jobListings.length === 0 ? "Loading..." : `${jobListings.length} Opportunities Found`}
          </h2>
          <div className="flex gap-4 items-center">
            {isFilterActive && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 transition-colors"
                disabled={loading}
              >
                Clear Filters <X className="h-4 w-4" />
              </Button>
            )}
            
          </div>
        </div>

        {loading && jobListings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="animate-spin h-10 w-10 text-purple-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading jobs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobListings.map((job) => (
              <JobCard
                key={job._id}
                job={{ ...job, isSaved: savedJobs.has(job._id) }}
                onClick={() => handleJobClick(job._id)}
                onApply={() => applyNow(job._id)}
                onSaveToggle={() => toggleSaveJob(job._id)}
              />
            ))}
          </div>
        )}

        {/* Loading more indicator */}
        {loading && page > 1 && (
          <div className="text-center mt-8">
            <svg className="animate-spin h-8 w-8 text-purple-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading more jobs...</p>
          </div>
        )}

        {/* Load More Button */}
        {hasMoreJobs && !loading && jobListings.length > 0 && (
          <div className="text-center mt-16">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Load More Opportunities
            </Button>
          </div>
        )}

        {/* No results message */}
        {!loading && jobListings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Briefcase className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No opportunities found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or clearing some filters
            </p>
            {isFilterActive && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="px-6 py-2"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Scroll-to-Top */}
      {showScrollToTop && (
        <Button
          variant="default"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 z-50"
          style={{ width: '56px', height: '56px' }}
        >
          <ArrowUp className="h-6 w-6" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      )}
    </div>
  );
};

export default JobsPage;
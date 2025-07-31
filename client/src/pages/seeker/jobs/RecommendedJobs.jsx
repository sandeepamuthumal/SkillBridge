import React, { useState, useEffect } from "react";
import { Brain, ChevronLeft, ChevronRight, Lightbulb, Sparkles } from "lucide-react";
import { jobPostAPI } from "@/services/jobPostAPI";
import JobCard from "@/components/jobposts/JobCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApplicationModal from "../applications/components/ApplicationModal";
import { applicationAPI } from "@/services/jobseeker/applicationAPI";
import RecommendedJobCard from "./components/RecommendedJobCard";

const RecommendedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState({});
  const [selectedJobForApplication, setSelectedJobForApplication] =
    useState(null);
  const navigate = useNavigate();

  // Load all jobs
  useEffect(() => {
    loadJobPosts();
  }, []);

  const loadJobPosts = async () => {
    setLoading(true);
    try {
      const result = await jobPostAPI.getRecommendedJobs();
      console.log("Job response : ", result);
      if (result.success) {
        setJobs(result.data);
      } else {
        console.error("Failed to load jobs:", result.error);
      }

      const savedJobResult = await jobPostAPI.getSavedJobs();
      if (savedJobResult.success) {
        const savedJobs = savedJobResult.data;
        setJobs((prevJobs) =>
          prevJobs.map((job) => ({
            ...job,
            isSaved: savedJobs.some((savedJob) => savedJob._id === job._id),
          }))
        );
        console.log("Saved jobs loadded");
      } else {
        console.error("Failed to load jobs:", result.error);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const jobsPerPage = 6;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const currentJobs = jobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );
  const handleJobClick = (jobId) => {
    navigate(`/jobseeker/jobs/${jobId}`);
  };

  const handleApply = (job) => {
    setShowApplicationModal(true);
    setSelectedJobForApplication(job);
  };

/**
 * Submits a job application using the provided application data.
 * Displays a success message and reloads job posts if the submission is successful.
 * Displays an error message if the submission fails.
 *
 * @param {Object} applicationData - The data required to submit the job application.
 */

  const handleApplicationSubmit = async (applicationData) => {
    try {
      // API call to submit application
      const response = await applicationAPI.submitJobApplication(
        applicationData
      );
      if (response.success) {
        toast.success("Application submitted successfully!");
        setShowApplicationModal(false);
        setSelectedJobForApplication(null);
        loadJobPosts();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    }
  };

  const getMatchColor = (similarity) => {
    if (similarity >= 90) return "from-green-500 to-emerald-500";
    if (similarity >= 70) return "from-blue-500 to-cyan-500";
    if (similarity >= 50) return "from-purple-500 to-pink-500";
    return "from-yellow-500 to-orange-500";
  };

  const toggleMatchDetails = (jobId) => {
    setShowMatchDetails(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">AI Recommended Jobs</h1>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-600">Personalized job matches based on your profile, skills, and preferences</p>
            </div>
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * jobsPerPage + 1}-
              {Math.min(currentPage * jobsPerPage, jobs.length)} of{" "}
              {jobs.length} jobs
            </div>
          </div>

          {/* AI Insights Banner */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">AI-Powered Matching</h3>
                <p className="text-sm text-blue-700">These recommendations are based on your skills, experience, projects, and career goals. Match scores update in real-time as you improve your profile.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentJobs.map((job) => (
          <RecommendedJobCard
              key={job._id}
              job={job}
              onJobClick={() => handleJobClick(job._id)}
              onApply={() => handleApply(job)}
              onToggleMatchDetails={() => toggleMatchDetails(job.id)}
              showMatchDetails={showMatchDetails[job.id]}
              getMatchColor={getMatchColor}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-12 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPage === index + 1
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => {
          setShowApplicationModal(false);
          setSelectedJobForApplication(null);
        }}
        job={selectedJobForApplication}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
};

export default RecommendedJobs;

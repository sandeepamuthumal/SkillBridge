import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobPostAPI } from "@/services/jobPostAPI";
import {
    MapPin,
    Clock,
    DollarSign,
    Users,
    Calendar,
    Briefcase,
    Eye,
    ExternalLink,
    Building2,
    Star,
    CheckCircle,
    Timer,
    Target,
    Bookmark,
    BookmarkCheck,
    Share2,
    Flag,
    ArrowLeft,
    ArrowUp, // Import ArrowUp icon
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { applicationAPI } from "@/services/jobseeker/applicationAPI";
import ApplicationModal from "../seeker/applications/components/ApplicationModal";

const JobDetailPage = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false); // New state for scroll to top button

    useEffect(() => {
        if (jobId) {
            fetchJobDetails();

            // Check if job is saved in local storage
            const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
            setIsSaved(savedJobs.some((savedJob) => savedJob._id === jobId));
        }

        // Add scroll event listener for the "bottom to up" button
        const handleScroll = () => {
            if (window.scrollY > 100) { // Show button after scrolling down 300px
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
    }, [jobId]);

    const fetchJobDetails = async () => {
        setLoading(true);
        const result = await jobPostAPI.getJobById(jobId);
        if (result.success) {
            setJob(result.data);
        } else {
            console.error("Failed to load job details:", result.error);
        }

        if (isAuthenticated) {
            const savedJobResult = await jobPostAPI.getSavedJobs();
            if (savedJobResult.success) {
                const savedJobs = savedJobResult.data;
                setIsSaved(savedJobs.some((savedJob) => savedJob._id === jobId));
            } else {
                console.error("Failed to load jobs:", result.error);
            }
        }
        setLoading(false);
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

    const formatSalary = (min, max, currency, period = "monthly") => {
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} / ${period}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDaysLeft = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleSave = async (e) => {
        if (!isAuthenticated) {
            toast.error("You must be signed in to save a job.");
            navigate("/signin", { state: { from: window.location.pathname } });
            return;
        }

        e.stopPropagation();
        setIsSaved(!isSaved);

        try {
            if (isSaved) {
                await jobPostAPI.unsaveJobPost(job._id);
            } else {
                await jobPostAPI.saveJobPost(job._id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleApply = async () => {
        if (!isAuthenticated) {
            toast.error("You must be signed in to apply for a job.");
            navigate("/signin", { state: { from: window.location.pathname } });
            return;
        }
        setShowApplicationModal(true);
    };

    const handleApplicationSubmit = async (applicationData) => {
        try {
            // API call to submit application
            const response = await applicationAPI.submitJobApplication(
                applicationData
            );
            if (response.success) {
                toast.success("Application submitted successfully!");
                setShowApplicationModal(false);
                fetchJobDetails();
            } else {
                toast.error(response.error);
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            toast.error("Failed to submit application. Please try again.");
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: job.title,
                text: `Check out this ${job.typeId.name} opportunity at ${job.employerId.name}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Job link copied to clipboard!");
        }
    };

    const handleReport = () => {
        alert("Report functionality would open a modal or redirect to report form");
    };

    const goBack = () => {
        window.history.back();
    };

    // Function to scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // For a smooth scrolling effect
        });
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

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Job Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        The job you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={goBack}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const daysLeft = getDaysLeft(job.deadline);
    const isExpired = daysLeft <= 0;

    return (
        <>
            <div className="min-h-screen bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-5">
                {/* Breadcrumb/Navigation */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <button
                            onClick={goBack}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Jobs</span>
                        </button>
                    </div>
                </div>

                {/* Job Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            {/* Left Side - Job Info */}
                            <div className="flex-1">
                                <div className="flex items-start space-x-6 mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl flex items-center justify-center text-4xl shadow-sm">
                                        {job.employerId.logoUrl ? (
                                            <img
                                                src={serverUrl + job.employerId.logoUrl}
                                                alt={job.employerId.companyName}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <span className="text-3xl">
                                                {job.employerId.companyName.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                                    {job.title}
                                                </h1>
                                                {job.featured && (
                                                    <div className="inline-flex items-center bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm mb-3">
                                                        ⭐ Featured Job
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1 mb-3">
                                            <Building2 className="w-5 h-5 text-gray-500" />
                                            <span className="text-xl font-semibold text-gray-900">
                                                {job.employerId.companyName}
                                            </span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-600">
                                                {job.employerId.companySize} employees
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>
                                                    {job.cityId.name}, {job.cityId.country}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Briefcase className="w-4 h-4" />
                                                <span>{job.workArrangement}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{job.typeId.name}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{job.viewCount} views</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{job.applicationCount} applications</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Posted {formatDate(job.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Salary & Key Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-800">
                                                Salary Range
                                            </span>
                                        </div>
                                        <p className="text-lg font-bold text-green-900">
                                            {formatSalary(
                                                job.salaryRange.min,
                                                job.salaryRange.max,
                                                job.salaryRange.currency,
                                                job.salaryRange.period
                                            )}
                                        </p>
                                        {job.salaryRange.negotiable && (
                                            <p className="text-sm text-green-700">Negotiable</p>
                                        )}
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <Timer className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800">
                                                Application Deadline
                                            </span>
                                        </div>
                                        <p className="text-lg font-bold text-blue-900">
                                            {formatDate(job.deadline)}
                                        </p>
                                        <p
                                            className={`text-sm ${daysLeft <= 3
                                                ? "text-red-600"
                                                : daysLeft <= 7
                                                    ? "text-orange-600"
                                                    : "text-blue-600"
                                                }`}
                                        >
                                            {isExpired
                                                ? "Applications closed"
                                                : `${daysLeft} days remaining`}
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <Target className="w-5 h-5 text-purple-600" />
                                            <span className="text-sm font-medium text-purple-800">
                                                Experience Level
                                            </span>
                                        </div>
                                        <p className="text-lg font-bold text-purple-900">
                                            {job.experienceLevel}
                                        </p>
                                        <p className="text-sm text-purple-700">
                                            {job.experienceYears.min}-{job.experienceYears.max} years
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Actions */}
                            <div className="lg:w-80 space-y-4">
                                <button
                                    onClick={handleApply}
                                    disabled={isExpired || isApplying}
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${isExpired
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : isApplying
                                            ? "bg-blue-400 text-white cursor-wait"
                                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        }`}
                                >
                                    {isApplying ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Applying...</span>
                                        </div>
                                    ) : isExpired ? (
                                        "Application Closed"
                                    ) : (
                                        "Apply Now"
                                    )}
                                </button>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleSave}
                                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${isSaved
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600"
                                            }`}
                                    >
                                        {isSaved ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <BookmarkCheck className="w-4 h-4" />
                                                <span>Saved</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Bookmark className="w-4 h-4" />
                                                <span>Save Job</span>
                                            </div>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleShare}
                                        className="px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                                        title="Share this job"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={handleReport}
                                        className="px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-red-300 hover:text-red-600 transition-all duration-300"
                                        title="Report this job"
                                    >
                                        <Flag className="w-5 h-5" />
                                    </button>
                                </div>

                                {!isExpired && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                        <p className="text-sm text-orange-800">
                                            <strong>
                                                {job.maxApplications - job.applicationCount}
                                            </strong>{" "}
                                            spots remaining out of{" "}
                                            <strong>{job.maxApplications}</strong> total positions
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Job Description */}
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    About This Role
                                </h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {job.description}
                                </p>
                            </section>

                            {/* Key Responsibilities */}
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Key Responsibilities
                                </h2>
                                <ul className="space-y-4">
                                    {job.responsibilities.map((responsibility, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700 leading-relaxed">
                                                {responsibility}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Requirements */}
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Requirements
                                </h2>
                                <ul className="space-y-4">
                                    {job.requirements.map((requirement, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <Target className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700 leading-relaxed">
                                                {requirement}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Preferred Skills */}
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Preferred Skills
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {job.preferredSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-medium border border-blue-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Benefits */}
                            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Benefits & Perks
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {job.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Application Process */}
                            {job.applicationProcess && (
                                <section className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                                    <h2 className="text-2xl font-bold text-blue-900 mb-4">
                                        Application Process
                                    </h2>
                                    <p className="text-blue-800 leading-relaxed">
                                        {job.applicationProcess}
                                    </p>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Job Summary */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    Job Summary
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Job Category</span>
                                        <span className="font-semibold text-gray-900">
                                            {job.categoryId.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Employment Type</span>
                                        <span className="font-semibold text-gray-900">
                                            {job.typeId.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Experience Level</span>
                                        <span className="font-semibold text-gray-900">
                                            {job.experienceLevel}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Work Arrangement</span>
                                        <span className="font-semibold text-gray-900">
                                            {job.workArrangement}
                                        </span>
                                    </div>
                                    {job.startDate && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Start Date</span>
                                            <span className="font-semibold text-gray-900">
                                                {formatDate(job.startDate)}
                                            </span>
                                        </div>
                                    )}
                                    {job.duration && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Duration</span>
                                            <span className="font-semibold text-gray-900">
                                                {job.duration}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Company Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    About the Company
                                </h3>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-xl flex items-center justify-center text-2xl">
                                        {job.employerId.logoUrl ? (
                                            <img
                                                src={serverUrl + job.employerId.logoUrl}
                                                alt={job.employerId.companyName}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <span className="text-2xl">
                                                {job.employerId.companyName.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {job.employerId.companyName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {job.employerId.companySize} employees
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    {job.employerId.companyDescription}
                                </p>
                                {job.employerId.website && (
                                    <a
                                        href={job.employerId.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        Visit Company Website
                                        <ExternalLink className="w-4 h-4 ml-1" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {showApplicationModal && (
                <ApplicationModal
                    isOpen={showApplicationModal}
                    onClose={() => setShowApplicationModal(false)}
                    onSubmit={handleApplicationSubmit}
                    jobId={jobId}
                />
            )}

            {/* Scroll to Top Button */}
            {showScrollToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 z-50"
                    title="Scroll to top"
                >
                    <ArrowUp className="w-6 h-6" />
                </button>
            )}
        </>
    );
};

export default JobDetailPage;
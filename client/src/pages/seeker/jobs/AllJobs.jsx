import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { jobPostAPI } from '@/services/jobPostAPI';
import JobCard from '@/components/jobposts/JobCard';
import { useNavigate } from 'react-router-dom';


const JobListingsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Load all jobs
    useEffect(() => {
        loadJobPosts();
    }, []);

    const loadJobPosts = async () => {
        setLoading(true);
        try {
            const result = await jobPostAPI.getAllJobs();
            console.log('Job response : ', result);
            if (result.success) {
                setJobs(result.data);
            } else {
                console.error('Failed to load jobs:', result.error);
            }

            const savedJobResult = await jobPostAPI.getSavedJobs();
            if (savedJobResult.success) {
                const savedJobs = savedJobResult.data;
                setJobs(prevJobs => prevJobs.map(job => ({
                    ...job,
                    isSaved: savedJobs.some(savedJob => savedJob._id === job._id)
                })));
                console.log('Saved jobs loadded');
            }
            else {
                console.error('Failed to load jobs:', result.error);
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const jobsPerPage = 6;
    const totalPages = Math.ceil(jobs.length / jobsPerPage);
    const currentJobs = jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
    const handleJobClick = (jobId) => {
        navigate(`/jobseeker/jobs/${jobId}`);
    };

    const handleApply = (jobId) => {
        alert(`Applied to job ${jobId}. This will integrate with your application system.`);
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
                            <h1 className="text-3xl font-bold text-gray-900">All Jobs</h1>
                            <p className="text-gray-600 mt-1">Discover amazing opportunities tailored for you</p>
                        </div>
                        <div className="text-sm text-gray-500">
                            Showing {(currentPage - 1) * jobsPerPage + 1}-{Math.min(currentPage * jobsPerPage, jobs.length)} of {jobs.length} jobs
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Cards Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {currentJobs.map((job) => (
                        <JobCard key={job._id} job={job} onClick={() => handleJobClick(job._id)} onApply={handleApply} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center mt-12 space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 rounded-lg font-medium ${currentPage === index + 1
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobListingsPage;
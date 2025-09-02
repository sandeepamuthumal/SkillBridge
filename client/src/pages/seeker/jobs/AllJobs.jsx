import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    X,
    MapPin,
    Briefcase,
    DollarSign,
    Clock,
    Building2,
    ChevronDown
} from 'lucide-react';
import { jobPostAPI } from '@/services/jobPostAPI';
import JobCard from '@/components/jobposts/JobCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApplicationModal from '../applications/components/ApplicationModal';
import { applicationAPI } from '@/services/jobseeker/applicationAPI';
import { seekerProfileAPI } from '@/services/jobseeker/seekerProfileAPI';

const JobListingsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    
    // Filter options from API
    const [cities, setCities] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [jobCategories, setJobCategories] = useState([]);
    
    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        cityId: '',
        typeId: '',
        categoryId: '',
        experienceLevel: '',
        workArrangement: '',
        minSalary: '',
        maxSalary: ''
    });
    
    const navigate = useNavigate();
    const location = useLocation();

    const experienceLevels = [
        'Entry Level',
        'Mid Level',
        'Senior Level',
        'Executive Level'
    ];

    const workArrangements = [
        'Remote',
        'On-site',
        'Hybrid'
    ];

    // Load filter options
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const [citiesRes, jobTypesRes, jobCategoriesRes] = await Promise.all([
                    seekerProfileAPI.getCities(),
                    seekerProfileAPI.getJobTypes(),
                    seekerProfileAPI.getJobCategories()
                ]);
                
                setCities(citiesRes.data || []);
                setJobTypes(jobTypesRes.data || []);
                setJobCategories(jobCategoriesRes.data || []);
            } catch (err) {
                toast.error("Failed to load filter options");
                console.error("Filter options load failed", err);
            }
        };
        
        loadFilterOptions();
    }, []);

    // Initialize filters from URL params
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const newFilters = {
            search: searchParams.get('search') || '',
            cityId: searchParams.get('cityId') || '',
            typeId: searchParams.get('typeId') || '',
            categoryId: searchParams.get('categoryId') || '',
            experienceLevel: searchParams.get('experienceLevel') || '',
            workArrangement: searchParams.get('workArrangement') || '',
            minSalary: searchParams.get('minSalary') || '',
            maxSalary: searchParams.get('maxSalary') || ''
        };
        setFilters(newFilters);
    }, [location.search]);

    // Load jobs when filters change
    useEffect(() => {
        loadJobPosts();
    }, [filters]);

    const loadJobPosts = async () => {
        setLoading(true);
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    queryParams.append(key, filters[key]);
                }
            });

            const result = await jobPostAPI.getAllJobs(queryParams.toString());
            console.log('Job response:', result);
            
            if (result.success) {
                setJobs(result.data);
                setFilteredJobs(result.data);
            } else {
                console.error('Failed to load jobs:', result.error);
                setJobs([]);
                setFilteredJobs([]);
            }

            // Load saved jobs
            const savedJobResult = await jobPostAPI.getSavedJobs();
            if (savedJobResult.success) {
                const savedJobs = savedJobResult.data;
                setJobs(prevJobs => prevJobs.map(job => ({
                    ...job,
                    isSaved: savedJobs.some(savedJob => savedJob._id === job._id)
                })));
                setFilteredJobs(prevJobs => prevJobs.map(job => ({
                    ...job,
                    isSaved: savedJobs.some(savedJob => savedJob._id === job._id)
                })));
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setCurrentPage(1);
        
        // Update URL
        const searchParams = new URLSearchParams();
        Object.keys(newFilters).forEach(filterKey => {
            if (newFilters[filterKey]) {
                searchParams.append(filterKey, newFilters[filterKey]);
            }
        });
        
        const queryString = searchParams.toString();
        navigate(`${location.pathname}${queryString ? `?${queryString}` : ''}`, { replace: true });
    };

    const handleResetFilters = () => {
        const resetFilters = {
            search: '',
            cityId: '',
            typeId: '',
            categoryId: '',
            experienceLevel: '',
            workArrangement: '',
            minSalary: '',
            maxSalary: ''
        };
        setFilters(resetFilters);
        setCurrentPage(1);
        navigate(location.pathname, { replace: true });
    };

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter(value => value !== '').length;
    };

    const jobsPerPage = 4;
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

    const handleJobClick = (jobId) => {
        navigate(`/jobseeker/jobs/${jobId}`);
    };

    const handleApply = (job) => {
        setShowApplicationModal(true);
        setSelectedJobForApplication(job);
    };

    const handleApplicationSubmit = async (applicationData) => {
        try {
            const response = await applicationAPI.submitJobApplication(applicationData);
            if (response.success) {
                toast.success('Application submitted successfully!');
                setShowApplicationModal(false);
                setSelectedJobForApplication(null);
                loadJobPosts();
            } else {
                toast.error(response.error);
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error('Failed to submit application. Please try again.');
        }
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
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filters</span>
                                {getActiveFiltersCount() > 0 && (
                                    <span className="bg-blue-800 text-white rounded-full px-2 py-0.5 text-xs">
                                        {getActiveFiltersCount()}
                                    </span>
                                )}
                            </button>
                            <div className="text-sm text-gray-500">
                                Showing {(currentPage - 1) * jobsPerPage + 1}-{Math.min(currentPage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Search */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        placeholder="Job title or skills..."
                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={filters.cityId}
                                        onChange={(e) => handleFilterChange('cityId', e.target.value)}
                                        className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="">All Cities</option>
                                        {cities.map((city) => (
                                            <option key={city._id} value={city._id}>{city.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Job Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={filters.categoryId}
                                        onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                                        className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="">All Categories</option>
                                        {jobCategories.map((category) => (
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Job Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={filters.typeId}
                                        onChange={(e) => handleFilterChange('typeId', e.target.value)}
                                        className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="">All Types</option>
                                        {jobTypes.map((type) => (
                                            <option key={type._id} value={type._id}>{type.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Experience Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={filters.experienceLevel}
                                        onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                                        className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="">All Levels</option>
                                        {experienceLevels.map((level) => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Work Arrangement */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Style</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={filters.workArrangement}
                                        onChange={(e) => handleFilterChange('workArrangement', e.target.value)}
                                        className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="">All Arrangements</option>
                                        {workArrangements.map((arrangement) => (
                                            <option key={arrangement} value={arrangement}>{arrangement}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Salary Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        value={filters.minSalary}
                                        onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                                        placeholder="Min salary"
                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        value={filters.maxSalary}
                                        onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                                        placeholder="Max salary"
                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleResetFilters}
                                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Reset Filters</span>
                                </button>
                                {getActiveFiltersCount() > 0 && (
                                    <span className="text-sm text-gray-600">
                                        {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Cards Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Briefcase className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
                        <button
                            onClick={handleResetFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {currentJobs.map((job) => (
                                <JobCard 
                                    key={job._id} 
                                    job={job} 
                                    onClick={() => handleJobClick(job._id)} 
                                    onApply={handleApply} 
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
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
                        )}
                    </>
                )}
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

export default JobListingsPage;
import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Clock,
    DollarSign,
    Users,
    Calendar,
    Briefcase,
    Eye,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Building2,
    Star,
    CheckCircle,
    Timer,
    Target,
    Bookmark,
    BookmarkCheck
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockJobs = [
    {
        _id: '1',
        title: 'Frontend Developer Intern',
        description: 'Join our dynamic startup as a Frontend Developer Intern and gain hands-on experience building modern web applications using React, TypeScript, and cutting-edge technologies.',
        responsibilities: [
            'Develop responsive web applications using React and TypeScript',
            'Collaborate with design team to implement UI/UX designs',
            'Write clean, maintainable code following best practices',
            'Participate in code reviews and team meetings'
        ],
        requirements: [
            'Currently pursuing Computer Science or related degree',
            'Basic knowledge of HTML, CSS, and JavaScript',
            'Familiarity with React framework',
            'Strong problem-solving skills'
        ],
        preferredSkills: ['TypeScript', 'Tailwind CSS', 'Git', 'Figma'],
        experienceLevel: 'Entry Level',
        experienceYears: { min: 0, max: 1 },
        employerId: {
            name: 'TechStart Solutions',
            logo: '🚀',
            companySize: '10-50'
        },
        categoryId: { name: 'Software Development' },
        typeId: { name: 'Internship' },
        cityId: { name: 'Colombo' },
        salaryRange: {
            min: 25000,
            max: 35000,
            currency: 'LKR',
            negotiable: false
        },
        benefits: ['Flexible hours', 'Learning opportunities', 'Mentorship'],
        workArrangement: 'Hybrid',
        deadline: new Date('2025-08-15'),
        status: 'Published',
        applicationCount: 15,
        viewCount: 142,
        featured: true,
        tags: ['React', 'JavaScript', 'Internship'],
        createdAt: new Date('2025-07-20')
    },
    {
        _id: '2',
        title: 'UI/UX Design Intern',
        description: 'Looking for a creative UI/UX Design Intern to join our product team and help create amazing user experiences for our mobile and web applications.',
        responsibilities: [
            'Create wireframes and prototypes for new features',
            'Conduct user research and usability testing',
            'Design user interfaces for web and mobile platforms',
            'Collaborate with developers to ensure design implementation'
        ],
        requirements: [
            'Portfolio showcasing design projects',
            'Proficiency in Figma or Adobe XD',
            'Understanding of design principles',
            'Strong communication skills'
        ],
        preferredSkills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
        experienceLevel: 'Entry Level',
        experienceYears: { min: 0, max: 2 },
        employerId: {
            name: 'Design Hub',
            logo: '🎨',
            companySize: '5-25'
        },
        categoryId: { name: 'Design' },
        typeId: { name: 'Internship' },
        cityId: { name: 'Kandy' },
        salaryRange: {
            min: 20000,
            max: 30000,
            currency: 'LKR',
            negotiable: true
        },
        benefits: ['Creative freedom', 'Portfolio building', 'Design tools access'],
        workArrangement: 'Remote',
        deadline: new Date('2025-08-20'),
        status: 'Published',
        applicationCount: 8,
        viewCount: 89,
        featured: false,
        tags: ['Design', 'UI/UX', 'Figma'],
        createdAt: new Date('2025-07-22')
    },
    {
        _id: '3',
        title: 'Marketing Assistant',
        description: 'Join our marketing team as a part-time Marketing Assistant to help with digital marketing campaigns, content creation, and social media management.',
        responsibilities: [
            'Assist in creating marketing content',
            'Manage social media accounts',
            'Support email marketing campaigns',
            'Analyze marketing metrics and prepare reports'
        ],
        requirements: [
            'Strong written communication skills',
            'Basic knowledge of social media platforms',
            'Interest in digital marketing',
            'Ability to work independently'
        ],
        preferredSkills: ['Canva', 'Google Analytics', 'Content Writing', 'Social Media'],
        experienceLevel: 'Entry Level',
        experienceYears: { min: 0, max: 1 },
        employerId: {
            name: 'Marketing Pro',
            logo: '📈',
            companySize: '25-100'
        },
        categoryId: { name: 'Marketing' },
        typeId: { name: 'Part-time' },
        cityId: { name: 'Galle' },
        salaryRange: {
            min: 15000,
            max: 25000,
            currency: 'LKR',
            negotiable: false
        },
        benefits: ['Flexible schedule', 'Marketing training', 'Performance bonus'],
        workArrangement: 'Hybrid',
        deadline: new Date('2025-08-10'),
        status: 'Published',
        applicationCount: 12,
        viewCount: 76,
        featured: false,
        tags: ['Marketing', 'Social Media', 'Part-time'],
        createdAt: new Date('2025-07-18')
    }
];

const JobListingsPage = () => {
    const [jobs, setJobs] = useState(mockJobs);
    const [selectedJob, setSelectedJob] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const jobsPerPage = 6;
    const totalPages = Math.ceil(jobs.length / jobsPerPage);
    const currentJobs = jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
    const handleJobClick = (job) => {
        setSelectedJob(job);
    };

    const handleApply = (jobId) => {
        alert(`Applied to job ${jobId}. This will integrate with your application system.`);
    };

    if (selectedJob) {
        return <JobDetailView job={selectedJob} onBack={() => setSelectedJob(null)} onApply={handleApply} />;
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
                        <JobCard key={job._id} job={job} onClick={() => handleJobClick(job)} />
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

const JobCard = ({ job, onClick }) => {
    const formatSalary = (min, max, currency) => {
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    };

    const getDaysLeft = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    const daysLeft = getDaysLeft(job.deadline);
    const [isSaved, setIsSaved] = useState(false);

    const handleApplyClick = (e) => {
        e.stopPropagation();
        alert(`Quick apply to ${job.title}. This will integrate with your application system.`);
    };

    const handleSaveClick = (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        // Here you would typically make an API call to save/unsave the job
        console.log(`${isSaved ? 'Unsaved' : 'Saved'} job: ${job.title}`);
    };

    return (
        <div
            className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group overflow-hidden relative"
        >
            {/* Save Button - Top Right */}
            <button
                onClick={handleSaveClick}
                className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all duration-300 ${isSaved
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                    } group-hover:shadow-lg`}
                title={isSaved ? 'Remove from saved jobs' : 'Save this job'}
            >
                {isSaved ? (
                    <BookmarkCheck className="w-4 h-4" />
                ) : (
                    <Bookmark className="w-4 h-4" />
                )}
            </button>

            <div className="p-6 pr-16">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                            {job.employerId.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1 cursor-pointer" onClick={onClick}>
                                {job.title}
                            </h3>
                            <p className="text-sm font-medium text-gray-600 mb-2">{job.employerId.name}</p>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{job.cityId.name}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{job.workArrangement}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {job.featured && (
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm mr-12">
                            ⭐ Featured
                        </div>
                    )}
                </div>

                {/* Salary & Job Type */}
                <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-lg text-gray-900">
                            {formatSalary(job.salaryRange.min, job.salaryRange.max, job.salaryRange.currency)}
                        </span>
                        {job.salaryRange.negotiable && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Negotiable</span>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {job.typeId.name}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            {job.experienceLevel}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 cursor-pointer" onClick={onClick}>
                    {job.description.length > 130 ? job.description.substring(0, 130) + '...' : job.description}
                </p>

                {/* Skills Tags */}
                <div className="mb-5">
                    <div className="flex flex-wrap gap-2">
                        {job.tags.slice(0, 4).map((tag, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium border border-blue-100">
                                {tag}
                            </span>
                        ))}
                        {job.tags.length > 4 && (
                            <span className="text-gray-500 text-xs bg-gray-50 px-2 py-1 rounded-lg">
                                +{job.tags.length - 4} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-5 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span className="font-medium">{job.viewCount} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">{job.applicationCount} applied</span>
                        </div>
                    </div>
                    <div className={`font-bold text-sm ${daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleApplyClick}
                        disabled={daysLeft <= 0}
                        className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${daysLeft <= 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            }`}
                    >
                        {daysLeft <= 0 ? 'Application Closed' : 'Quick Apply'}
                    </button>
                    <button
                        onClick={onClick}
                        className="px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

const JobDetailView = ({ job, onBack, onApply }) => {
    const formatSalary = (min, max, currency) => {
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysLeft = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    const daysLeft = getDaysLeft(job.deadline);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={onBack}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back to jobs</span>
                    </button>

                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl">
                                {job.employerId.logo}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                <div className="flex items-center space-x-4 text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Building2 className="w-4 h-4" />
                                        <span className="font-medium">{job.employerId.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{job.cityId.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{job.workArrangement}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <button
                                onClick={() => onApply(job._id)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Apply Now
                            </button>
                            <p className={`text-sm mt-2 ${daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                {daysLeft > 0 ? `${daysLeft} days remaining` : 'Application closed'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Job Overview */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Overview</h2>
                            <p className="text-gray-700 leading-relaxed">{job.description}</p>
                        </div>

                        {/* Responsibilities */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
                            <ul className="space-y-3">
                                {job.responsibilities.map((responsibility, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{responsibility}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Requirements */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                            <ul className="space-y-3">
                                {job.requirements.map((requirement, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{requirement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Preferred Skills */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferred Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.preferredSkills.map((skill, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        {job.benefits.length > 0 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {job.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span className="text-gray-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Job Details */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Salary Range</span>
                                    <span className="font-medium">
                                        {formatSalary(job.salaryRange.min, job.salaryRange.max, job.salaryRange.currency)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Experience Level</span>
                                    <span className="font-medium">{job.experienceLevel}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Job Type</span>
                                    <span className="font-medium">{job.typeId.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Category</span>
                                    <span className="font-medium">{job.categoryId.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Work Arrangement</span>
                                    <span className="font-medium">{job.workArrangement}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Application Deadline</span>
                                    <span className="font-medium">{formatDate(job.deadline)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Posted Date</span>
                                    <span className="font-medium">{formatDate(job.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-xl">
                                    {job.employerId.logo}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{job.employerId.name}</h4>
                                    <p className="text-sm text-gray-600">{job.employerId.companySize} employees</p>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                                <ExternalLink className="w-4 h-4" />
                                <span>View Company Profile</span>
                            </button>
                        </div>

                        {/* Application Stats */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">Total Applications</span>
                                    </div>
                                    <span className="font-medium">{job.applicationCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Eye className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">Total Views</span>
                                    </div>
                                    <span className="font-medium">{job.viewCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Timer className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">Days Remaining</span>
                                    </div>
                                    <span className={`font-medium ${daysLeft <= 3 ? 'text-red-600' : daysLeft <= 7 ? 'text-orange-600' : 'text-green-600'
                                        }`}>
                                        {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobListingsPage;
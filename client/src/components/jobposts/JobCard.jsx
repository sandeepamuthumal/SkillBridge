import React, { useState } from 'react'
import {
    MapPin,
    DollarSign,
    Users,
    Briefcase,
    Eye,
    Bookmark,
    BookmarkCheck
} from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { jobPostAPI } from '@/services/jobPostAPI';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const JobCard = ({ job, onClick, onApply }) => {
    const { isAuthenticated } = useAuth();
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();

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
    const [isSaved, setIsSaved] = useState(job.isSaved);

    const handleSaveClick = async (e) => {
        if (!isAuthenticated) {
            toast.error('You must be signed in to save a job.');
            navigate('/signin', { state: { from: window.location.pathname } });
            return;
        }

        e.stopPropagation();
        setIsSaved(!isSaved);

        try {
            if(isSaved){
                await jobPostAPI.unsaveJobPost(job._id);
            }
            else{
                await jobPostAPI.saveJobPost(job._id);
            }
        } catch (error) {
            console.log(error);
        }
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
                            {job.employerId.logoUrl ? (
                                <img src={serverUrl + job.employerId.logoUrl} alt={job.employerId.companyName} className="w-10 h-10 rounded-full" />
                            ) : (
                                <span className="text-3xl">{job.employerId.companyName.charAt(0)}</span>
                            )
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1 cursor-pointer" onClick={onClick}>
                                {job.title}
                            </h3>
                            <p className="text-sm font-medium text-gray-600 mb-2">{job.employerId.companyName}</p>
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
                        onClick={() => onApply(job)}
                        disabled={daysLeft <= 0}
                        className={`flex-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${daysLeft <= 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            }`}
                    >
                        {daysLeft <= 0 ? 'Application Closed' : 'Apply Now'}
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

export default JobCard
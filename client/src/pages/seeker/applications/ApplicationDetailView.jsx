import React, { useState } from "react";
import {
  Eye,
  Trash2,
  Download,
  Calendar,
  CheckCircle,
  TrendingUp,
  User,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Clock,
  UserCheck,
  UserX,
  MessageSquare,
  X,
  Send,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import StatusUpdateModal from "./components/StatusUpdateModal";
import { applicationAPI } from "@/services/employer/applicationAPI";
import { toast } from "react-toastify";

// Quick Action Buttons Component
const QuickActionButtons = ({ currentStatus, onStatusUpdate, isLoading }) => {
  const getQuickActions = (status) => {
    const actions = {
      "Applied": [
        { status: "Under Review", label: "Start Review", color: "blue", icon: Eye },
        { status: "Rejected", label: "Reject", color: "red", icon: UserX }
      ],
      "Under Review": [
        { status: "Shortlisted", label: "Shortlist", color: "green", icon: UserCheck },
        { status: "Rejected", label: "Reject", color: "red", icon: UserX }
      ],
      "Shortlisted": [
        { status: "Interview Scheduled", label: "Schedule Interview", color: "purple", icon: Calendar },
        { status: "Rejected", label: "Reject", color: "red", icon: UserX }
      ],
      "Interview Scheduled": [
        { status: "Interview Completed", label: "Mark Completed", color: "green", icon: CheckCircle }
      ],
      "Interview Completed": [
        { status: "Offer Extended", label: "Extend Offer", color: "green", icon: TrendingUp },
        { status: "Rejected", label: "Reject", color: "red", icon: UserX }
      ]
    };
    return actions[status] || [];
  };

  const quickActions = getQuickActions(currentStatus);

  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    green: "bg-green-600 hover:bg-green-700 text-white", 
    purple: "bg-purple-600 hover:bg-purple-700 text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
    gray: "bg-gray-600 hover:bg-gray-700 text-white"
  };

  if (quickActions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {quickActions.map((action) => (
        <button
          key={action.status}
          onClick={() => onStatusUpdate({ status: action.status, comment: "" })}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${colorClasses[action.color]}`}
        >
          <action.icon size={16} />
          {action.label}
        </button>
      ))}
    </div>
  );
};

const ApplicationDetailView = ({ application, onBack, loadData }) => {
  const job = application.jobPostId;
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const { user } = useAuth();
  
  // State for status updates
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(application);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusColors = {
    Applied: "bg-blue-100 text-blue-800",
    "Under Review": "bg-yellow-100 text-yellow-800",
    Shortlisted: "bg-green-100 text-green-800",
    "Interview Scheduled": "bg-purple-100 text-purple-800",
    "Interview Completed": "bg-indigo-100 text-indigo-800",
    "Assessment Pending": "bg-orange-100 text-orange-800",
    "Reference Check": "bg-cyan-100 text-cyan-800",
    "Offer Extended": "bg-emerald-100 text-emerald-800",
    "Offer Accepted": "bg-green-200 text-green-900",
    "Offer Declined": "bg-gray-100 text-gray-800",
    "Rejected": "bg-red-100 text-red-800",
    Withdrawn: "bg-gray-100 text-gray-800",
  };

  // Handle status update
  const handleStatusUpdate = async ({ status, comment }) => {
    setIsUpdating(true);
    try {
      // Make API call to update status
      const response = await applicationAPI.updateApplicationStatus(currentApplication._id, {
        status,
        notes:comment
      });
    
      if (response.success) {
        onBack();
        loadData(); // Refresh the application list
        setIsModalOpen(false);
        // You might want to show a success toast here

        toast.success('Application status updated successfully');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Show error message to user
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Button>

          <div className="flex items-start justify-between">
            {user && user.role == "Job Seeker" && (
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                  {job.employerId.logoUrl ? (
                    <img
                      src={serverUrl + job.employerId.logoUrl}
                      alt={job.employerId.companyName}
                      className="w-8 h-8"
                    />
                  ) : (
                    job.employerId.companyName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-2">
                    {job.employerId.name}
                  </p>
                  <p className="text-gray-500">
                    Applied on {formatDate(currentApplication.appliedDate)}
                  </p>
                </div>
              </div>
            )}

            {user && user.role != "Job Seeker" && (
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                  {currentApplication.jobSeekerId.profilePictureUrl ? (
                    <img
                      src={serverUrl + currentApplication.jobSeekerId.profilePictureUrl}
                      alt={currentApplication.jobSeekerId.userId.firstName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    currentApplication.jobSeekerId.userId.firstName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentApplication.jobSeekerId.userId.firstName}{" "}
                    {currentApplication.jobSeekerId.userId.lastName}
                  </h1>
                  <p className="text-xl text-gray-600 mb-2">
                    {job.title}
                  </p>
                  <p className="text-gray-500">
                    Applied on {formatDate(currentApplication.appliedDate)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Badge className={statusColors[currentApplication.status]}>
                {currentApplication.status}
              </Badge>
            </div>
          </div>

          {/* Action Buttons for Employers */}
          {user && user.role !== "Job Seeker" && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Actions:</h3>
                <QuickActionButtons 
                  currentStatus={currentApplication.status}
                  onStatusUpdate={handleStatusUpdate}
                  isLoading={isUpdating}
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isUpdating}
              >
                <MessageSquare size={16} />
                Update Status
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Sidebar */}
          <div className="space-y-6 h-full">
            {/* Application Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Application Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application ID</span>
                  <span className="font-medium text-gray-900">
                    #{currentApplication._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applicant Name</span>
                  <span className="font-medium text-gray-900">
                    {currentApplication.jobSeekerId.userId.firstName}{" "}
                    {currentApplication.jobSeekerId.userId.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applied Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(currentApplication.appliedDate)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Current Status</span>
                  <span className="font-medium text-gray-900">
                    <Badge
                      className={statusColors[currentApplication.status]}
                      variant="outline"
                    >
                      {currentApplication.status}
                    </Badge>
                  </span>
                </div>

                {/* Links for Resume and Cover Letter */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Resume</span>
                  <a
                    href={serverUrl + currentApplication.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    View
                  </a>
                </div>
                {currentApplication.coverLetterUrl && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cover Letter</span>
                    <a
                      href={currentApplication.coverLetterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      View
                    </a>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Additional Notes</span>
                  <span className="font-medium text-gray-900">
                    {currentApplication.additionalNotes
                      ? currentApplication.additionalNotes
                      : "N/A"}
                  </span>
                </div>

                {user && user.role != "Job Seeker" && (
                  <Link to={`/jobseeker/jobs/${job._id}`} target="_blank">
                    <button className="w-full mt-3 flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold border-2 border-blue-200 rounded-xl py-3 hover:bg-blue-50 transition-all duration-300">
                      <ExternalLink className="w-4 h-4" />
                      <span>View Seeker Profile</span>
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Job Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Job Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job ID</span>
                  <span className="font-medium text-gray-900">
                    #{job._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Title</span>
                  <span className="font-medium text-gray-900">{job.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Company</span>
                  <span className="font-medium text-gray-900">
                    {job.employerId.companyName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-gray-900">
                    {job.cityId.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-medium text-gray-900">
                    {job.typeId.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary</span>
                  <span className="font-medium text-gray-900">
                    {job.salaryRange.currency}{" "}
                    {job.salaryRange.min.toLocaleString()} -{" "}
                    {job.salaryRange.max.toLocaleString()}
                  </span>
                </div>
              </div>
              <Link to={`/jobseeker/jobs/${job._id}`} target="_blank">
                <button className="w-full mt-3 flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold border-2 border-blue-200 rounded-xl py-3 hover:bg-blue-50 transition-all duration-300">
                  <ExternalLink className="w-4 h-4" />
                  <span>View Job Post</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Application Status Timeline */}
        {currentApplication.statusHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Application Timeline
            </h2>
            <div className="space-y-4">
              {currentApplication.statusHistory.map((status, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index === 0 ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {status.status}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(status.updatedAt)}
                      </span>
                    </div>
                    {status.notes && (
                      <p className="text-gray-600 mt-1">{status.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interviews */}
        {currentApplication.interviews.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Interviews</h2>
            <div className="space-y-4">
              {currentApplication.interviews.map((interview, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          interview.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : interview.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : interview.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {interview.status}
                      </Badge>
                      <span className="font-semibold text-gray-900">
                        {interview.type} Interview
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {interview.duration} minutes
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateTime(interview.scheduledDate)}</span>
                    </div>
                    {interview.interviewer && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{interview.interviewer}</span>
                      </div>
                    )}
                    {interview.notes && (
                      <p className="text-sm text-gray-700 mt-2">
                        {interview.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentStatus={currentApplication.status}
        onUpdateStatus={handleStatusUpdate}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default ApplicationDetailView;
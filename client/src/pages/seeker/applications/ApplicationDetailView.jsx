import React from "react";
import {
  Eye,
  Trash2,
  Download,
  Calendar,
  CheckCircle,
  TrendingUp,
  User,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ApplicationDetailView = ({ application, onBack }) => {
  const job = application.jobPostId;
  const serverUrl = import.meta.env.VITE_SERVER_URL;

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
    Rejected: "bg-red-100 text-red-800",
    Withdrawn: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Button>

          <div className="flex items-start justify-between">
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
                  Applied on {formatDate(application.appliedDate)}
                </p>
              </div>
            </div>

            <Badge className={statusColors[application.status]}>
              {application.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Application Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Application ID</span>
                  <span className="font-medium text-gray-900">
                    #{application._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applied Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(application.appliedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Status</span>
                  <span className="font-medium text-gray-900">
                    {application.status}
                  </span>
                </div>
                {application.matchingScore && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Match Score</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {application.matchingScore}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            application.matchingScore >= 80
                              ? "bg-green-500"
                              : application.matchingScore >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${application.matchingScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Job Summary
              </h3>
              <div className="space-y-3">
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
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Application Status Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Application Timeline
              </h2>
              <div className="space-y-4">
                {application.statusHistory.map((status, index) => (
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

            {/* Cover Letter */}
            {application.coverLetterText && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Cover Letter
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {application.coverLetterText}
                  </p>
                </div>
              </div>
            )}

            {/* Interviews */}
            {application.interviews.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Interviews
                </h2>
                <div className="space-y-4">
                  {application.interviews.map((interview, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailView;

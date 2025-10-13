import React, { useState, useEffect, use } from 'react';
import {
  Users,
  Briefcase,
  Eye,
  MessageCircle,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  Star,
  Building2,
  Search,
  Filter,
  TrendingUp,
  Award,
  Target,
  RefreshCw
} from 'lucide-react';
import { employerProfileAPI } from '@/services/employer/employerProfileAPI';
import { fi } from 'date-fns/locale';
import { format } from 'date-fns';

const EmployerDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentApplications, setRecentApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const stats = await employerProfileAPI.getDashboardStats();
      console.log("Stats response:", stats.data);
      setStats(stats.data);
      setRecentApplications(stats.data.recentApplications);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
    setIsLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interview Scheduled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'shortlisted':
        return <UserCheck className="w-4 h-4" />;
      case 'interviewed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if(isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.allJobCount}</h3>
          <p className="text-sm text-gray-600 mb-2">Total Job Posts</p>
          <div className="flex items-center text-green-600 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+{stats.thisMonthJobs} this month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-yellow-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalApplications}</h3>
          <p className="text-sm text-gray-600 mb-2">Total Applications</p>
          <div className="flex items-center text-yellow-600 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>{stats.pendingApplications} pending review</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.jobPostViewSum}</h3>
          <p className="text-sm text-gray-600 mb-2">Job Views</p>
          <div className="flex items-center text-green-600 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Total job views</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.responseRate}%</h3>
          <p className="text-sm text-gray-600 mb-2">Response Rate</p>
          <div className="flex items-center text-purple-600 text-sm">
            <Award className="w-4 h-4 mr-1" />
            <span>Above average</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              </div>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
                <span className="text-sm font-medium">View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading recent applications...</p>
                </div>
              ) : (
                recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {application.jobSeekerId.profilePictureUrl ? (
                        <img
                          src={serverUrl + application.jobSeekerId.profilePictureUrl}
                          alt={application.jobSeekerId.userId.firstName}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        application.jobSeekerId.userId.firstName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{application.jobSeekerId?.userId?.firstName + ' ' + application.jobSeekerId?.userId?.lastName}</h3>
                        
                        <span className={`px-2 py-1 flex items-center rounded-full text-xs ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{application.jobPostId.title}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{application.jobSeekerId.fieldOfStudy}</span>
                        <span>•</span>
                        <span>{application.appliedDate ? format(new Date(application.appliedDate), "PPP") : "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                        View
                      </button>
                    </div>
                  </div>
                ))
              )}
             
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">⚡ Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100" >
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-blue-900">Post New Job</p>
                <p className="text-sm text-blue-600">Create a new job posting</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border border-green-100">
              <div className="bg-green-600 p-2 rounded-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-green-900">Find Candidates</p>
                <p className="text-sm text-green-600">Browse candidate profiles</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-100">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-purple-900">Update Profile</p>
                <p className="text-sm text-purple-600">Manage company info</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors border border-orange-100">
              <div className="bg-orange-600 p-2 rounded-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-orange-900">Give Feedback</p>
                <p className="text-sm text-orange-600">Rate job seekers</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;

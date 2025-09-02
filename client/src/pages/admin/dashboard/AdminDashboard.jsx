import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  TrendingUp,
  FileText,
  Clock,
  Plus,
  ArrowRight,
  Shield,
  Zap,
  RefreshCw,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminDashboardAPI } from "@/services/adminDashboardAPI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminDashboardAPI.getDashboardOverview();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          console.error("Failed to fetch admin dashboard data:", response.error);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load dashboard data. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { stats, recentJobPosts } = dashboardData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <div className="flex items-center mt-1">
                <Users className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-600 font-medium">
                  {stats.totalJobSeekers} Seekers, {stats.totalEmployers} Employers
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Job Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingJobPosts}</p>
              <p className="text-sm text-yellow-600 font-medium">Awaiting approval</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Job Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeJobPosts}</p>
              <p className="text-sm text-green-600 font-medium">Currently live on platform</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
              <p className="text-sm text-purple-600 font-medium">Platform-wide total</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="hover:shadow-lg transition-all duration-300 h-auto">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Pending Job Posts</CardTitle>
              <Link to="/admin/jobs/pending">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentJobPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentJobPosts.map((job) => (
                    <Link to={`/admin/jobs/${job._id}`} key={job._id}>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.employerId?.companyName || 'N/A'}</p>
                          <p className="text-xs text-gray-500 mt-1">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="warning" className="text-yellow-800 bg-yellow-100">
                            Pending
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{job.applicationCount} Applicants</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                  <p>No pending job posts found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button asChild className="w-full h-auto justify-start px-4 py-3">
                  <Link to="/admin/users">
                    <Users className="w-4 h-4 mr-3 mt-0.5" />
                    <div className="text-left leading-tight">
                      <div className="font-medium">Manage Users</div>
                      <div className="text-xs opacity-60">View, update, and deactivate accounts</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-auto justify-start px-4 py-3">
                  <Link to="/admin/jobs/pending">
                    <Briefcase className="w-4 h-4 mr-3 mt-0.5" />
                    <div className="text-left leading-tight">
                      <div className="font-medium">Approve Job Posts</div>
                      <div className="text-xs opacity-60">Review new job submissions</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-auto justify-start px-4 py-3">
                  <Link to="/admin/reports/jobs">
                    <Eye className="w-4 h-4 mr-3 mt-0.5" />
                    <div className="text-left leading-tight">
                      <div className="font-medium">View Job Analytics</div>
                      <div className="text-xs opacity-60">Gain insights into platform activity</div>
                    </div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-auto justify-start px-4 py-3">
                  <Link to="/admin/admins">
                    <Shield className="w-4 h-4 mr-3 mt-0.5" />
                    <div className="text-left leading-tight">
                      <div className="font-medium">Manage Admins</div>
                      <div className="text-xs opacity-60">Add or manage admin accounts</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
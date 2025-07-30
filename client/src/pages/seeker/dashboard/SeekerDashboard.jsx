import React, { useState, useEffect } from "react";
import {
  Search,
  Briefcase,
  TrendingUp,
  Calendar,
  Eye,
  Heart,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Building2,
  DollarSign,
  Users,
  Star,
  ArrowRight,
  Plus,
  Bell,
  Target,
  Award,
  BookOpen,
  Activity,
  BarChart3,
  Zap,
  ExternalLink,
  Send,
  MousePointer,
  Filter,
  Bookmark,
  MessageSquare,
  Sparkles,
  ChevronRight,
  PlayCircle,
  RefreshCw,
  TrendingDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { seekerProfileAPI } from "@/services/jobseeker/seekerProfileAPI";

// Shadcn/ui components
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline:
      "border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:border-blue-300 hover:text-blue-600",
    ghost: "hover:bg-gray-100 text-gray-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Progress = ({ value, className = "" }) => (
  <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
    <div
      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

const Alert = ({ children, className = "" }) => (
  <div className={`relative w-full rounded-lg border p-4 ${className}`}>
    {children}
  </div>
);

// Mock data - Replace with real API calls
const SeekerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // Simulate API call - Replace with real implementation
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await seekerProfileAPI.getDashboardOverview();
        console.log(response);
        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const { user, stats, recentApplications } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mt-2">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalApplications}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      +{stats.weeklyGrowth.applications} this week
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mt-2">
                    Active Applications
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.activeApplications}
                  </p>
                  <p className="text-sm text-yellow-600 font-medium">
                    Awaiting response
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mt-2">
                    Profile Views
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.profileViews}
                  </p>
                  {/* <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      +{stats.weeklyGrowth.profileViews} this week
                    </span>
                  </div> */}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mt-2">
                    Response Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.responseRate}%
                  </p>
                  <p className="text-sm text-purple-600 font-medium">
                    Above average
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion Alert */}
            <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      {user.profileCompletion >= 100 ? "Update" : "Complete"} -{" "}
                      {user.profileCompletion}%
                    </h3>
                    <p className="text-sm text-blue-700">
                      Add portfolio projects to increase your visibility
                    </p>
                  </div>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  <Link to="/jobseeker/profile">
                    {user.profileCompletion >= 100 ? "Update" : "Complete"}
                  </Link>
                </Button>
              </div>
              <Progress value={user.profileCompletion} className="mt-3" />
            </Alert>

            {/* Recent Applications */}
            <Card className="hover:shadow-lg transition-all duration-300 h-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span>Recent Applications</span>
                  </CardTitle>
                  <Link to="/jobseeker/applications">
                    <Button variant="ghost" size="sm">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl flex items-center justify-center text-xl">
                        
                        {application.logo ? (
                          <img
                            src={serverUrl + application.logo}
                            alt={application.company}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <span className="text-3xl">
                            {application.company.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {application.jobTitle}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {application.company}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{application.location}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <DollarSign className="w-3 h-3" />
                            <span>{application.salary}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={application.statusColor}>
                          {application.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {application.appliedDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full h-auto justify-start px-4 py-3"
                  >
                    <Link
                      to="/jobseeker/jobs"
                      className="flex items-start w-full"
                    >
                      <Search className="w-4 h-4 mr-3 mt-0.5" />
                      <div className="text-left leading-tight">
                        <div className="font-medium">Browse Jobs</div>
                        <div className="text-xs opacity-80">
                          Find your perfect match
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-auto justify-start px-4 py-3"
                  >
                    <Link
                      to="/jobseeker/jobs/recommended"
                      className="flex items-start w-full"
                    >
                      <Sparkles className="w-4 h-4 mr-3 mt-0.5" />
                      <div className="text-left leading-tight">
                        <div className="font-medium">AI Recommendations</div>
                        <div className="text-xs opacity-60">
                          Personalized matches
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-auto justify-start px-4 py-3"
                  >
                    <Link
                      to="/jobseeker/profile"
                      className="flex items-start w-full"
                    >
                      <FileText className="w-4 h-4 mr-3 mt-0.5" />
                      <div className="text-left leading-tight">
                        <div className="font-medium">Update Resume</div>
                        <div className="text-xs opacity-60">Keep it fresh</div>
                      </div>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-auto justify-start px-4 py-3"
                  >
                    <Link
                      to="/jobseeker/applications"
                      className="flex items-start w-full"
                    >
                      <BookOpen className="w-4 h-4 mr-3 mt-0.5" />
                      <div className="text-left leading-tight">
                        <div className="font-medium">Track Applications</div>
                        <div className="text-xs opacity-60">
                          Track your application status
                        </div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MousePointer className="w-5 h-5 text-blue-600" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <Heart className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-lg font-bold text-blue-900">
                        {stats.savedJobs}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">Saved Jobs</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <CheckCircle className="w-4 h-4 text-purple-600 mr-1" />
                      <span className="text-lg font-bold text-purple-900">
                        {Math.round(stats.responseRate)}%
                      </span>
                    </div>
                    <p className="text-xs text-purple-700">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;

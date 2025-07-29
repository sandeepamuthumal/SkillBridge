import React, { useState, useEffect } from 'react';
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
  TrendingDown
} from 'lucide-react';

// Shadcn/ui components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const Button = ({ children, variant = "default", size = "default", className = "", onClick, disabled, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline: "border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:border-blue-300 hover:text-blue-600",
    ghost: "hover:bg-gray-100 text-gray-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10"
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
    destructive: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
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

const RecentApplicationsPage = () => {
  return <div>Navigate to My Applications page</div>;
};

// Mock data - Replace with real API calls
const SeekerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate API call - Replace with real implementation
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Replace with: const response = await fetch('/api/dashboard/overview');
        // const data = await response.json();
        
        // Mock API response structure
        const mockData = {
          user: {
            name: "Sandeepa",
            email: "ict22885@fot.sjp.ac.lk",
            profileCompletion: 85,
            lastLogin: "2 hours ago"
          },
          stats: {
            totalApplications: 12,
            activeApplications: 8,
            savedJobs: 15,
            profileViews: 47,
            responseRate: 67.5,
            weeklyGrowth: {
              applications: 2,
              profileViews: 12,
              savedJobs: 3
            }
          },
          recentApplications: [
            {
              id: 1,
              jobTitle: "Frontend Developer Intern",
              company: "TechStart Solutions",
              logo: "🚀",
              appliedDate: "2 days ago",
              status: "Under Review",
              statusColor: "bg-yellow-100 text-yellow-800",
              location: "Colombo",
              salary: "LKR 25,000 - 35,000"
            },
            {
              id: 2,
              jobTitle: "UI/UX Design Intern", 
              company: "Design Hub",
              logo: "🎨",
              appliedDate: "5 days ago",
              status: "Interview Scheduled",
              statusColor: "bg-purple-100 text-purple-800",
              location: "Kandy",
              salary: "LKR 20,000 - 30,000"
            },
            {
              id: 3,
              jobTitle: "Software Engineer Intern",
              company: "CodeCraft Ltd", 
              logo: "💻",
              appliedDate: "1 week ago",
              status: "Offer Extended",
              statusColor: "bg-green-100 text-green-800",
              location: "Colombo",
              salary: "LKR 30,000 - 40,000"
            }
          ],
          recommendedJobs: [
            {
              id: 1,
              title: "React Developer Intern",
              company: "NextGen Tech",
              logo: "⚛️",
              location: "Colombo",
              type: "Internship",
              salary: "LKR 28,000 - 38,000",
              matchScore: 92,
              postedDate: "2 days ago",
              tags: ["React", "JavaScript", "CSS"],
              isHot: true
            },
            {
              id: 2,
              title: "Full Stack Developer",
              company: "Innovation Labs",
              logo: "🔬", 
              location: "Galle",
              type: "Part-time",
              salary: "LKR 35,000 - 45,000",
              matchScore: 88,
              postedDate: "3 days ago",
              tags: ["Node.js", "MongoDB", "React"],
              isHot: false
            },
            {
              id: 3,
              title: "Mobile App Developer",
              company: "AppVenture",
              logo: "📱",
              location: "Kandy", 
              type: "Internship",
              salary: "LKR 25,000 - 35,000",
              matchScore: 85,
              postedDate: "1 week ago",
              tags: ["React Native", "Flutter", "Mobile"],
              isHot: false
            }
          ]
        };

        setTimeout(() => {
          setDashboardData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleRefreshData = async () => {
    setLoading(true);
    // Simulate API refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

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

  const { user, stats, recentApplications, recommendedJobs } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
    

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{stats.weeklyGrowth.applications} this week</span>
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
                  <p className="text-sm font-medium text-gray-600">Active Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeApplications}</p>
                  <p className="text-sm text-yellow-600 font-medium">Awaiting response</p>
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
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.profileViews}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{stats.weeklyGrowth.profileViews} this week</span>
                  </div>
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
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.responseRate}%</p>
                  <p className="text-sm text-purple-600 font-medium">Above average</p>
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
                    <h3 className="font-semibold text-blue-900">Complete Your Profile - {user.profileCompletion}%</h3>
                    <p className="text-sm text-blue-700">Add portfolio projects to increase your visibility</p>
                  </div>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              </div>
              <Progress value={user.profileCompletion} className="mt-3" />
            </Alert>

            {/* Recent Applications */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span>Recent Applications</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl flex items-center justify-center text-xl">
                        {application.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{application.jobTitle}</h4>
                        <p className="text-sm text-gray-600">{application.company}</p>
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
                        <p className="text-xs text-gray-500 mt-1">{application.appliedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommended Jobs */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span>AI Recommended for You</span>
                    <Badge variant="warning" className="bg-yellow-100 text-yellow-800">Smart Match</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-lg flex items-center justify-center text-lg">
                            {job.logo}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{job.title}</h4>
                              {job.isHot && <Badge variant="destructive" className="bg-red-100 text-red-800">🔥 Hot</Badge>}
                            </div>
                            <p className="text-sm text-gray-600">{job.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-900">{job.matchScore}% match</span>
                          </div>
                          <Badge variant="secondary">{job.type}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.postedDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {job.tags.map((tag, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button size="sm">
                          Apply Now
                        </Button>
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
                  <Button className="w-full justify-start text-left">
                    <Search className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Browse Jobs</div>
                      <div className="text-xs opacity-80">Find your perfect match</div>
                    </div>
                  </Button>
                  <Button className="w-full justify-start text-left" variant="outline">
                    <Sparkles className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">AI Recommendations</div>
                      <div className="text-xs opacity-60">Personalized matches</div>
                    </div>
                  </Button>
                  <Button className="w-full justify-start text-left" variant="outline">
                    <FileText className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Update Resume</div>
                      <div className="text-xs opacity-60">Keep it fresh</div>
                    </div>
                  </Button>
                  <Button className="w-full justify-start text-left" variant="outline">
                    <BookOpen className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Skill Assessment</div>
                      <div className="text-xs opacity-60">Boost your profile</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span>Your Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Rate</span>
                    <span className="text-sm font-semibold text-gray-900">{stats.responseRate}%</span>
                  </div>
                  <Progress value={stats.responseRate} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completeness</span>
                    <span className="text-sm font-semibold text-gray-900">{user.profileCompletion}%</span>
                  </div>
                  <Progress value={user.profileCompletion} />
                </div>
                
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Great Performance!</span>
                  </div>
                  <p className="text-xs text-green-700">You're performing well in your job search</p>
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
                      <span className="text-lg font-bold text-blue-900">{stats.savedJobs}</span>
                    </div>
                    <p className="text-xs text-blue-700">Saved Jobs</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <CheckCircle className="w-4 h-4 text-purple-600 mr-1" />
                      <span className="text-lg font-bold text-purple-900">{Math.round(stats.responseRate)}%</span>
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
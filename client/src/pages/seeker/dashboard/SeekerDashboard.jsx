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
  Filter,
  Bell,
  Target,
  Award,
  BookOpen,
  Activity,
  BarChart3,
  Zap,
  ExternalLink
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
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

// Mock data
const mockUser = {
  name: "Sandeepa",
  email: "ict22885@fot.sjp.ac.lk",
  profileCompletion: 85,
  joinDate: "January 2025"
};

const mockStats = {
  totalApplications: 12,
  activeApplications: 8,
  interviewsScheduled: 3,
  savedJobs: 15,
  profileViews: 47,
  matchingJobs: 23
};

const mockRecentApplications = [
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
];

const mockRecommendedJobs = [
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
    tags: ["React", "JavaScript", "CSS"]
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
    tags: ["Node.js", "MongoDB", "React"]
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
    tags: ["React Native", "Flutter", "Mobile"]
  }
];

const mockUpcomingInterviews = [
  {
    id: 1,
    jobTitle: "UI/UX Design Intern",
    company: "Design Hub",
    logo: "🎨",
    date: "July 30, 2025",
    time: "10:00 AM",
    type: "Video Interview",
    interviewer: "Sarah Johnson"
  },
  {
    id: 2,
    jobTitle: "Frontend Developer Intern",
    company: "TechStart Solutions",
    logo: "🚀",
    date: "August 2, 2025",
    time: "2:30 PM",
    type: "Technical Interview",
    interviewer: "Mike Chen"
  }
];

const SeekerDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {mockUser.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">Here's what's happening with your job search today</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Quick Apply
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{mockStats.totalApplications}</p>
                  <p className="text-sm text-green-600 font-medium">+2 this week</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{mockStats.activeApplications}</p>
                  <p className="text-sm text-blue-600 font-medium">In progress</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                  <p className="text-3xl font-bold text-gray-900">{mockStats.interviewsScheduled}</p>
                  <p className="text-sm text-purple-600 font-medium">Next: Tomorrow</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-3xl font-bold text-gray-900">{mockStats.profileViews}</p>
                  <p className="text-sm text-green-600 font-medium">+12 this week</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Complete Your Profile</span>
                  </CardTitle>
                  <Badge variant="default">{mockUser.profileCompletion}% Complete</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={mockUser.profileCompletion} className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Basic Info</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Resume</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Portfolio</span>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Portfolio Projects
                </Button>
              </CardContent>
            </Card>

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
                  {mockRecentApplications.map((application) => (
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

            {/* Recommended Jobs */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>Recommended for You</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecommendedJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-lg flex items-center justify-center text-lg">
                            {job.logo}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{job.title}</h4>
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
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Search className="w-4 h-4 mr-3" />
                    Browse All Jobs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-3" />
                    Update Resume
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="w-4 h-4 mr-3" />
                    Skill Assessment
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-3" />
                    Network Events
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Interviews */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Upcoming Interviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUpcomingInterviews.map((interview) => (
                    <div key={interview.id} className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200 rounded-lg flex items-center justify-center text-sm">
                          {interview.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm">{interview.jobTitle}</h4>
                          <p className="text-xs text-gray-600">{interview.company}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-700">{interview.date} at {interview.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-700">{interview.interviewer}</span>
                        </div>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {interview.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Full Calendar
                </Button>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span>Your Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Application Response Rate</span>
                    <span className="text-sm font-semibold text-gray-900">67%</span>
                  </div>
                  <Progress value={67} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Interview Success Rate</span>
                    <span className="text-sm font-semibold text-gray-900">75%</span>
                  </div>
                  <Progress value={75} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completeness</span>
                    <span className="text-sm font-semibold text-gray-900">{mockUser.profileCompletion}%</span>
                  </div>
                  <Progress value={mockUser.profileCompletion} />
                </div>
                
                <div className="mt-4 p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-1">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Great Progress!</span>
                  </div>
                  <p className="text-xs text-green-700">You're performing better than 78% of job seekers in your field.</p>
                </div>
              </CardContent>
            </Card>

            {/* Learning Resources */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span>Skill Development</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-xl">
                    <h4 className="text-sm font-semibold text-orange-900 mb-1">Recommended Course</h4>
                    <p className="text-xs text-orange-700 mb-2">Advanced React Development</p>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Start Learning
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Skill Assessment</h4>
                    <p className="text-xs text-blue-700 mb-2">Test your JavaScript knowledge</p>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      Take Test
                    </Button>
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

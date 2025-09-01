import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Search,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminReportAPI } from '@/services/adminReportAPI';
import { jobCategoryAPI } from '@/services/jobCategoryAPI';
import { jobTypeAPI } from '@/services/jobTypeAPI';
import ExportButtons from '@/components/admin/reports/ExportButtons';

const JobAnalyticsPage = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    jobType: 'all',
    jobCategory: 'all',
    status: 'all',
    searchTerm: ''
  });

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#34D399'];

  const fetchDependencies = async () => {
    try {
      const [categoriesRes, typesRes] = await Promise.all([
        jobCategoryAPI.getAllCategories(),
        jobTypeAPI.getAllJobTypes()
      ]);
      if (categoriesRes.success) setJobCategories(categoriesRes.data);
      if (typesRes.success) setJobTypes(typesRes.data);
    } catch (err) {
      console.error('Failed to fetch dependencies:', err);
      toast.error('Failed to load categories and types.');
    }
  };

  const fetchAnalyticsData = async (filterParams) => {
    setLoading(true);
    try {
      const response = await adminReportAPI.getJobAnalytics(filterParams);
      if (response.success) {
        setReportData(response.data.jobPostMetrics);
      } else {
        toast.error(response.error || 'Failed to fetch job analytics.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    fetchAnalyticsData(filters);
  }, [filters.dateRange, filters.jobCategory, filters.jobType, filters.status]);

  useEffect(() => {
    applyFilters();
  }, [filters.searchTerm, reportData]);

  const applyFilters = () => {
    let filtered = [...reportData];

    if (filters.searchTerm) {
      filtered = filtered.filter(job =>
        (job.title && job.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (job.employerName && job.employerName.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }
    setFilteredData(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const calculateTotalStats = () => {
    return filteredData.reduce((acc, job) => ({
      totalJobs: acc.totalJobs + 1,
      totalApplications: acc.totalApplications + job.appliedCount,
      totalShortlisted: acc.totalShortlisted + job.shortlistedCount,
      totalRejected: acc.totalRejected + job.rejectedCount,
      totalViews: acc.totalViews + (job.viewCount || 0)
    }), {
      totalJobs: 0,
      totalApplications: 0,
      totalShortlisted: 0,
      totalRejected: 0,
      totalViews: 0
    });
  };

  const getApplicationStatusData = () => {
    const stats = calculateTotalStats();
    return [
      { name: 'Applied', value: stats.totalApplications, color: '#3B82F6' },
      { name: 'Shortlisted', value: stats.totalShortlisted, color: '#10B981' },
      { name: 'Rejected', value: stats.totalRejected, color: '#EF4444' }
    ];
  };

  const getJobTypeData = () => {
    const typeStats = filteredData.reduce((acc, job) => {
      const jobTypeName = job.typeName || 'Other';
      if (!acc[jobTypeName]) {
        acc[jobTypeName] = 0;
      }
      acc[jobTypeName] += job.appliedCount;
      return acc;
    }, {});

    return Object.entries(typeStats).map(([type, count]) => ({
      jobType: type,
      applications: count
    }));
  };
  
  const getCategoryData = () => {
    const categoryStats = filteredData.reduce((acc, job) => {
      const categoryName = job.categoryName || 'Other';
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += job.appliedCount;
      return acc;
    }, {});
    
    return Object.entries(categoryStats).map(([category, count]) => ({
      category,
      applications: count
    }));
  };

  const stats = calculateTotalStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="analytics-report-container">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive overview of job postings and applications</p>
        </div>
        <ExportButtons reportData={{ jobPostMetrics: filteredData }} />
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search jobs or employers..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="pl-9 pr-3 py-2 w-64 h-10"
              />
            </div>
            
            <Select onValueChange={(value) => handleFilterChange('dateRange', value)} value={filters.dateRange}>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last6months">Last 6 Months</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('jobType', value)} value={filters.jobType}>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Types</SelectItem>
                {jobTypes.map(type => (
                  <SelectItem key={type._id} value={type._id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('jobCategory', value)} value={filters.jobCategory}>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Job Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {jobCategories.map(category => (
                  <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Job Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center p-6">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
          </div>
        </Card>

        <Card className="flex items-center p-6">
          <div className="p-3 bg-green-100 rounded-lg mr-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
          </div>
        </Card>

        <Card className="flex items-center p-6">
          <div className="p-3 bg-yellow-100 rounded-lg mr-4">
            <CheckCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Shortlisted</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalShortlisted}</p>
          </div>
        </Card>

        <Card className="flex items-center p-6">
          <div className="p-3 bg-red-100 rounded-lg mr-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Rejected</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalRejected}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Job Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getJobTypeData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jobType" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="applications" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Job Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getCategoryData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Job Analytics</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Shortlisted</TableHead>
                <TableHead>Rejected</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {filteredData.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium text-gray-900">{job.title}</TableCell>
                  <TableCell className="text-sm text-gray-900">{job.employerName}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.typeName}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">{job.appliedCount}</TableCell>
                  <TableCell className="text-sm text-gray-900">{job.shortlistedCount}</TableCell>
                  <TableCell className="text-sm text-gray-900">{job.rejectedCount}</TableCell>
                  <TableCell className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Eye size={16} className="text-gray-400 mr-1" />
                      {job.viewCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'Published' ? 'bg-green-100 text-green-800' :
                      job.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default JobAnalyticsPage;
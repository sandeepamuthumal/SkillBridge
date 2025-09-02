import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Users, CheckCircle, XCircle, Clock, Search, Download, Eye } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminReportAPI } from '@/services/adminReportAPI';
import { Badge } from '@/components/ui/badge';
import AdminApplicationDetailView from "./components/AdminApplicationDetailView";
import ApplicationExportButtons from "./components/ApplicationExportButtons";

const ApplicationReportPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all',
    searchTerm: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);

  const fetchApplicationReport = async (filterParams) => {
    setLoading(true);
    try {
      const response = await adminReportAPI.getApplicationReport(filterParams);
      if (response.success) {
        setReportData(response.data);
      } else {
        toast.error(response.error || 'Failed to fetch application report.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationReport(filters);
  }, [filters.dateRange, filters.status]);

  useEffect(() => {
    if (reportData && reportData.data && reportData.data.applications) {
        let filtered = reportData.data.applications;
        if (filters.searchTerm) {
            filtered = filtered.filter(app =>
                (app.jobPostId?.title?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase()) ||
                (app.jobSeekerId?.userId?.firstName?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase()) ||
                (app.jobSeekerId?.userId?.lastName?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase()) ||
                (app.jobPostId?.employerId?.companyName?.toLowerCase() || '').includes(filters.searchTerm.toLowerCase())
            );
        }
        setFilteredApplications(filtered);
    }
  }, [filters.searchTerm, reportData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDownload = async (applicationId) => {
      const result = await adminReportAPI.downloadApplicationFile(applicationId);
      if (result.success) {
        toast.success("Download started successfully!");
      } else {
        toast.error(result.error);
      }
  }

  const handleView = (application) => {
    setSelectedApplication(application);
  };

  if (selectedApplication) {
      return <AdminApplicationDetailView application={selectedApplication} onBack={() => setSelectedApplication(null)} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!reportData || !reportData.data) {
    return <div className="text-center p-8 text-gray-500">No report data available.</div>;
  }

  const { stats } = reportData.data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Application Report</h1>
        <ApplicationExportButtons applications={filteredApplications} filters={filters} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center p-6">
          <div className="p-3 bg-blue-100 rounded-lg mr-4"><FileText className="h-6 w-6 text-blue-600" /></div>
          <div><p className="text-sm font-medium text-gray-600">Total Applications</p><p className="text-2xl font-bold text-gray-900">{stats?.totalApplications || 0}</p></div>
        </Card>
        <Card className="flex items-center p-6">
          <div className="p-3 bg-green-100 rounded-lg mr-4"><CheckCircle className="h-6 w-6 text-green-600" /></div>
          <div><p className="text-sm font-medium text-gray-600">Shortlisted</p><p className="text-2xl font-bold text-gray-900">{stats?.shortlistedCount || 0}</p></div>
        </Card>
        <Card className="flex items-center p-6">
          <div className="p-3 bg-red-100 rounded-lg mr-4"><XCircle className="h-6 w-6 text-red-600" /></div>
          <div><p className="text-sm font-medium text-gray-600">Rejected</p><p className="text-2xl font-bold text-gray-900">{stats?.rejectedCount || 0}</p></div>
        </Card>
        <Card className="flex items-center p-6">
          <div className="p-3 bg-yellow-100 rounded-lg mr-4"><Clock className="h-6 w-6 text-yellow-600" /></div>
          <div><p className="text-sm font-medium text-gray-600">Under Review</p><p className="text-2xl font-bold text-gray-900">{stats?.underReviewCount || 0}</p></div>
        </Card>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Application List</h3>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by job title, job seeker or employer..."
                className="pl-9 pr-4 py-2 rounded-md border border-gray-300 w-full focus:ring-blue-500 focus:border-blue-500"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
                <SelectTrigger className="w-[180px] md:w-auto">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="Interview Completed">Interview Completed</SelectItem>
                  <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                  <SelectItem value="Offer Accepted">Offer Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => handleFilterChange('dateRange', value)} value={filters.dateRange}>
                <SelectTrigger className="w-[180px] md:w-auto">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30Days">Last 30 Days</SelectItem>
                  <SelectItem value="last6Months">Last 6 Months</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Job Seeker</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {filteredApplications.length > 0 ? filteredApplications.map(app => (
                <TableRow key={app._id}>
                  <TableCell className="font-medium">{app.jobPostId?.title || 'N/A'}</TableCell>
                  <TableCell>{app.jobSeekerId?.userId?.firstName} {app.jobSeekerId?.userId?.lastName}</TableCell>
                  <TableCell>{app.jobPostId?.employerId?.companyName || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={
                      app.status === 'Shortlisted' || app.status === 'Offer Extended' || app.status === 'Offer Accepted' ? 'success' :
                      app.status === 'Rejected' || app.status === 'Withdrawn' ? 'destructive' :
                      app.status === 'Interview Scheduled' || app.status === 'Interview Completed' || app.status === 'Under Review' ? 'warning' : 'secondary'
                    }>{app.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(app.appliedDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(app)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(app._id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={6} className="text-center text-gray-500 py-4">No applications found matching the criteria.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationReportPage;
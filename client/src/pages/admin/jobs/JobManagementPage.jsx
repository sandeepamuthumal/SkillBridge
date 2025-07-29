import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'; // For pagination page input
import { Loader2, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react'; // Icons
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const JobManagementPage = () => {
  const { adminFetchAllJobPosts, adminApproveJobPost, adminDeleteJobPost } = useAuth();
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All'); // Initial state for dropdown
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [confirmAction, setConfirmAction] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // Items per page
  const [searchParams, setSearchParams] = useSearchParams();

  const loadJobPosts = async () => {
    setLoading(true);
    try {
      // Get status from URL for API call, default to '' for 'All'
      const statusParam = searchParams.get('status') || '';

      const response = await adminFetchAllJobPosts(currentPage, limit, statusParam);

      if (response.success) {
        setJobPosts(response.data.jobPosts);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.error || 'Failed to fetch job posts.');
      }
    } catch (err) {
      toast.error('An error occurred while fetching job posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set local filterStatus state from URL searchParams on initial load or URL change
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl === 'pending') {
      setFilterStatus('Pending Approval');
    } else if (statusFromUrl) {
      setFilterStatus(statusFromUrl);
    } else {
      setFilterStatus('All');
    }

    // Always load jobs when dependencies change
    loadJobPosts();
  }, [currentPage, limit, searchParams]);

  // Handler for filter dropdown change
  const handleFilterChange = (value) => {
    setFilterStatus(value); // Update local state for dropdown display
    setCurrentPage(1); // Reset to page 1 when filter changes

    // Update URL search params to reflect the filter
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value === 'All') {
        newParams.delete('status');
      } else if (value === 'Pending Approval') {
        newParams.set('status', 'pending'); // Use a consistent 'pending' string for URL and backend
      } else {
        newParams.set('status', value);
      }
      return newParams;
    });
  };

  const handleApproveClick = (job) => {
    setSelectedJob(job);
    setConfirmAction('approve');
    setIsConfirmModalOpen(true);
  };

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setConfirmAction('delete');
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    setModalLoading(true);
    try {
      let result;
      if (confirmAction === 'approve') {
        result = await adminApproveJobPost(selectedJob._id);
      } else if (confirmAction === 'delete') {
        result = await adminDeleteJobPost(selectedJob._id);
      }

      if (result.success) {
        toast.success(result.message);
        setIsConfirmModalOpen(false);
        loadJobPosts(); // Reload jobs after action
      } else {
        toast.error(result.error || `Failed to ${confirmAction} job post.`);
      }
    } catch (err) {
      toast.error(`An error occurred while ${confirmAction}ing job post.`);
    } finally {
      setModalLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setCurrentPage(1); // Reset to first page on limit change
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold text-text">Job Post Management</CardTitle>
          {/* Use handleFilterChange for onValueChange */}
          <Select onValueChange={handleFilterChange} value={filterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading job posts...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employer</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approval</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No job posts found for the selected filter.
                        </TableCell>
                      </TableRow>
                    ) : (
                      jobPosts.map((job) => (
                        <TableRow key={job._id}>
                          <TableCell className="font-medium">{job.employerName}</TableCell> {/* Populated employer name */}
                          <TableCell>{job.title}</TableCell>
                          <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              job.status === 'Published' && job.isApproved ? 'bg-green-100 text-green-700' :
                              job.status === 'Draft' && !job.isApproved ? 'bg-yellow-100 text-yellow-700' :
                              job.status === 'Paused' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {job.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              job.isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {job.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right flex justify-end space-x-2">
                            {/* Modified condition for the Approve button */}
                            {!job.isApproved && ( // Show Approve button ONLY if it's NOT already approved
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveClick(job)}
                                className="text-green-600 hover:text-green-800 border-green-600 hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                              </Button>
                            )}
                            <Link to={`/admin/jobs/${job._id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" /> View
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(job)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Select onValueChange={handleLimitChange} value={String(limit)}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Approve/Delete */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'approve' ? 'Approve Job Post' : 'Delete Job Post'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to {confirmAction} the job post "
              <span className="font-semibold">{selectedJob?.title}</span>" by{" "}
              <span className="font-semibold">{selectedJob?.employerName}</span>?
            </p>
            {confirmAction === 'delete' && (
              <p className="text-sm text-red-500 mt-2">
                This action will permanently remove the job post from public view.
              </p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleConfirmAction}
              disabled={modalLoading}
              variant={confirmAction === 'approve' ? 'default' : 'destructive'}
            >
              {modalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm {confirmAction === 'approve' ? 'Approve' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobManagementPage;
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const JobManagementPage = ({ defaultFilter = 'All' }) => {
  const { adminFetchAllJobPosts, adminApproveJobPost, adminDeleteJobPost } = useAuth();
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilterDisplay, setActiveFilterDisplay] = useState(defaultFilter); // This state drives the dropdown display
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [confirmAction, setConfirmAction] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();

  
  const loadData = useCallback(async (page, pageSize, filterState) => { 
    setLoading(true);
    try {
      const statusParam = filterState === 'Pending Approval' ? 'pending' : (filterState === 'All' ? '' : filterState);
      
      const response = await adminFetchAllJobPosts(page, pageSize, statusParam);

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
  }, [adminFetchAllJobPosts]); 

  
  useEffect(() => {
    
    let determinedFilterForFetch = defaultFilter; 

    if (defaultFilter === 'All') { 
        const statusFromUrl = searchParams.get('status');
        if (statusFromUrl === 'pending') {
            determinedFilterForFetch = 'Pending Approval';
        } else if (statusFromUrl) {
            determinedFilterForFetch = statusFromUrl;
        }
        
    }
    
    if (determinedFilterForFetch !== activeFilterDisplay) {
        setActiveFilterDisplay(determinedFilterForFetch);
    }

    
    loadData(currentPage, limit, determinedFilterForFetch);

    
    if (defaultFilter === 'All') {
        const currentUrlStatus = searchParams.get('status');
        const targetUrlStatus = determinedFilterForFetch === 'Pending Approval' ? 'pending' : (determinedFilterForFetch === 'All' ? '' : determinedFilterForFetch);
        if (currentUrlStatus !== targetUrlStatus) {
            const newParams = new URLSearchParams(searchParams);
            if (targetUrlStatus === '') {
                newParams.delete('status');
            } else {
                newParams.set('status', targetUrlStatus);
            }
            
            if (newParams.toString() !== searchParams.toString()) {
                setSearchParams(newParams, { replace: true });
            }
        }
    }


  }, [currentPage, limit, searchParams, defaultFilter, activeFilterDisplay, loadData]); 
 


  const handleFilterChange = (value) => {
    
    if (defaultFilter === 'All') {
        setCurrentPage(1); 

        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          if (value === 'All') {
            newParams.delete('status');
          } else if (value === 'Pending Approval') {
            newParams.set('status', 'pending');
          } else {
            newParams.set('status', value);
          }
          return newParams;
        });
    }
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
        
        loadData(currentPage, limit, activeFilterDisplay); 
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
    setCurrentPage(1); 
  };

  const showFilterDropdown = defaultFilter === 'All'; 

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold text-text">
            {defaultFilter === 'Pending Approval' ? 'Pending Job Approvals' : 'Job Post Management'}
          </CardTitle>
          {showFilterDropdown && (
            <Select onValueChange={handleFilterChange} value={activeFilterDisplay}> {/* Use activeFilterDisplay for value */}
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
          )}
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
                          <TableCell className="font-medium">{job.employerName}</TableCell>
                          <TableCell>{job.title}</TableCell>
                          <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              job.status === 'Published' && job.isApproved ? 'bg-green-100 text-green-700' :
                              job.status === 'Paused' && !job.isApproved ? 'bg-yellow-100 text-yellow-700' :
                              job.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
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
                            {!job.isApproved && (
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
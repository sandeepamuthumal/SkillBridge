import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const UserManagementPage = () => {
  const { user, fetchAllUsers, updateUserStatus, adminResetUserPassword } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [statusChangeAction, setStatusChangeAction] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Server-side pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchAllUsers(
        currentPage, 
        itemsPerPage, 
        filterRole === 'All' ? '' : filterRole,
        filterStatus === 'All' ? '' : filterStatus,
        searchTerm
      );
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.error || 'Failed to fetch users.');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('An error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, itemsPerPage, filterRole, filterStatus, searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filterRole, filterStatus, searchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleResetPasswordClick = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setIsResetPasswordModalOpen(true);
  };

  const handleStatusChangeClick = (user) => {
    setSelectedUser(user);
    setStatusChangeAction(user.status === 'active' ? 'deactivate' : 'activate');
    setIsStatusChangeModalOpen(true);
  };

  const handleConfirmResetPassword = async () => {
    setModalLoading(true);
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      setModalLoading(false);
      return;
    }
    if (newPassword.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword)) {
      toast.error("Password must be at least 8 characters and contain uppercase, lowercase, number and special character.");
      setModalLoading(false);
      return;
    }

    try {
      const result = await adminResetUserPassword(selectedUser._id, newPassword);
      if (result.success) {
        toast.success(`Password for ${selectedUser.firstName} reset successfully.`);
        setIsResetPasswordModalOpen(false);
      } else {
        toast.error(result.error || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      toast.error('An error occurred while resetting password.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    setModalLoading(true);
    try {
      const newStatus = statusChangeAction === 'activate' ? 'active' : 'inactive';
      const result = await updateUserStatus(selectedUser._id, newStatus);
      if (result.success) {
        toast.success(`${selectedUser.firstName}'s account has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`);
        setIsStatusChangeModalOpen(false);
        loadUsers();
      } else {
        toast.error(result.error || 'Failed to update user status.');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      toast.error('An error occurred while updating user status.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-border">
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between items-center">
              <CardTitle className="text-2xl font-bold text-text">User Management</CardTitle>
              <div className="flex gap-2">
                <Select onValueChange={setFilterRole} value={filterRole}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Job Seeker">Job Seeker</SelectItem>
                    <SelectItem value="Employer">Employer</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={setFilterStatus} value={filterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="default">
                Search
              </Button>
              {searchTerm && (
                <Button type="button" variant="outline" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          {searchTerm ? 'No users found matching your search.' : 'No users found for the selected filters.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u._id}>
                          <TableCell className="font-medium">{u.firstName} {u.lastName || ''}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.role}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {u.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant={u.status === 'active' ? 'destructive' : 'default'}
                                size="sm"
                                onClick={() => handleStatusChangeClick(u)}
                                disabled={u.role === 'Admin' && u._id === user._id}
                              >
                                {u.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResetPasswordClick(u)}
                              >
                                Reset Password
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {pagination.totalUsers > 0 && (
                <div className="flex items-center justify-between mt-4 px-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                      <SelectTrigger className="w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-6">
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {pagination.totalPages} ({pagination.totalUsers} total users)
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage || loading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[80px] text-center">
                        Page {currentPage}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage || loading}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password for {selectedUser?.firstName}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-500">Passwords do not match.</p>
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
              onClick={handleConfirmResetPassword}
              disabled={modalLoading || !newPassword || newPassword !== confirmPassword}
            >
              {modalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={isStatusChangeModalOpen} onOpenChange={setIsStatusChangeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{statusChangeAction === 'activate' ? 'Activate' : 'Deactivate'} User Account</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to {statusChangeAction} the account for{' '}
              <span className="font-semibold">{selectedUser?.firstName} {selectedUser?.lastName || ''}</span>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This will {statusChangeAction === 'activate' ? 'restore access' : 'restrict access'} to their SkillBridge account.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleConfirmStatusChange}
              disabled={modalLoading}
              variant={statusChangeAction === 'activate' ? 'default' : 'destructive'}
            >
              {modalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm {statusChangeAction === 'activate' ? 'Activation' : 'Deactivation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
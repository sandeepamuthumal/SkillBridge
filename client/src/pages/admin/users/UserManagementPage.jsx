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
import { Loader2 } from 'lucide-react'; // Assuming Loader2 icon exists for loading state

const UserManagementPage = () => {
  const { user, token, fetchAllUsers, updateUserStatus, adminResetUserPassword } = useAuth(); // Assuming these new functions are added to AuthContext
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('All'); // 'All', 'Admin', 'Job Seeker', 'Employer'
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isStatusChangeModalOpen, setIsStatusChangeModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [statusChangeAction, setStatusChangeAction] = useState(''); // 'activate' or 'deactivate'

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchAllUsers(); // Call the new function from AuthContext
      if (response.success) {
        setUsers(response.data);
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
  }, []);

  const filteredUsers = users.filter(u => {
    if (filterRole === 'All') return true;
    return u.role === filterRole;
  });

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
      const result = await adminResetUserPassword(selectedUser._id, newPassword); // Call new function
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
      const result = await updateUserStatus(selectedUser._id, newStatus); // Call new function
      if (result.success) {
        toast.success(`${selectedUser.firstName}'s account has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`);
        setIsStatusChangeModalOpen(false);
        loadUsers(); // Reload users to reflect status change
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
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold text-text">User Management</CardTitle>
          <Select onValueChange={setFilterRole} value={filterRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Job Seeker">Job Seeker</SelectItem>
              <SelectItem value="Employer">Employer</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          ) : (
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
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No users found for the selected filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => (
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
                        <TableCell className="text-right flex justify-end space-x-2">
                          <Button
                            variant={u.status === 'active' ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => handleStatusChangeClick(u)}
                            disabled={u.role === 'Admin' && u._id === user._id} // Prevent admin deactivating themselves
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
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
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
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3"
                placeholder="Confirm new password"
              />
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
            <Button type="button" onClick={handleConfirmResetPassword} disabled={modalLoading || !newPassword || newPassword !== confirmPassword}>
              {modalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
              {modalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm {statusChangeAction === 'activate' ? 'Activation' : 'Deactivation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
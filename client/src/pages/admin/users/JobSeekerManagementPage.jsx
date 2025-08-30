import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus, Eye, Mail, Lock, XCircle, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import PasswordInput from '@/components/ui/PasswordInput';
import { format } from 'date-fns';


const JobSeekerManagementPage = () => {
    const { fetchAllUsers, updateUserStatus, adminResetUserPassword } = useAuth();
    const [jobSeekers, setJobSeekers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
    const [selectedJobSeeker, setSelectedJobSeeker] = useState(null);
    const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [actionType, setActionType] = useState('');

    const loadJobSeekers = async () => {
        setLoading(true);
        try {
            const response = await fetchAllUsers();
            if (response.success) {
                const seekers = response.data.filter(user => user.role === 'Job Seeker');
                setJobSeekers(seekers);
            } else {
                toast.error(response.error || 'Failed to fetch job seekers.');
            }
        } catch (err) {
            console.error('Error fetching job seekers:', err);
            toast.error('An error occurred while fetching job seekers.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobSeekers();
    }, []);

    const handleActionClick = (jobSeeker, action) => {
        setSelectedJobSeeker(jobSeeker);
        setActionType(action);
        setConfirmActionModalOpen(true);
    };

    const handleConfirmAction = async () => {
        setModalLoading(true);
        try {
            let result;
            if (actionType === 'deactivate') {
                result = await updateUserStatus(selectedJobSeeker._id, 'inactive');
            } else if (actionType === 'reactivate') {
                result = await updateUserStatus(selectedJobSeeker._id, 'active');
            }

            if (result.success) {
                toast.success(result.message);
                setConfirmActionModalOpen(false);
                loadJobSeekers();
            } else {
                toast.error(result.error || `Failed to ${actionType} job seeker.`);
            }
        } catch (err) {
            console.error(`Error ${actionType}ing job seeker:`, err);
            toast.error(`An error occurred while ${actionType}ing job seeker.`);
        } finally {
            setModalLoading(false);
        }
    };

    const handlePasswordResetClick = (jobSeeker) => {
        setSelectedJobSeeker(jobSeeker);
        setIsPasswordResetModalOpen(true);
    };

    const handleConfirmPasswordReset = async () => {
        setModalLoading(true);
        try {
            let result;
            if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match.");
                setModalLoading(false);
                return;
            }
            result = await adminResetUserPassword(selectedJobSeeker._id, newPassword);

            if (result.success) {
                toast.success(result.message);
                setIsPasswordResetModalOpen(false);
                loadJobSeekers();
            } else {
                toast.error(result.error || 'Failed to reset password.');
            }
        } catch (err) {
            console.error(`Error resetting password:`, err);
            toast.error(`An error occurred while resetting password.`);
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-sm border border-border">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-2xl font-bold text-text">Job Seeker Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading job seekers...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Registration Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jobSeekers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                                No job seekers found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        jobSeekers.map((jobSeeker) => (
                                            <TableRow key={jobSeeker._id}>
                                                <TableCell className="font-medium">{jobSeeker.firstName} {jobSeeker.lastName || ''}</TableCell>
                                                <TableCell>{jobSeeker.email}</TableCell>
                                                <TableCell>
                                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    jobSeeker.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                  }`}>
                                                    {jobSeeker.status === 'active' ? 'Active' : 'Inactive'}
                                                  </span>
                                                </TableCell>
                                                <TableCell>{format(new Date(jobSeeker.createdAt), 'PP')}</TableCell>
                                                <TableCell className="text-right flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePasswordResetClick(jobSeeker)}
                                                    >
                                                        <Lock className="h-4 w-4 mr-2" /> Reset Password
                                                    </Button>
                                                    {jobSeeker.status === 'active' ? (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleActionClick(jobSeeker, 'deactivate')}
                                                        >
                                                            <XCircle className="h-4 w-4" /> Deactivate
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleActionClick(jobSeeker, 'reactivate')}
                                                        >
                                                            <CheckCircle className="h-4 w-4" /> Reactivate
                                                        </Button>
                                                    )}
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

            {/* Password Reset Modal */}
            <Dialog open={isPasswordResetModalOpen} onOpenChange={setIsPasswordResetModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reset Password for {selectedJobSeeker?.firstName}</DialogTitle>
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
                        <Button type="button" onClick={handleConfirmPasswordReset} disabled={modalLoading || !newPassword || newPassword !== confirmPassword}>
                            {modalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Reset Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog for both deactivate and reactivate */}
            <Dialog open={confirmActionModalOpen} onOpenChange={setConfirmActionModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{actionType === 'deactivate' ? 'Deactivate Job Seeker' : 'Reactivate Job Seeker'}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>
                            Are you sure you want to {actionType} the account for{' '}
                            <span className="font-semibold">{selectedJobSeeker?.firstName} {selectedJobSeeker?.lastName || ''}</span>?
                        </p>
                        {actionType === 'deactivate' && (
                            <p className="text-sm text-red-500 mt-2">
                                This will restrict access to their account.
                            </p>
                        )}
                        {actionType === 'reactivate' && (
                            <p className="text-sm text-green-500 mt-2">
                                This will restore access to their account.
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
                            variant={actionType === 'deactivate' ? 'destructive' : 'default'}
                        >
                            {modalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Confirm {actionType}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default JobSeekerManagementPage;
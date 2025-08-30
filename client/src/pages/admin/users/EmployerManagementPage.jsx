import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, XCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

const EmployerManagementPage = () => {
    const { fetchAllUsers, updateUserStatus, adminResetUserPassword } = useAuth();
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [actionType, setActionType] = useState('');

    const loadEmployers = async () => {
        setLoading(true);
        try {
            const response = await fetchAllUsers();
            if (response.success) {
                const filteredEmployers = response.data.filter(user => user.role === 'Employer');
                setEmployers(filteredEmployers);
            } else {
                toast.error(response.error || 'Failed to fetch employers.');
            }
        } catch (err) {
            console.error('Error fetching employers:', err);
            toast.error('An error occurred while fetching employers.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployers();
    }, []);

    const handleActionClick = (employer, action) => {
        setSelectedEmployer(employer);
        setActionType(action);
        setConfirmActionModalOpen(true);
    };

    const handleConfirmAction = async () => {
        setModalLoading(true);
        try {
            let result;
            if (actionType === 'deactivate') {
                result = await updateUserStatus(selectedEmployer._id, 'inactive');
            } else if (actionType === 'reactivate') {
                result = await updateUserStatus(selectedEmployer._id, 'active');
            }

            if (result.success) {
                toast.success(result.message);
                setConfirmActionModalOpen(false);
                loadEmployers();
            } else {
                toast.error(result.error || `Failed to ${actionType} employer.`);
            }
        } catch (err) {
            console.error(`Error ${actionType}ing employer:`, err);
            toast.error(`An error occurred while ${actionType}ing employer.`);
        } finally {
            setModalLoading(false);
        }
    };

    const handlePasswordResetClick = (employer) => {
        setSelectedEmployer(employer);
        setIsPasswordResetModalOpen(true);
    };

    const handleConfirmPasswordReset = async () => {
        setModalLoading(true);
        try {
            if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match.");
                setModalLoading(false);
                return;
            }
            const result = await adminResetUserPassword(selectedEmployer._id, newPassword);

            if (result.success) {
                toast.success(result.message);
                setIsPasswordResetModalOpen(false);
                loadEmployers();
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
                    <CardTitle className="text-2xl font-bold text-text">Employer Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading employers...</span>
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
                                    {employers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                                No employers found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        employers.map((employer) => (
                                            <TableRow key={employer._id}>
                                                <TableCell className="font-medium">{employer.firstName} {employer.lastName || ''}</TableCell>
                                                <TableCell>{employer.email}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        employer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {employer.status === 'active' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{format(new Date(employer.createdAt), 'PP')}</TableCell>
                                                <TableCell className="text-right flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePasswordResetClick(employer)}
                                                    >
                                                        <Lock className="h-4 w-4 mr-2" /> Reset Password
                                                    </Button>
                                                    {employer.status === 'active' ? (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleActionClick(employer, 'deactivate')}
                                                        >
                                                            <XCircle className="h-4 w-4" /> Deactivate
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleActionClick(employer, 'reactivate')}
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
                        <DialogTitle>Reset Password for {selectedEmployer?.firstName}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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
                                placeholder="Confirm new password"
                            />
                        </div>
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-sm text-red-500">Passwords do not match.</p>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                            type="button" 
                            onClick={handleConfirmPasswordReset} 
                            disabled={modalLoading || !newPassword || newPassword !== confirmPassword}
                        >
                            {modalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Reset Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={confirmActionModalOpen} onOpenChange={setConfirmActionModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'deactivate' ? 'Deactivate Employer' : 'Reactivate Employer'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>
                            Are you sure you want to {actionType} the account for{' '}
                            <span className="font-semibold">{selectedEmployer?.firstName} {selectedEmployer?.lastName || ''}</span>?
                        </p>
                        {actionType === 'deactivate' && (
                            <p className="text-sm text-red-500 mt-2">This will restrict access to their account.</p>
                        )}
                        {actionType === 'reactivate' && (
                            <p className="text-sm text-green-500 mt-2">This will restore access to their account.</p>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
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

export default EmployerManagementPage;

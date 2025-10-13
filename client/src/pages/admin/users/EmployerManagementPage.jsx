import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, XCircle, CheckCircle, Eye, EyeOff, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

const EmployerManagementPage = () => {
    const { adminFetchEmployers, updateUserStatus, adminResetUserPassword } = useAuth();
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [actionType, setActionType] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Pagination & Search states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [pagination, setPagination] = useState({
        totalPages: 0,
        totalUsers: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    const loadEmployers = async () => {
        setLoading(true);
        try {
            const response = await adminFetchEmployers(
                currentPage,
                itemsPerPage,
                filterStatus === 'All' ? '' : filterStatus,
                searchTerm
            );
            if (response.success) {
                setEmployers(response.data);
                setPagination(response.pagination);
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
    }, [currentPage, itemsPerPage, filterStatus, searchTerm]);

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [filterStatus, searchTerm]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearchTerm('');
        setCurrentPage(1);
    };

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
        setNewPassword('');
        setConfirmPassword('');
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
            if (newPassword.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword)) {
                toast.error("Password must be at least 8 characters and contain uppercase, lowercase, number and special character.");
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
                <CardHeader>
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-row justify-between items-center">
                            <CardTitle className="text-2xl font-bold text-text">Employer Management</CardTitle>
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

                        {/* Search Bar */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="button" variant="default" onClick={handleSearchSubmit}>
                                Search
                            </Button>
                            {searchTerm && (
                                <Button type="button" variant="outline" onClick={handleClearSearch}>
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading employers...</span>
                        </div>
                    ) : (
                        <>
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
                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                    {searchTerm ? 'No employers found matching your search.' : 'No employers found.'}
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
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
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
                                            Page {currentPage} of {pagination.totalPages} ({pagination.totalUsers} total employers)
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

            {/* Password Reset Modal */}
            <Dialog open={isPasswordResetModalOpen} onOpenChange={setIsPasswordResetModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reset Password for {selectedEmployer?.firstName}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmNewPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
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
                            {modalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                            {modalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm {actionType}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployerManagementPage;
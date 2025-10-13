import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus, Eye, ChevronLeft, ChevronRight, Search, XCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import AddAdminModal from './components/AddAdminModal';
import EditAdminModal from './components/EditAdminModal';
import { format } from 'date-fns';

const AdminManagementPage = () => {
    const { adminFetchAdmins, adminAddAdmin, adminUpdateAdminEmail, adminUpdateAdminPassword, adminDeactivateAdmin, adminReactivateAdmin, user: currentUser } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
    const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [actionType, setActionType] = useState('');

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

    const loadAdmins = async () => {
        setLoading(true);
        try {
            const response = await adminFetchAdmins(
                currentPage,
                itemsPerPage,
                filterStatus === 'All' ? '' : filterStatus,
                searchTerm
            );
            if (response.success) {
                setAdmins(response.data);
                setPagination(response.pagination);
            } else {
                toast.error(response.error || 'Failed to fetch admin users.');
            }
        } catch (err) {
            console.error('Error fetching admins:', err);
            toast.error('An error occurred while fetching admin users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
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

    const handleAddAdmin = async (formData) => {
        setModalLoading(true);
        try {
            const result = await adminAddAdmin(formData);
            if (result.success) {
                toast.success(result.message);
                setIsAddAdminModalOpen(false);
                loadAdmins();
            } else {
                toast.error(result.error || 'Failed to add admin.');
            }
        } catch (err) {
            console.error('Error adding admin:', err);
            toast.error('An error occurred while adding admin.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleEditAdmin = (admin) => {
        setSelectedAdmin(admin);
        setIsEditAdminModalOpen(true);
    };

    const handleUpdateAdminEmail = async (userId, newEmail) => {
        setModalLoading(true);
        try {
            const result = await adminUpdateAdminEmail(userId, newEmail);
            if (result.success) {
                toast.success(result.message);
                setIsEditAdminModalOpen(false);
                loadAdmins();
            } else {
                toast.error(result.error || 'Failed to update admin email.');
            }
        } catch (err) {
            console.error('Error updating admin email:', err);
            toast.error('An error occurred while updating admin email.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleUpdateAdminPassword = async (userId, newPassword) => {
        setModalLoading(true);
        try {
            const result = await adminUpdateAdminPassword(userId, newPassword);
            if (result.success) {
                toast.success(result.message);
                setIsEditAdminModalOpen(false);
                loadAdmins();
            } else {
                toast.error(result.error || 'Failed to update admin password.');
            }
        } catch (err) {
            console.error('Error updating admin password:', err);
            toast.error('An error occurred while updating admin password.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleActionClick = (admin, action) => {
        setSelectedAdmin(admin);
        setActionType(action);
        setConfirmActionModalOpen(true);
    };

    const handleConfirmAction = async () => {
        setModalLoading(true);
        try {
            let result;
            if (actionType === 'deactivate') {
                result = await adminDeactivateAdmin(selectedAdmin._id);
            } else if (actionType === 'reactivate') {
                result = await adminReactivateAdmin(selectedAdmin._id);
            }

            if (result.success) {
                toast.success(result.message);
                setConfirmActionModalOpen(false);
                loadAdmins();
            } else {
                toast.error(result.error || `Failed to ${actionType} admin.`);
            }
        } catch (err) {
            console.error(`Error ${actionType}ing admin:`, err);
            toast.error(`An error occurred while ${actionType}ing admin.`);
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
                            <CardTitle className="text-2xl font-bold text-text">Admin Management</CardTitle>
                            <div className="flex gap-2">
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
                                <Button onClick={() => setIsAddAdminModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                                    <UserPlus className="h-4 w-4 mr-2" /> Add Admin
                                </Button>
                            </div>
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
                            <span className="ml-2 text-gray-600">Loading admins...</span>
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
                                        {admins.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                    {searchTerm ? 'No admins found matching your search.' : 'No admin users found.'}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            admins.map((admin) => (
                                                <TableRow key={admin._id}>
                                                    <TableCell className="font-medium">{admin.firstName} {admin.lastName || ''}</TableCell>
                                                    <TableCell>{admin.email}</TableCell>
                                                    <TableCell>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            admin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {admin.status === 'active' ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{format(new Date(admin.createdAt), 'PP')}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditAdmin(admin)}
                                                            >
                                                                <Eye className="h-4 w-4" /> Edit
                                                            </Button>
                                                            {admin.status === 'active' ? (
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleActionClick(admin, 'deactivate')}
                                                                    disabled={admin._id === currentUser._id}
                                                                >
                                                                    <XCircle className="h-4 w-4" /> Deactivate
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={() => handleActionClick(admin, 'reactivate')}
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
                                            Page {currentPage} of {pagination.totalPages} ({pagination.totalUsers} total admins)
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
            
            <AddAdminModal
                isOpen={isAddAdminModalOpen}
                onClose={() => setIsAddAdminModalOpen(false)}
                onAddAdmin={handleAddAdmin}
                loading={modalLoading}
            />
            {selectedAdmin && (
                <EditAdminModal
                    isOpen={isEditAdminModalOpen}
                    onClose={() => setIsEditAdminModalOpen(false)}
                    admin={selectedAdmin}
                    onUpdateEmail={handleUpdateAdminEmail}
                    onUpdatePassword={handleUpdateAdminPassword}
                    loading={modalLoading}
                />
            )}
            <Dialog open={confirmActionModalOpen} onOpenChange={setConfirmActionModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{actionType === 'deactivate' ? 'Deactivate Admin' : 'Reactivate Admin'}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>
                            Are you sure you want to {actionType} the admin account for{' '}
                            <span className="font-semibold">{selectedAdmin?.firstName} {selectedAdmin?.lastName || ''}</span>?
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
                            {modalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm {actionType}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminManagementPage;
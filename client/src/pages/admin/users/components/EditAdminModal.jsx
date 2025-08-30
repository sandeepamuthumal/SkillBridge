import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/ui/PasswordInput';
import { Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const EditAdminModal = ({ isOpen, onClose, admin, onUpdateEmail, onUpdatePassword, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailErrors, setEmailErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [activeTab, setActiveTab] = useState('email');

    useEffect(() => {
        if (admin) {
            setEmail(admin.email || '');
            setPassword('');
            setConfirmPassword('');
            setEmailErrors({});
            setPasswordErrors({});
        }
    }, [admin]);

    const validateEmailForm = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format.';
        setEmailErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        const newErrors = {};
        if (!password) newErrors.password = 'Password is required.';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, number, and special character.';
        }
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (validateEmailForm()) {
            await onUpdateEmail(admin._id, email);
        } else {
            toast.error('Please correct the email form errors.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (validatePasswordForm()) {
            await onUpdatePassword(admin._id, password);
        } else {
            toast.error('Please correct the password form errors.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Admin: {admin?.firstName} {admin?.lastName}</DialogTitle>
                </DialogHeader>
                <div className="flex border-b">
                    <button
                        type="button"
                        className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'email' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('email')}
                    >
                        <Mail className="inline-block h-4 w-4 mr-2" /> Update Email
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'password' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('password')}
                    >
                        <Lock className="inline-block h-4 w-4 mr-2" /> Update Password
                    </button>
                </div>
                {activeTab === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); if (emailErrors.email) setEmailErrors({}); }}
                                className={emailErrors.email ? 'border-red-500' : ''}
                            />
                            {emailErrors.email && <p className="text-sm text-red-500">{emailErrors.email}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Update Email
                            </Button>
                        </DialogFooter>
                    </form>
                )}
                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <PasswordInput
                                id="newPassword"
                                name="newPassword"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); if (passwordErrors.password) setPasswordErrors({}); }}
                                className={passwordErrors.password ? 'border-red-500' : ''}
                            />
                            {passwordErrors.password && <p className="text-sm text-red-500">{passwordErrors.password}</p>}
                            <p className="text-xs text-gray-500">
                                Must contain uppercase, lowercase, number and special character.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                            <PasswordInput
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); if (passwordErrors.confirmPassword) setPasswordErrors({}); }}
                                className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                            />
                            {passwordErrors.confirmPassword && <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Update Password
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EditAdminModal;
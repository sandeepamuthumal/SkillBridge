import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '@/services/authAPI';
import { adminJobAPI } from '@/services/adminJobAPI';
import { adminUserAPI } from '@/services/adminUserAPI';

const AuthContext = createContext();

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    error: null
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        case 'AUTH_FAIL':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: null
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        if (state.token) {
            loadUser();
        } else {
            dispatch({ type: 'AUTH_FAIL', payload: null });
        }
    }, []);

    const loadUser = async () => {
        try {
            const response = await authAPI.getMe();
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                    user: response.data.user,
                    token: state.token
                }
            });
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'AUTH_FAIL', payload: error.response?.data?.message });
        }
    };

    const signup = async (userData, userType) => {
        dispatch({ type: 'AUTH_START' });

        try {
            const endpoint = userType === 'jobseeker' ? '/auth/signup/jobseeker' : '/auth/signup/employer';
            const response = await authAPI.post(endpoint, userData);

            dispatch({ type: 'AUTH_FAIL', payload: null });

            return {
                success: true,
                message: response.data.message,
                data: response.data.data
            };
        } catch (error) {
            const message = error.response?.data?.message || 'Signup failed';
            dispatch({ type: 'AUTH_FAIL', payload: message });
            return { success: false, error: message };
        }
    };

    const signin = async (credentials) => {
        dispatch({ type: 'AUTH_START' });

        try {
            const response = await authAPI.signin(credentials);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user, token }
            });

            toast.success(`Welcome back, ${user.firstName}!`);
            return { success: true, user };
        } catch (error) {
            const errorData = error.response?.data;
            dispatch({ type: 'AUTH_FAIL', payload: errorData?.message });
            return { success: false, error: errorData?.message };
        }
    };

    const forgotPassword = async (email) => {
        try {
            await authAPI.forgotPassword({ email });
            toast.success('Password reset instructions sent to your email', {
                autoClose: 6000
            });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send reset email';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const resetPassword = async (token, password, confirmPassword) => {
        try {
            await authAPI.resetPassword({ token, password, confirmPassword });
            toast.success('Password reset successful! You can now sign in.', {
                autoClose: 6000
            });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const resendVerificationEmail = async (email) => {
        try {
            await authAPI.resendVerification({ email });
            toast.success('Verification email sent successfully', {
                autoClose: 5000
            });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send verification email';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const verifyEmail = async (token, email) => {
        try {
            const response = await authAPI.verifyEmail({ token, email });
            const { token: authToken, user } = response.data;

            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user, token: authToken }
            });

            toast.success('Email verified successfully! Welcome to SkillBridge!', {
                autoClose: 6000
            });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Email verification failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'LOGOUT' });
            toast.success('Logged out successfully');
        }
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const hasRole = (role) => {
        return state.user?.role === role;
    };

    const hasAnyRole = (roles) => {
        return roles.includes(state.user?.role);
    };

    const isJobseeker = () => hasRole('jobseeker');
    const isEmployer = () => hasRole('employer');
    const isAdmin = () => hasRole('admin');

    const canAccess = (requiredRole = null, allowedRoles = []) => {
        if (!state.isAuthenticated) return false;
        if (requiredRole && !hasRole(requiredRole)) return false;
        if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) return false;
        return true;
    };

    const getUserDisplayName = () => {
        if (!state.user) return '';
        return `${state.user.firstName} ${state.user.lastName}`.trim();
    };

    const getUserInitials = () => {
        if (!state.user) return 'U';
        const firstName = state.user.firstName || '';
        const lastName = state.user.lastName || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
    };

    const fetchAllUsers = async () => {
        try {
            const response = await authAPI.getAllUsers();
            return { success: true, data: response.data.users };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch users';
            console.error('fetchAllUsers error:', message);
            return { success: false, error: message };
        }
    };

    const updateUserStatus = async (userId, status) => {
        try {
            const response = await authAPI.updateUserStatus(userId, { status });
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update user status';
            console.error('updateUserStatus error:', message);
            return { success: false, error: message };
        }
    };

    const adminResetUserPassword = async (userId, newPassword) => {
        try {
            const response = await authAPI.adminResetUserPassword(userId, { newPassword });
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset user password';
            console.error('adminResetUserPassword error:', message);
            return { success: false, error: message };
        }
    };

    const adminFetchAllJobPosts = async (page = 1, limit = 10, status = '') => {
        try {
            const response = await adminJobAPI.getAllJobPosts(page, limit, status);
            return { success: true, data: response.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch job posts';
            console.error('adminFetchAllJobPosts API call error:', error.response?.data || error.message);
            return { success: false, error: message };
        }
    };

    const adminFetchJobPostById = async (jobPostId) => {
        try {
            const response = await adminJobAPI.getJobPostById(jobPostId);
            return { success: true, data: response.data.jobPost };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch job post details';
            console.error('adminFetchJobPostById error:', message);
            return { success: false, error: message };
        }
    };

    const adminApproveJobPost = async (jobPostId) => {
        try {
            const response = await adminJobAPI.approveJobPost(jobPostId);
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to approve job post';
            console.error('adminApproveJobPost error:', message);
            return { success: false, error: message };
        }
    };

    const adminDeleteJobPost = async (jobPostId) => {
        try {
            const response = await adminJobAPI.deleteJobPost(jobPostId);
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete job post';
            console.error('adminDeleteJobPost error:', message);
            return { success: false, error: message };
        }
    };

    const adminFetchAdmins = async () => {
        try {
            const response = await adminUserAPI.getAllAdmins();
            return { success: true, data: response.data.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to fetch admin users';
            console.error('adminFetchAdmins error:', message);
            return { success: false, error: message };
        }
    };

    const adminAddAdmin = async (adminData) => {
        try {
            const response = await adminUserAPI.addAdmin(adminData);
            return { success: true, message: response.data.message, data: response.data.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to add admin';
            console.error('adminAddAdmin error:', message);
            return { success: false, error: message };
        }
    };

    const adminUpdateAdminEmail = async (id, newEmail) => {
        try {
            const response = await adminUserAPI.updateAdminEmail(id, { email: newEmail });
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update admin email';
            console.error('adminUpdateAdminEmail error:', message);
            return { success: false, error: message };
        }
    };

    const adminUpdateAdminPassword = async (id, newPassword) => {
        try {
            const response = await adminUserAPI.updateAdminPassword(id, { newPassword });
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to update admin password';
            console.error('adminUpdateAdminPassword error:', message);
            return { success: false, error: message };
        }
    };

    const adminDeactivateAdmin = async (id) => {
        try {
            const response = await adminUserAPI.deactivateAdmin(id);
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to deactivate admin';
            console.error('adminDeactivateAdmin error:', message);
            return { success: false, error: message };
        }
    };
    
    const adminReactivateAdmin = async (id) => {
        try {
            const response = await adminUserAPI.reactivateAdmin(id);
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reactivate admin';
            console.error('adminReactivateAdmin error:', message);
            return { success: false, error: message };
        }
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            signup,
            signin,
            logout,
            forgotPassword,
            resetPassword,
            resendVerificationEmail,
            verifyEmail,
            clearError,
            loadUser,
            hasRole,
            hasAnyRole,
            isJobseeker,
            isEmployer,
            isAdmin,
            canAccess,
            getUserDisplayName,
            getUserInitials,
            fetchAllUsers,
            updateUserStatus,
            adminResetUserPassword,
            adminFetchAllJobPosts,
            adminFetchJobPostById,
            adminApproveJobPost,
            adminDeleteJobPost,
            adminFetchAdmins,
            adminAddAdmin,
            adminUpdateAdminEmail,
            adminUpdateAdminPassword,
            adminDeactivateAdmin,
            adminReactivateAdmin,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
// context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '@/services/authAPI';

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

  // Check if user is logged in on app start
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
      
      // User needs to verify email first, so don't authenticate yet
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
      console.log("SignIn credentials:", credentials);
      const response = await authAPI.signin(credentials);
      console.log("SignIn response:", response);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });
      
      toast.success(`Welcome back, ${user.firstName}!`);
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;

      console.error("SignIn error:", errorData);
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
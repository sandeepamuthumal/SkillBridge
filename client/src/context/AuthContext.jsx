import React, { createContext, useContext, useReducer, useEffect } from 'react';
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

    const loadUser = async() => {
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
            dispatch({ type: 'AUTH_FAIL', payload: error.response?.data?.message });
        }
    };

    const signup = async(userData) => {
        dispatch({ type: 'AUTH_START' });
        try {
            console.log(userData);
            const response = await authAPI.signup(userData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user, token }
            });

            return { success: true };
        } catch (error) {
            console.log(error);
            const message = error.response?.data?.message || 'Signup failed';
            dispatch({ type: 'AUTH_FAIL', payload: error.response?.data?.message });
            return { success: false, error: message };
        }
    };

    const signin = async(credentials) => {
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

            return { success: true };
        } catch (error) {
            console.log(error);
            const message = error.response?.data?.message || 'Signin failed';
            dispatch({ type: 'AUTH_FAIL', payload: error.response?.data?.message });
            return { success: false, error: message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return ( 
        <AuthContext.Provider value = {
            {
                ...state,
                signup,
                signin,
                logout,
                clearError
            }
        } > { children } 
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
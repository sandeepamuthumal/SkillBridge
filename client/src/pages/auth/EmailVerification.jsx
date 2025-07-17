// pages/auth/EmailVerification.js - Fixed version
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../../context/AuthContext';
import { useRouteHelper } from '@/hooks/useRouteHelper';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { navigateToDashboard } = useRouteHelper();
  
  // Use ref to prevent double execution
  const hasVerified = useRef(false);

  // Get email and userType from location state or URL params
  const email = location.state?.email || searchParams.get('email');
  const userType = location.state?.userType || 'jobseeker';
  const token = searchParams.get('token');

  useEffect(() => {
    // If we have a token in URL and haven't verified yet, automatically verify
    if (token && email && !hasVerified.current && !verifying && !verified) {
      hasVerified.current = true; // Mark as attempted to prevent double execution
      handleVerification();
    }
  }, [token, email]); // Keep dependencies but use ref to prevent double execution

  useEffect(() => {
    // Cooldown timer for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerification = async () => {
    if (!token || !email || verifying) return; // Add verifying check
    
    setVerifying(true);
    setError('');
    
    try {
      const result = await verifyEmail(token, email);
      if (result.success) {
        setVerified(true);
        // Auto redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigateToDashboard();
        }, 3000);
      } else {
        setError('Verification failed. The link may be expired or invalid.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Verification failed. The link may be expired or invalid.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email || resendCooldown > 0) return;
    
    try {
      const result = await resendVerificationEmail(email);
      if (result.success) {
        setResendCooldown(60); // 60 second cooldown
        // Reset verification attempt flag so user can try again
        hasVerified.current = false;
        setError('');
      }
    } catch (error) {
      console.error('Resend error:', error);
    }
  };

  const handleBackToSignup = () => {
    navigate('/signup');
  };

  const handleGoToSignin = () => {
    navigate('/signin');
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">No email address found for verification.</p>
            <Button onClick={handleBackToSignup} className="w-full">
              Back to Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900">SkillBridge</span>
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 mb-6 rounded-full flex items-center justify-center" 
                 style={{ 
                   backgroundColor: verified ? '#dcfce7' : verifying ? '#dbeafe' : error ? '#fee2e2' : '#e0f2fe' 
                 }}>
              {verified ? (
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : verifying ? (
                <div className="w-10 h-10 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
              ) : error ? (
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <CardTitle className="text-xl">
              {verified ? 'Email Verified!' : verifying ? 'Verifying...' : error ? 'Verification Failed' : 'Check Your Email'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            {verified ? (
              <>
                <div className="space-y-3">
                  <p className="text-green-600 font-medium text-lg">
                    🎉 Welcome to SkillBridge!
                  </p>
                  <p className="text-gray-600">
                    Your {userType === 'jobseeker' ? 'student' : 'employer'} account has been successfully verified. 
                    You will be redirected to your dashboard in a few seconds.
                  </p>
                </div>
                <Button onClick={() => navigate('/dashboard')} className="w-full h-11 bg-green-600 hover:bg-green-700">
                  Go to Dashboard
                </Button>
              </>
            ) : verifying ? (
              <>
                <div className="space-y-3">
                  <p className="text-blue-600 font-medium">
                    Verifying your email address...
                  </p>
                  <p className="text-gray-600">
                    Please wait while we verify your account.
                  </p>
                </div>
              </>
            ) : error ? (
              <>
                <div className="space-y-3">
                  <p className="text-red-600 font-medium">
                    {error}
                  </p>
                  <p className="text-gray-600">
                    The verification link may have expired. You can request a new verification email below.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={handleResendEmail}
                    disabled={resendCooldown > 0}
                    className="w-full h-11"
                  >
                    {resendCooldown > 0 
                      ? `Resend in ${resendCooldown}s` 
                      : 'Send New Verification Email'
                    }
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoToSignin}
                    className="w-full h-11"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    We've sent a verification link to:
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <p className="font-medium text-gray-800 break-all">
                      {email}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Check your email</p>
                        <p>Click the verification link to activate your {userType === 'jobseeker' ? 'student' : 'employer'} account. If you don't see the email, check your spam folder.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <p className="text-sm text-gray-600 font-medium">
                    Didn't receive the email?
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={resendCooldown > 0}
                    className="w-full h-11"
                  >
                    {resendCooldown > 0 
                      ? `Resend in ${resendCooldown}s` 
                      : 'Resend Verification Email'
                    }
                  </Button>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button
                    variant="ghost"
                    onClick={handleGoToSignin}
                    className="w-full h-11"
                  >
                    Back to Sign In
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleBackToSignup}
                    className="w-full h-11"
                  >
                    Sign Up with Different Email
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
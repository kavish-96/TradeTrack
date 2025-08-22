import React, { useState } from 'react';
import { apiPost } from '../../lib/api';

const ForgotPassword = ({ onBackToLogin }) => {
  const [step, setStep] = useState('request'); // request | verify | set | done
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submitRequest = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      setLoading(true);
      const response = await apiPost('/api/accounts/password-reset/request/', { email });
      setMessage(`Reset code sent to ${email}. Please check your inbox and enter the code below.`);
      setStep('verify');
    } catch (e) {
      const data = e.data || {};
      const msg = typeof data === 'object' && data.email ? data.email : 'Failed to send code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const submitVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      setLoading(true);
      await apiPost('/api/accounts/password-reset/verify/', { email, code });
      setMessage('Code verified. Set your new password.');
      setStep('set');
    } catch (e) {
      const data = e.data || {};
      let msg = 'Invalid or expired code';
      if (typeof data === 'object' && (data.code || data.email)) {
        msg = data.code || data.email;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const submitSet = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      setLoading(true);
      await apiPost('/api/accounts/password-reset/confirm/', { email, code, new_password: newPassword });
      setMessage('Password reset successfully. You can now sign in.');
      setStep('done');
    } catch (e) {
      const data = e.data || {};
      let msg = 'Password does not meet requirements';
      if (typeof data === 'object' && data.new_password) {
        msg = Array.isArray(data.new_password) ? data.new_password.join(', ') : data.new_password;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'request':
  return (
          <form className="space-y-6" onSubmit={submitRequest}>
            <div className="card p-8 space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">Reset Password</h3>
                <p className="text-neutral-600">Enter your email to receive a reset code</p>
        </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input 
                    className="input-field pl-12" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="Enter your email address" 
                  />
                </div>
              </div>

              {error && <div className="form-error">{error}</div>}
              {message && <div className="form-success">{message}</div>}

              <button 
                type="submit" 
                className="w-full btn-primary py-4 text-lg font-semibold" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner w-5 h-5"></div>
                    <span>Sending Code...</span>
                  </div>
                ) : (
                  'Send Reset Code'
                )}
              </button>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={onBackToLogin} 
                  className="text-sm text-neutral-600 hover:text-neutral-800 font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to login</span>
                </button>
              </div>
            </div>
          </form>
        );

      case 'verify':
        return (
          <form className="space-y-6" onSubmit={submitVerify}>
            <div className="card p-8 space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-warning-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">Verify Code</h3>
                <p className="text-neutral-600">Check your email and enter the 6-digit code</p>
              </div>
              
              <div className="form-group">
                <label className="form-label">Verification Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input 
                    className="input-field pl-12 text-center text-2xl font-mono tracking-widest" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    maxLength={6} 
                    required 
                    placeholder="000000" 
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2 text-center">Enter the 6-digit code sent to {email}</p>
              </div>

              {error && <div className="form-error">{error}</div>}
              {message && <div className="form-success">{message}</div>}

              <button 
                type="submit" 
                className="w-full btn-primary py-4 text-lg font-semibold" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner w-5 h-5"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Code'
                )}
              </button>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={onBackToLogin} 
                  className="text-sm text-neutral-600 hover:text-neutral-800 font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to login</span>
                </button>
              </div>
            </div>
          </form>
        );

      case 'set':
        return (
          <form className="space-y-6" onSubmit={submitSet}>
            <div className="card p-8 space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">Set New Password</h3>
                <p className="text-neutral-600">Create a strong, secure password</p>
              </div>
              
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    className="input-field pl-12 pr-12" 
                    type={showPw ? 'text' : 'password'} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    placeholder="Enter new password" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)} 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    {showPw ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="mt-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-xs font-medium text-neutral-700 mb-2">Password requirements:</p>
                  <ul className="text-xs text-neutral-600 space-y-1">
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${newPassword.length >= 8 ? 'bg-success-500' : 'bg-neutral-300'}`}></div>
                      <span>At least 8 characters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${/[a-zA-Z]/.test(newPassword) && /\d/.test(newPassword) ? 'bg-success-500' : 'bg-neutral-300'}`}></div>
                      <span>Include letters and numbers</span>
                    </li>
                  </ul>
                </div>
              </div>

              {error && <div className="form-error">{error}</div>}
              {message && <div className="form-success">{message}</div>}

              <button 
                type="submit" 
                className="w-full btn-primary py-4 text-lg font-semibold" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner w-5 h-5"></div>
                    <span>Resetting...</span>
              </div>
                ) : (
                  'Reset Password'
                )}
              </button>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={onBackToLogin} 
                  className="text-sm text-neutral-600 hover:text-neutral-800 font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to login</span>
                </button>
              </div>
            </div>
          </form>
        );

      case 'done':
        return (
          <div className="card p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Password Reset Complete!</h3>
              <p className="text-neutral-600">Your password has been successfully reset. You can now sign in with your new password.</p>
            </div>
            <button className="btn-primary px-8" onClick={onBackToLogin}>
              Go to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-finance relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <div className="max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold mb-2">Reset Password</h1>
              <p className="text-xl text-white/90 font-light">Secure access to your account</p>
            </div>
            
            {/* Security Features */}
            <div className="space-y-6 mt-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Process</h3>
                  <p className="text-white/80 text-sm">Multi-step verification for your safety</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Verification</h3>
                  <p className="text-white/80 text-sm">Secure code sent to your email</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quick Recovery</h3>
                  <p className="text-white/80 text-sm">Get back to trading in minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-neutral-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-finance rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">Reset Password</h1>
          </div>

          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

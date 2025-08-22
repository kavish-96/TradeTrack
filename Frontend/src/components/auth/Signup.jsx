import React, { useState } from 'react';
import { apiPost } from '../../lib/api';

const TermsModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="card p-8 w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-neutral-900">Terms & Conditions</h3>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="text-sm text-neutral-700 max-h-96 overflow-y-auto space-y-4 pr-2">
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-900">Account Usage</h4>
        <p>By using TradeTrack, you agree to our terms regarding account usage, data handling, and fair use of the platform.</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-900">Financial Disclaimer</h4>
          <p>We do not provide financial advice. All data is for informational purposes only. Investment decisions should be made based on your own research and consultation with financial professionals.</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-900">Security</h4>
          <p>Your account security is your responsibility. Use a strong password and keep it confidential. We implement industry-standard security measures to protect your data.</p>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-900">Privacy</h4>
          <p>See our privacy policy for detailed information about how we process and protect your personal data.</p>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <button className="btn-primary" onClick={onClose}>I Understand</button>
      </div>
    </div>
  </div>
);

const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', agreeTerms: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccess('');
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    if (!formData.agreeTerms) {
      setFieldErrors({ agreeTerms: 'You must accept the Terms & Conditions' });
      return;
    }
    try {
      setLoading(true);
      await apiPost('/api/accounts/register/', {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        first_name: '',
        last_name: ''
      });
      setSuccess('Account created successfully! Please sign in.');
    } catch (err) {
      const data = err.data || {};
      if (typeof data === 'object') {
        setFieldErrors({
          username: Array.isArray(data.username) ? data.username.join(', ') : data.username,
          email: Array.isArray(data.email) ? data.email.join(', ') : data.email,
          password: Array.isArray(data.password) ? data.password.join(', ') : data.password,
          non_field_errors: Array.isArray(data.non_field_errors) ? data.non_field_errors.join(', ') : data.non_field_errors
        });
      } else {
        setError('Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const PasswordHints = () => (
    <div className="mt-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
      <p className="text-xs font-medium text-neutral-700 mb-2">Password requirements:</p>
      <ul className="text-xs text-neutral-600 space-y-1">
        <li className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-success-500' : 'bg-neutral-300'}`}></div>
          <span>At least 8 characters</span>
        </li>
        <li className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${/[a-zA-Z]/.test(formData.password) && /\d/.test(formData.password) ? 'bg-success-500' : 'bg-neutral-300'}`}></div>
          <span>Include letters and numbers</span>
        </li>
        <li className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-success-500' : 'bg-neutral-300'}`}></div>
          <span>Include special characters</span>
        </li>
    </ul>
    </div>
  );

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold mb-2">Join TradeTrack</h1>
              <p className="text-xl text-white/90 font-light">Start your investment journey today</p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-6 mt-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
        </div>
              <div>
                  <h3 className="font-semibold text-lg">Free to Start</h3>
                  <p className="text-white/80 text-sm">No hidden fees, no minimum balance</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
              </div>
              <div>
                  <h3 className="font-semibold text-lg">Instant Access</h3>
                  <p className="text-white/80 text-sm">Get started in minutes, not days</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
              </div>
              <div>
                  <h3 className="font-semibold text-lg">Password Security</h3>
                  <p className="text-white/80 text-sm">Your data is protected with encryption</p>
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

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-neutral-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-finance rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">Join TradeTrack</h1>
          </div>

          {/* Form Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Create Account</h2>
            <p className="text-neutral-600">Join thousands of smart investors</p>
          </div>

          {/* Signup Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="card p-8 space-y-6">
              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field pl-12 ${fieldErrors.username ? 'error' : ''}`}
                    placeholder="Choose a username"
                  />
                </div>
                {fieldErrors.username && <div className="form-error">{fieldErrors.username}</div>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field pl-12 ${fieldErrors.email ? 'error' : ''}`}
                    placeholder="Enter your email address"
                  />
                </div>
                {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pl-12 pr-12 ${fieldErrors.password ? 'error' : ''}`}
                    placeholder="Create a strong password"
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
                <PasswordHints />
                {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPw2 ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field pl-12 pr-12 ${fieldErrors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw2(!showPw2)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    {showPw2 ? (
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
                {fieldErrors.confirmPassword && <div className="form-error">{fieldErrors.confirmPassword}</div>}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="agreeTerms" className="text-sm text-neutral-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium underline"
                  >
                    Terms & Conditions
                  </button>
                </label>
              </div>
              {fieldErrors.agreeTerms && <div className="form-error">{fieldErrors.agreeTerms}</div>}

              {/* Error & Success Messages */}
              {error && <div className="form-error">{error}</div>}
              {success && <div className="form-success">{success}</div>}
              {fieldErrors.non_field_errors && <div className="form-error">{fieldErrors.non_field_errors}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-primary py-4 text-lg font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner w-5 h-5"></div>
                    <span>Creating Account...</span>
            </div>
                ) : (
                  'Create Account'
                )}
              </button>
          </div>
        </form>

          {/* Sign In Link */}
        <div className="text-center">
            <p className="text-neutral-600">
            Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
};

export default Signup;
import React, { useState } from 'react';
import { apiPost } from '../../lib/api';

const TermsModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
      <h3 className="text-xl font-bold mb-2">Terms & Conditions</h3>
      <div className="text-sm text-gray-700 max-h-80 overflow-y-auto space-y-2">
        <p>By using TradeTrack, you agree to our terms regarding account usage, data handling, and fair use of the platform.</p>
        <p>We do not provide financial advice. All data is for informational purposes only.</p>
        <p>Your account security is your responsibility. Use a strong password and keep it confidential.</p>
        <p>See our privacy policy for data processing details.</p>
      </div>
      <div className="mt-4 text-right">
        <button className="btn-primary" onClick={onClose}>Close</button>
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
      setSuccess('Account created. Please sign in.');
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
    <ul className="text-xs text-gray-600 list-disc pl-5 mt-1">
      <li>At least 8 characters</li>
      <li>Include letters, numbers, and symbols</li>
      <li>Avoid common passwords</li>
    </ul>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 py-12">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">TradeTrack</h2>
          <p className="text-gray-600">Create your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="input-field" placeholder="Enter your username" />
                {fieldErrors.username && <div className="text-error-600 text-xs mt-1">{fieldErrors.username}</div>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="Enter your email" />
                {fieldErrors.email && <div className="text-error-600 text-xs mt-1">{fieldErrors.email}</div>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPw ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className="input-field pr-10" placeholder="Create a password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600">{showPw ? 'Hide' : 'Show'}</button>
                </div>
                <PasswordHints />
                {fieldErrors.password && <div className="text-error-600 text-xs mt-1">{fieldErrors.password}</div>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input id="confirmPassword" name="confirmPassword" type={showPw2 ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange} className="input-field pr-10" placeholder="Confirm your password" />
                  <button type="button" onClick={() => setShowPw2(!showPw2)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600">{showPw2 ? 'Hide' : 'Show'}</button>
                </div>
                {fieldErrors.confirmPassword && <div className="text-error-600 text-xs mt-1">{fieldErrors.confirmPassword}</div>}
              </div>
              <div className="flex items-center">
                <input id="agreeTerms" name="agreeTerms" type="checkbox" required checked={formData.agreeTerms} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <button type="button" onClick={() => setShowTerms(true)} className="text-primary-600 hover:text-primary-500 underline">Terms & Conditions</button>
                </label>
              </div>
              {fieldErrors.agreeTerms && <div className="text-error-600 text-xs mt-1">{fieldErrors.agreeTerms}</div>}
            </div>
            {error && <div className="text-error-600 text-sm mt-2">{error}</div>}
            {success && <div className="text-success-600 text-sm mt-2">{success}</div>}
            <div className="mt-6">
              <button type="submit" className="w-full btn-primary py-3" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
            </div>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="font-medium text-primary-600 hover:text-primary-500">Sign in</button>
          </p>
        </div>
        {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      </div>
    </div>
  );
};

export default Signup;
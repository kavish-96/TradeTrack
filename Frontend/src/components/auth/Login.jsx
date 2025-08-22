import React, { useState } from 'react';
import { apiPost, setTokens } from '../../lib/api';

const Login = ({ onLogin, onSwitchToSignup, onForgotPassword }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const data = await apiPost('/api/auth/token/', { username: formData.email, password: formData.password });
      setTokens(data);
      onLogin();
    } catch (err) {
      const data = err.data || {};
      const msg = typeof data === 'object' && data.detail ? data.detail : 'Invalid credentials. If you do not have an account, please sign up.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">TradeTrack</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="card p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="Enter your email" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" required value={formData.password} onChange={handleChange} className="input-field pr-10" placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600">{showPw ? 'Hide' : 'Show'}</button>
                </div>
              </div>
            </div>
            {error && <div className="text-error-600 text-sm mt-2">{error}</div>}
            <div className="mt-6">
              <button type="submit" className="w-full btn-primary py-3" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
            </div>
            <div className="mt-4 text-center">
              <button type="button" onClick={onForgotPassword} className="text-sm text-primary-600 hover:text-primary-500">Forgot your password?</button>
            </div>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={onSwitchToSignup} className="font-medium text-primary-600 hover:text-primary-500">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
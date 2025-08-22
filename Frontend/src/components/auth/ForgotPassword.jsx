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
      await apiPost('/api/accounts/password-reset/request/', { email });
      setMessage('Code sent to your email. Enter it below.');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">TradeTrack</h2>
          <p className="text-gray-600">Reset your password</p>
        </div>

        {step === 'request' && (
          <form className="mt-8 space-y-6" onSubmit={submitRequest}>
            <div className="card p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input className="input-field" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="Enter your email" />
              {error && <div className="text-error-600 text-sm mt-2">{error}</div>}
              {message && <div className="text-success-600 text-sm mt-2">{message}</div>}
              <div className="mt-6">
                <button type="submit" className="w-full btn-primary py-3" disabled={loading}>{loading ? 'Sending...' : 'Send Code'}</button>
              </div>
              <div className="mt-4 text-center">
                <button type="button" onClick={onBackToLogin} className="text-sm text-gray-600 hover:text-gray-500">← Back to login</button>
              </div>
            </div>
          </form>
        )}

        {step === 'verify' && (
          <form className="mt-8 space-y-6" onSubmit={submitVerify}>
            <div className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input className="input-field" value={code} onChange={(e)=>setCode(e.target.value)} maxLength={6} required placeholder="6-digit code" />
              </div>
              {error && <div className="text-error-600 text-sm">{error}</div>}
              {message && <div className="text-success-600 text-sm">{message}</div>}
              <div className="mt-6">
                <button type="submit" className="w-full btn-primary py-3" disabled={loading}>{loading ? 'Verifying...' : 'Verify Code'}</button>
              </div>
              <div className="mt-4 text-center">
                <button type="button" onClick={onBackToLogin} className="text-sm text-gray-600 hover:text-gray-500">← Back to login</button>
              </div>
            </div>
          </form>
        )}

        {step === 'set' && (
          <form className="mt-8 space-y-6" onSubmit={submitSet}>
            <div className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input className="input-field pr-10" type={showPw ? 'text' : 'password'} value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required placeholder="Enter new password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600">{showPw ? 'Hide' : 'Show'}</button>
                </div>
                <div className="text-xs text-gray-600 mt-1">Password must meet strength requirements.</div>
              </div>
              {error && <div className="text-error-600 text-sm">{error}</div>}
              {message && <div className="text-success-600 text-sm">{message}</div>}
              <div className="mt-6">
                <button type="submit" className="w-full btn-primary py-3" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
              </div>
              <div className="mt-4 text-center">
                <button type="button" onClick={onBackToLogin} className="text-sm text-gray-600 hover:text-gray-500">← Back to login</button>
              </div>
            </div>
          </form>
        )}

        {step === 'done' && (
          <div className="card p-6 text-center">
            <div className="text-success-600 font-semibold mb-2">Password reset successfully.</div>
            <button className="btn-primary" onClick={onBackToLogin}>Go to Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

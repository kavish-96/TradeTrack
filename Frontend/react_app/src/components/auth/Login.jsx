import React, { useState } from 'react';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactor: ''
  });
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!showTwoFactor) {
      setShowTwoFactor(true);
    } else {
      onLogin();
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
              {!showTwoFactor ? (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your password"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="twoFactor" className="block text-sm font-medium text-gray-700 mb-1">
                    Two-Factor Authentication Code
                  </label>
                  <input
                    id="twoFactor"
                    name="twoFactor"
                    type="text"
                    required
                    value={formData.twoFactor}
                    onChange={handleChange}
                    className="input-field text-center tracking-widest"
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="w-full btn-primary py-3"
              >
                {!showTwoFactor ? 'Continue' : 'Sign In'}
              </button>
            </div>
            
            {!showTwoFactor && (
              <div className="mt-4 text-center">
                <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            )}
            
            {showTwoFactor && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowTwoFactor(false)}
                  className="text-sm text-gray-600 hover:text-gray-500"
                >
                  ← Back to login
                </button>
              </div>
            )}
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
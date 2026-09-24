import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { APP_NAME } from '../config/constants';
import { Sparkles, LogIn, Key, Mail, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please provide both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        showSuccess('Logged in successfully!');
        const role = res.data.role;
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'staff') navigate('/staff/dashboard');
        else navigate(from);
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Sign in to your {APP_NAME} account</p>
        </div>

        {/* Demo Credentials Quick Selector */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <p className="font-semibold text-slate-700 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-600" /> One-Click Demo Logins:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('customer@eventease.com', 'Customer@12345')}
              className="py-1.5 px-2 bg-white hover:bg-brand-50 border border-slate-200 rounded-lg font-semibold text-slate-800 text-[11px] transition-colors"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@eventease.com', 'Admin@12345')}
              className="py-1.5 px-2 bg-white hover:bg-brand-50 border border-slate-200 rounded-lg font-semibold text-slate-800 text-[11px] transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('staff@eventease.com', 'Staff@12345')}
              className="py-1.5 px-2 bg-white hover:bg-brand-50 border border-slate-200 rounded-lg font-semibold text-slate-800 text-[11px] transition-colors"
            >
              Staff
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@eventease.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Register as Customer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

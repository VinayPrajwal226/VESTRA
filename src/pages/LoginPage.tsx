import React, { useState } from 'react';
import { ArrowRight, Lock, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role: 'customer' | 'admin') => {
    setLoading(true);
    setError('');
    try {
      await demoLogin(role);
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Demo sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block">
          Client Authentication
        </span>
        <h1 className="text-3xl font-serif text-[#1C1917]">
          Sign In to VESTRA
        </h1>
        <p className="text-xs text-[#57534E]">
          Access your personal acquisitions, concierge tracking, and reserved sizing.
        </p>
      </div>

      {/* Demo Credentials Quick-Access Box */}
      <div className="bg-[#F5F5F3] p-4 border border-[#E7E5E4] space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#44403C] block">
          Portfolio Instant Access
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoSignIn('customer')}
            className="bg-white border border-[#E7E5E4] py-2 px-3 text-xs font-medium text-[#1C1917] hover:border-[#1C1917] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <User className="w-3.5 h-3.5" />
            <span>Demo Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoSignIn('admin')}
            className="bg-[#1C1917] text-white py-2 px-3 text-xs font-medium hover:bg-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Demo Admin</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Traditional Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 border border-[#E7E5E4] space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#44403C]">
              Password
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[11px] text-[#78716C] hover:text-[#1C1917] underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C1917] text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-4 border-t border-[#E7E5E4] text-center text-xs text-[#78716C]">
          <span>Not yet enrolled in the atelier? </span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-[#1C1917] font-semibold underline underline-offset-2 cursor-pointer"
          >
            Create an Account
          </button>
        </div>
      </form>
    </div>
  );
};

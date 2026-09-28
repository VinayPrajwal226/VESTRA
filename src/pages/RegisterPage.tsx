import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({ name, email, password, role });
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block">
          Client Enrollment
        </span>
        <h1 className="text-3xl font-serif text-[#1C1917]">
          Create a VESTRA Account
        </h1>
        <p className="text-xs text-[#57534E]">
          Register for tailored sizing profiles, private release notifications, and order tracking.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 border border-[#E7E5E4] space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
            Full Legal Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
          />
        </div>

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
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
            Password (min 6 characters)
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
          />
        </div>

        {/* Demo role toggle */}
        <div className="pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
            Account Clearance Role
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-2 border text-center font-medium cursor-pointer transition-colors ${
                role === 'customer'
                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                  : 'bg-[#FAFAF9] text-[#78716C] border-[#E7E5E4]'
              }`}
            >
              Client Collector
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-2 border text-center font-medium cursor-pointer transition-colors ${
                role === 'admin'
                  ? 'bg-[#1C1917] text-white border-[#1C1917]'
                  : 'bg-[#FAFAF9] text-[#78716C] border-[#E7E5E4]'
              }`}
            >
              Atelier Administrator
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C1917] text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
        >
          {loading ? 'Creating Profile...' : 'Complete Enrollment'}
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-4 border-t border-[#E7E5E4] text-center text-xs text-[#78716C]">
          <span>Already hold an atelier profile? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[#1C1917] font-semibold underline underline-offset-2 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

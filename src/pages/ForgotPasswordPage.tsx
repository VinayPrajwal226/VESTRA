import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, KeyRound } from 'lucide-react';
import { api } from '../api/client.ts';

interface ForgotPasswordPageProps {
  navigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [tokenReceived, setTokenReceived] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.forgotPassword(email);
      if (res.success) {
        setMessage(res.message);
        if (res.demoToken) {
          setTokenReceived(res.demoToken);
        }
        setStep('reset');
      }
    } catch (err: any) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.resetPassword({ email, newPassword });
      if (res.success) {
        setStep('done');
      }
    } catch (err: any) {
      setError(err.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div>
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </div>

      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#78716C] block">
          Credential Recovery
        </span>
        <h1 className="text-3xl font-serif text-[#1C1917]">
          Reset Your Access Key
        </h1>
        <p className="text-xs text-[#57534E]">
          Provide your verified email address to receive authorization tokens.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {step === 'request' && (
        <form onSubmit={handleRequestToken} className="bg-white p-6 sm:p-8 border border-[#E7E5E4] space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
              Registered Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. customer@vestra.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAFAF9] border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1917] text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Transmitting Request...' : 'Send Recovery Token'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className="bg-white p-6 sm:p-8 border border-[#E7E5E4] space-y-4">
          {tokenReceived && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <span className="font-semibold block">Simulated Reset Token Dispatched:</span>
              <code className="font-mono bg-white px-2 py-0.5 border border-amber-300 inline-block font-semibold">
                {tokenReceived}
              </code>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#44403C] mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#FAFAF9] border border-[#E7E5E4] p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#1C1917]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1917] text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Updating Credentials...' : 'Store New Password'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {step === 'done' && (
        <div className="bg-white p-8 border border-[#E7E5E4] text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl text-[#1C1917]">Password Updated</h2>
          <p className="text-xs text-[#57534E]">
            Your atelier credentials have been secured. You may now sign in with your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#1C1917] text-white py-3 px-8 text-xs uppercase tracking-wider font-semibold hover:bg-black transition-colors cursor-pointer"
          >
            Proceed to Sign In
          </button>
        </div>
      )}
    </div>
  );
};

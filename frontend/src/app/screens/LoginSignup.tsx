import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { motion } from 'motion/react';
import { cn } from '../utils';
import { useAuth } from '../../services/AuthContext';

export function LoginSignup() {
  const [mode, setMode]         = useState<'login' | 'signup'>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = mode === 'login'
      ? await auth.login(email, password)
      : await auth.signup(email, password);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0, 0, 0.2, 1] }}
        className="w-full max-w-[400px]"
      >
        <div className="bg-black/70 backdrop-blur-md border border-[#C9A86A]/15 rounded-[2px] px-10 py-12">

          {/* Wordmark */}
          <div className="text-center mb-12">
            <button
              onClick={() => navigate('/')}
              className="font-['Cormorant_Garamond'] font-light text-[44px] tracking-[0.2em] text-white uppercase hover:text-[#C9A86A] transition-colors duration-300 leading-none"
            >
              Gaslight
            </button>
            <p className="font-['Inter'] font-light text-xs uppercase tracking-[0.35em] text-[#A39E93]/80 mt-3">
              Defense Simulation Atelier
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex justify-center gap-10 mb-10">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={cn(
                  'font-["Inter"] font-light text-xs uppercase tracking-[0.3em] pb-2 transition-all duration-300 border-b',
                  mode === m
                    ? 'text-[#C9A86A] border-[#C9A86A]/60'
                    : 'text-[#A39E93]/70 border-transparent hover:text-[#A39E93]'
                )}
              >
                {m === 'login' ? 'Sign In' : 'Create Access'}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3 border border-red-400/30 rounded-[2px] bg-red-400/[0.06]"
            >
              <p className="font-['Inter'] font-light text-[11px] text-red-400/90 text-center leading-relaxed">
                {error}
              </p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-['Inter'] font-light text-xs uppercase tracking-[0.35em] text-[#C9A86A]/85">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="atelier@lumina.io"
                className="bg-transparent border-b border-[#C9A86A]/30 px-0 py-3 font-['Inter'] font-light text-sm text-white placeholder:text-[#A39E93]/45 focus:outline-none focus:border-[#C9A86A]/70 transition-colors duration-300"
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-['Inter'] font-light text-xs uppercase tracking-[0.35em] text-[#C9A86A]/85">
                Access Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="bg-transparent border-b border-[#C9A86A]/30 px-0 py-3 font-['Inter'] font-light text-sm text-white placeholder:text-[#A39E93]/45 focus:outline-none focus:border-[#C9A86A]/70 transition-colors duration-300"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" variant="secondary" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border border-[#C9A86A]/30 border-t-[#C9A86A]/70 rounded-full animate-spin" />
                  {mode === 'login' ? 'Authenticating...' : 'Initializing...'}
                </span>
              ) : (
                mode === 'login' ? 'Authenticate' : 'Initialize Access'
              )}
            </Button>
          </form>

          {/* Toggle link */}
          <p className="text-center mt-6 font-['Inter'] font-light text-xs uppercase tracking-[0.2em] text-[#A39E93]/60">
            {mode === 'login' ? 'No clearance?' : 'Already cleared?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
              className="text-[#C9A86A]/75 hover:text-[#C9A86A] transition-colors duration-300 underline underline-offset-4"
            >
              {mode === 'login' ? 'Request Access' : 'Sign In'}
            </button>
          </p>

          {/* Demo credentials quick-fill */}
          <div className="mt-8 pt-6 border-t border-[#C9A86A]/10">
            <button
              type="button"
              onClick={() => {
                setEmail('demo@gaslight.io');
                setPassword('demo1234');
                setMode('login');
                setError(null);
              }}
              className="w-full group flex items-center justify-center gap-3 py-3 px-4 rounded-[2px] border border-dashed border-[#C9A86A]/25 hover:border-[#C9A86A]/50 bg-[#C9A86A]/[0.03] hover:bg-[#C9A86A]/[0.07] transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
              <span className="font-['Inter'] font-light text-[11px] uppercase tracking-[0.25em] text-[#A39E93]/70 group-hover:text-[#C9A86A]/90 transition-colors duration-300">
                Use Demo Credentials
              </span>
            </button>
            <p className="text-center mt-3 font-['Inter'] font-light text-[10px] tracking-[0.15em] text-[#A39E93]/40">
              demo@gaslight.io &nbsp;·&nbsp; demo1234
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

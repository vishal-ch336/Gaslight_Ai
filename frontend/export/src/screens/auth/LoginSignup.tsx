import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../../components/Button';
import { cn } from '../../lib/utils';

const MOCK_EMAIL    = 'atelier@lumina.io';
const MOCK_PASSWORD = 'lumina2026';

export function LoginSignup() {
  const [mode, setMode]         = useState<'login' | 'signup'>('login');
  const [email, setEmail]       = useState(MOCK_EMAIL);
  const [password, setPassword] = useState(MOCK_PASSWORD);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
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
                onClick={() => setMode(m)}
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
              />
            </div>

            <Button type="submit" variant="secondary" className="w-full mt-2">
              {mode === 'login' ? 'Authenticate' : 'Initialize Access'}
            </Button>
          </form>

          {/* Mock credentials hint */}
          <div className="mt-8 px-4 py-3 border border-[#C9A86A]/15 rounded-[2px] bg-[#C9A86A]/[0.05]">
            <p className="font-['Inter'] font-light text-xs uppercase tracking-[0.2em] text-[#A39E93]/75 text-center leading-[2]">
              Demo credentials pre-filled
              <br />
              <span className="text-[#C9A86A]/85">{MOCK_EMAIL}</span>
              {' · '}
              <span className="text-[#C9A86A]/85">{MOCK_PASSWORD}</span>
            </p>
          </div>

          {/* Toggle link */}
          <p className="text-center mt-6 font-['Inter'] font-light text-xs uppercase tracking-[0.2em] text-[#A39E93]/60">
            {mode === 'login' ? 'No clearance?' : 'Already cleared?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[#C9A86A]/75 hover:text-[#C9A86A] transition-colors duration-300 underline underline-offset-4"
            >
              {mode === 'login' ? 'Request Access' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

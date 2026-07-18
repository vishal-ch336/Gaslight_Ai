import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../../components/Button';
import { LandingTicker } from './LandingTicker';

export function LandingHero() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-10 relative z-10">

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0, 0, 0.2, 1] }}
        className="flex items-center gap-4 mb-12"
      >
        <span className="block w-10 h-px bg-[#C9A86A]/50" />
        <span className="font-['Inter'] font-light text-xs uppercase tracking-[0.3em] text-[#C9A86A]">
          AI Defense Simulation · Collection I
        </span>
        <span className="block w-10 h-px bg-[#C9A86A]/50" />
      </motion.div>

      {/* Headline — vignette scoped tightly to this block only */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.5, ease: [0, 0, 0.2, 1] }}
        className="relative mb-8"
      >
        {/* Invisible radial darkening — single color stop, no visible edge/ring */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: '-80px -200px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.52) 0%, transparent 65%)',
            zIndex: 0,
          }}
        />
        <h1
          className="font-['Cormorant_Garamond'] font-light text-center leading-[0.92] tracking-[-0.025em] text-white select-none relative"
          style={{ fontSize: 'clamp(72px, 12vw, 128px)', zIndex: 1 }}
        >
          The Art of
          <br />
          <span className="italic text-[#C9A86A]">Defense.</span>
        </h1>
      </motion.div>

      {/* Subline */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.85 }}
        className="font-['Inter'] font-light text-sm uppercase tracking-[0.22em] text-[#A39E93] text-center max-w-sm mb-14 leading-[2]"
      >
        Execute elegant prompt injection payloads<br />
        against bespoke LLM integrations.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.05, ease: [0, 0, 0.2, 1] }}
      >
        <Button size="lg" onClick={() => navigate('/dashboard')}>
          Enter the Atelier
        </Button>
      </motion.div>

      {/* Ticker — inside the same flex column so mt-20 / w-screen breakout works */}
      <LandingTicker />
    </main>
  );
}

import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { motion } from 'motion/react';
import { useAuth } from '../../services/AuthContext';

const TICKER_CONTENT = 'X-Ray Precision · Curated Defenses · Private Sanctum · AI Defense Simulation · Collection I · ';

const features = [
  {
    num: '01',
    title: 'X-Ray Precision',
    desc: 'Visualize how the language model interprets nuance and structure. Understand every token, every layer of your payload.',
  },
  {
    num: '02',
    title: 'Curated Defenses',
    desc: 'A selection of layered protections, tailored for your specific security needs. Refined over countless simulations.',
  },
  {
    num: '03',
    title: 'Private Sanctum',
    desc: 'Run simulations securely. An isolated environment for absolute discretion and professional confidentiality.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-[5] shadow-[inset_0_0_200px_rgba(0,0,0,0.7)]" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="flex items-center justify-between px-10 md:px-16 py-6 border-b border-[#C9A86A]/15 sticky top-0 z-40 bg-black/55 backdrop-blur-md"
      >
        <button
          onClick={() => navigate('/')}
          className="font-['Cormorant_Garamond'] font-light text-2xl uppercase tracking-[0.3em] text-[#C9A86A] hover:opacity-60 transition-opacity duration-300"
        >
          Gaslight
        </button>
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/auth')}
            className="hidden md:block font-['Inter'] font-light text-xs uppercase tracking-[0.25em] text-[#A39E93] hover:text-[#C9A86A] transition-colors duration-300"
          >
            Login
          </button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/auth')}>
            Initialize
          </Button>
        </div>
      </motion.nav>

      {/* Hero */}
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

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0, 0, 0.2, 1] }}
          className="font-['Cormorant_Garamond'] font-light text-center leading-[0.92] tracking-[-0.025em] text-white mb-8 select-none"
          style={{ fontSize: 'clamp(72px, 12vw, 128px)' }}
        >
          The Art of
          <br />
          <span className="italic text-[#C9A86A]">Defense.</span>
        </motion.h1>

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
          <Button size="lg" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}>
            Enter the Atelier
          </Button>
        </motion.div>

        {/* Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="w-screen mt-20 overflow-hidden border-t border-b border-[#C9A86A]/15 py-3 bg-black/30"
          style={{ marginLeft: 'calc(-50vw + 50%)' }}
        >
          <motion.div
            className="flex whitespace-nowrap"
            style={{ width: 'max-content' }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {[1, 2].map((n) => (
              <span key={n} className="font-['Inter'] font-light text-xs uppercase tracking-[0.28em] text-[#A39E93]/70 px-8">
                {TICKER_CONTENT.repeat(4)}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Feature cards */}
      <section className="px-10 md:px-16 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="font-['Inter'] font-light text-xs uppercase tracking-[0.28em] text-[#C9A86A]/80">
              Capabilities
            </span>
            <span className="flex-1 h-px bg-[#C9A86A]/15" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#C9A86A]/12">
            {features.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.1 + i * 0.12, ease: [0, 0, 0.2, 1] }}
                className="group bg-black/75 backdrop-blur-sm p-10 hover:bg-black/60 transition-colors duration-500"
              >
                <span className="block font-['Inter'] font-light text-xs uppercase tracking-[0.3em] text-[#C9A86A]/70 mb-8">
                  {num}
                </span>
                <h3 className="font-['Cormorant_Garamond'] font-light text-[32px] text-white mb-5 leading-tight group-hover:text-[#C9A86A] transition-colors duration-300">
                  {title}
                </h3>
                <p className="font-['Inter'] font-light text-sm uppercase tracking-[0.15em] text-[#A39E93] leading-[2]">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 1.5 }}
        className="px-10 md:px-16 py-5 border-t border-[#C9A86A]/12 bg-black/50 flex items-center justify-between z-10 relative"
      >
        <span className="font-['Cormorant_Garamond'] font-light text-base tracking-[0.25em] text-[#C9A86A]/80 uppercase">
          Gaslight
        </span>
        <span className="font-['Inter'] font-light text-xs uppercase tracking-[0.2em] text-[#A39E93]/65">
          © 2026 Gaslight Atelier · AI Defense Research
        </span>
      </motion.footer>
    </div>
  );
}

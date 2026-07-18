import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export function LandingNav() {
  const navigate = useNavigate();

  return (
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
        <button
          onClick={() => navigate('/auth')}
          className="font-['Inter'] font-light text-[10px] uppercase tracking-[3.6px] px-3 py-2 rounded-[2px] bg-transparent text-[#C9A86A] border border-[#C9A86A]/50 hover:bg-[#C9A86A]/10 hover:border-[#C9A86A] transition-all duration-300 active:scale-[0.98]"
        >
          Initialize
        </button>
      </div>
    </motion.nav>
  );
}

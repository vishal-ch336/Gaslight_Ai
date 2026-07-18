import React from 'react';
import { motion } from 'motion/react';
import { TICKER_CONTENT } from '../../data/dashboard';

export function LandingTicker() {
  return (
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
  );
}

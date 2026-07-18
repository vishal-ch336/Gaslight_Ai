import React from 'react';
import { motion } from 'motion/react';

export function LandingFooter() {
  return (
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
  );
}

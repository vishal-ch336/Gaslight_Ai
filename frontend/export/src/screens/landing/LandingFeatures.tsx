import React from 'react';
import { motion } from 'motion/react';
import { LANDING_FEATURES } from '../../data/dashboard';

export function LandingFeatures() {
  return (
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
          {LANDING_FEATURES.map(({ num, title, desc }, i) => (
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
  );
}

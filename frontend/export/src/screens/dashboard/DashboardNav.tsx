import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { History } from 'lucide-react';

interface DashboardNavProps {
  onHistoryClick: () => void;
}

export function DashboardNav({ onHistoryClick }: DashboardNavProps) {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-12 border-b border-[#C9A86A]/12 bg-black/80 backdrop-blur-md flex items-center px-6 justify-between shrink-0"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="font-['Cormorant_Garamond'] font-light text-lg tracking-[0.25em] text-[#C9A86A]/90 uppercase hover:text-[#C9A86A] transition-colors duration-300"
        >
          Gaslight
        </button>
        <span className="w-px h-4 bg-[#C9A86A]/15" />
        <span className="font-['Inter'] font-light text-[10px] uppercase tracking-[0.32em] text-[#A39E93]/55">
          Defense Simulator
        </span>
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={onHistoryClick}
          className="flex items-center gap-2 font-['Inter'] font-light text-[10px] uppercase tracking-[0.25em] text-[#A39E93]/55 hover:text-[#C9A86A]/80 transition-colors duration-300"
        >
          <History size={12} />
          History
        </button>
        <button
          onClick={() => navigate('/auth')}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-full border border-[#C9A86A]/25 group-hover:border-[#C9A86A]/55 flex items-center justify-center transition-colors duration-200 bg-[#C9A86A]/[0.06]">
            <span className="font-['Inter'] font-light text-[10px] text-[#C9A86A]/80 uppercase">At</span>
          </div>
        </button>
      </div>
    </motion.header>
  );
}

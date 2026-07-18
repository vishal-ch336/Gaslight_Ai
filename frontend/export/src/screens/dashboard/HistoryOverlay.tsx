import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { HistoryEntry } from '../../types/dashboard';

interface HistoryOverlayProps {
  show: boolean;
  history: HistoryEntry[];
  onClose: () => void;
  onSelectEntry: (entry: HistoryEntry) => void;
}

export function HistoryOverlay({ show, history, onClose, onSelectEntry }: HistoryOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black/88 backdrop-blur-md z-50 flex items-center justify-center p-8"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-black/95 border border-[#C9A86A]/18 rounded-[2px]"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#C9A86A]/10">
              <div>
                <span className="font-['Cormorant_Garamond'] font-light text-2xl text-[#C9A86A] tracking-wide">
                  Execution History
                </span>
                <p className="font-['Inter'] font-light text-[10px] uppercase tracking-[0.25em] text-[#A39E93]/50 mt-1">
                  Session · {history.length} runs
                </p>
              </div>
              <button onClick={onClose} className="text-[#A39E93]/40 hover:text-[#C9A86A]/65 transition-colors duration-200">
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full text-left">
                <thead className="border-b border-[#C9A86A]/8">
                  <tr>
                    {['Attack Name', 'Defenses', 'Result', 'Timestamp'].map((h) => (
                      <th key={h} className="px-6 py-3 font-['Inter'] font-light text-[9px] uppercase tracking-[0.3em] text-[#A39E93]/55">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C9A86A]/5">
                  {history.map((h, i) => (
                    <tr
                      key={i}
                      className="hover:bg-[#C9A86A]/[0.03] transition-colors duration-200 cursor-pointer"
                      onClick={() => onSelectEntry(h)}
                    >
                      <td className="px-6 py-4 font-['Inter'] font-light text-xs text-[#A39E93]/80 max-w-[180px] truncate">{h.name}</td>
                      <td className="px-6 py-4 font-['Inter'] font-light text-sm text-[#A39E93]/60 tracking-tight">{h.defenses}/3</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'font-["Inter"] font-light text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-[2px]',
                          h.result === 'neutralized'
                            ? 'text-[#AED16C]/85 bg-[#AED16C]/8 border border-[#AED16C]/15'
                            : 'text-red-400/85 bg-red-400/8 border border-red-400/15'
                        )}>
                          {h.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[11px] text-[#A39E93]/45">{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

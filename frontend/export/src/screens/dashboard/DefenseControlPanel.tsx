import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Info } from 'lucide-react';
import { Button } from '../../components/Button';
import { Switch } from '../../components/Switch';
import { cn } from '../../lib/utils';
import { DEFENSES } from '../../data/dashboard';
import type { DefenseState, HistoryEntry } from '../../types/dashboard';

interface DefenseControlPanelProps {
  defenses: DefenseState;
  setDefenses: React.Dispatch<React.SetStateAction<DefenseState>>;
  setStatus: (s: 'idle') => void;
  history: HistoryEntry[];
}

export function DefenseControlPanel({
  defenses,
  setDefenses,
  setStatus,
  history,
}: DefenseControlPanelProps) {
  const activeCount = Object.values(defenses).filter(Boolean).length;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.1, delay: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-[268px] border-r border-[#C9A86A]/10 bg-black/72 backdrop-blur-md p-5 flex flex-col gap-5 shrink-0 overflow-y-auto"
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-2">
        <ShieldCheck size={12} className="text-[#C9A86A]/55" />
        <span className="font-['Inter'] font-light text-[9px] uppercase tracking-[0.38em] text-[#C9A86A]/60">
          Defense Control Panel
        </span>
      </div>

      {/* Defense toggles */}
      <div className="flex flex-col gap-4">
        {DEFENSES.map(({ key, level, label, hint }) => (
          <div key={key} className="group border border-[#C9A86A]/8 rounded-[2px] p-3 hover:border-[#C9A86A]/18 transition-colors duration-300">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="font-['Inter'] font-light text-[9px] uppercase tracking-[0.3em] text-[#B8AF9E]">
                  {level}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-['Inter'] font-light text-sm text-[#A39E93] leading-tight">{label}</span>
                  <Info
                    size={10}
                    className="text-[#A39E93]/25 group-hover:text-[#C9A86A]/45 transition-colors duration-300 shrink-0"
                    title={hint}
                  />
                </div>
              </div>
              <Switch
                checked={defenses[key]}
                onChange={(v) => {
                  setDefenses((d) => ({ ...d, [key]: v }));
                  setStatus('idle');
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Active count */}
      <div className="border border-[#C9A86A]/12 rounded-[2px] p-3 bg-[#C9A86A]/[0.04] flex items-center gap-3">
        <span
          className={cn(
            'w-2 h-2 rounded-full shrink-0',
            activeCount > 0 ? 'bg-[#AED16C] animate-pulse' : 'bg-[#A39E93]/30'
          )}
        />
        <div>
          <span className="font-['Inter'] font-normal text-base text-[#C9A86A] tracking-tight leading-none">
            {activeCount}/3
          </span>
          <span className="font-['Inter'] font-light text-[10px] uppercase tracking-[0.22em] text-[#C9A86A]/60 ml-2">
            Active
          </span>
        </div>
      </div>

      {/* Defense History sparkline */}
      <div className="border border-[#C9A86A]/10 rounded-[2px] p-3 bg-[#C9A86A]/[0.02]">
        <span className="font-['Inter'] font-light text-[9px] uppercase tracking-[0.3em] text-[#B8AF9E] block mb-3">
          Defense History
        </span>
        <div className="flex items-end gap-1 h-8">
          {history.slice(0, 8).map((h, i) => {
            const isNeutralized = h.result === 'neutralized';
            return (
              <div
                key={i}
                title={`${h.name} — ${h.result}`}
                className="flex-1 rounded-[1px] transition-opacity duration-200 hover:opacity-100"
                style={{
                  height: `${isNeutralized ? 100 : 45 + Math.random() * 30}%`,
                  backgroundColor: isNeutralized ? '#8FD14F' : '#f87171',
                  opacity: 0.65,
                }}
              />
            );
          })}
          {Array.from({ length: Math.max(0, 8 - history.length) }).map((_, i) => (
            <div key={`pad-${i}`} className="flex-1 rounded-[1px] bg-[#C9A86A]/10" style={{ height: '15%' }} />
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-[#B8AF9E] hover:text-[#C9A86A]"
          onClick={() => {
            setDefenses({ xml: false, blacklist: false, guardian: false });
            setStatus('idle');
          }}
        >
          Reset to Level 0
        </Button>
      </div>
    </motion.aside>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { TerminalSquare, Zap } from 'lucide-react';
import { Button } from '../../components/Button';
import { cn } from '../../lib/utils';
import { PRESETS } from '../../data/dashboard';
import type { AttackStatus, DefenseState, HistoryEntry } from '../../types/dashboard';

interface AttackTerminalProps {
  attackText: string;
  setAttackText: (t: string) => void;
  status: AttackStatus;
  defenses: DefenseState;
  history: HistoryEntry[];
  executeAttack: () => void;
  setStatus: (s: 'idle') => void;
}

export function AttackTerminal({
  attackText,
  setAttackText,
  status,
  defenses,
  history,
  executeAttack,
  setStatus,
}: AttackTerminalProps) {
  const charCount = attackText.length;
  const tokenEst  = Math.ceil(charCount / 4);

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex-1 border-r border-[#C9A86A]/10 bg-black/60 backdrop-blur-md p-5 flex flex-col gap-4 min-w-0"
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-2">
        <TerminalSquare size={12} className="text-[#C9A86A]/55" />
        <span className="font-['Inter'] font-light text-[9px] uppercase tracking-[0.38em] text-[#C9A86A]/60">
          Attack Terminal
        </span>
      </div>

      {/* Preset chips */}
      <div>
        <span className="font-['Inter'] font-light text-[9px] uppercase tracking-[0.3em] text-[#B8AF9E] block mb-2">
          Quick Load
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setAttackText(p.value); setStatus('idle'); }}
              className={cn(
                'px-2.5 py-1 rounded-[2px] border font-["Inter"] font-light text-[9px] uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-200',
                attackText === p.value
                  ? 'border-[#C9A86A]/40 text-[#C9A86A]/90 bg-[#C9A86A]/[0.08]'
                  : 'border-[#C9A86A]/12 text-[#A39E93]/50 hover:border-[#C9A86A]/28 hover:text-[#C9A86A]/70'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payload textarea */}
      <div className="flex flex-col gap-1">
        <div className="relative">
          <textarea
            className="w-full h-[130px] bg-black/65 border border-[#C9A86A]/12 rounded-[2px] p-4 font-mono text-[#AED16C] text-sm resize-none focus:outline-none focus:border-[#C9A86A]/30 transition-colors duration-300 leading-relaxed"
            value={attackText}
            onChange={(e) => { setAttackText(e.target.value); setStatus('idle'); }}
            placeholder=">_ Enter payload sequence..."
            spellCheck={false}
            disabled={status === 'processing'}
          />
          {!attackText && (
            <div className="absolute bottom-3.5 left-[3.25rem] pointer-events-none">
              <span className="inline-block w-[7px] h-[13px] bg-[#AED16C]/40 animate-pulse" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-1">
          <span className="font-mono text-[9px] text-[#A39E93]/35 tracking-wider">{charCount} chars</span>
          <span className="w-px h-3 bg-[#A39E93]/20" />
          <span className="font-mono text-[9px] text-[#A39E93]/35 tracking-wider">~{tokenEst} tokens</span>
        </div>
      </div>

      {/* Execute */}
      <Button
        className="w-full shadow-[0_0_18px_rgba(201,168,106,0.18)] hover:shadow-[0_0_28px_rgba(201,168,106,0.32)] transition-shadow duration-300"
        variant={status === 'processing' ? 'ghost' : 'primary'}
        onClick={executeAttack}
        disabled={status === 'processing' || !attackText.trim()}
      >
        {status === 'processing' ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border border-[#C9A86A]/30 border-t-[#C9A86A]/70 rounded-full animate-spin" />
            {defenses.guardian ? 'Guardian Analyzing... (~4s)' : 'Analyzing Payload...'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap size={12} />
            Execute Attack
          </span>
        )}
      </Button>

      {/* Recent attacks + legend */}
      <div className="border-t border-[#C9A86A]/8 pt-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-['Inter'] font-light text-[9px] uppercase tracking-[0.3em] text-[#A39E93]/65">
            Recent Attacks
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AED16C]" />
              <span className="font-['Inter'] font-light text-[9px] uppercase tracking-[0.15em] text-[#AED16C]/80">Blocked</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="font-['Inter'] font-light text-[9px] uppercase tracking-[0.15em] text-red-400/80">Bypassed</span>
            </span>
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {history.slice(0, 5).map((h, i) => (
            <button
              key={i}
              onClick={() => { setAttackText(h.payload); setStatus('idle'); }}
              className={cn(
                'shrink-0 px-2.5 py-1.5 rounded-[2px] border font-["Inter"] font-light text-[9px] whitespace-nowrap transition-all duration-200 uppercase tracking-[0.12em]',
                h.result === 'compromised'
                  ? 'border-red-400/35 text-red-400 bg-red-400/[0.06] hover:border-red-400/55 hover:bg-red-400/[0.10]'
                  : 'border-[#8FD14F]/35 text-[#8FD14F] bg-[#8FD14F]/[0.06] hover:border-[#8FD14F]/55 hover:bg-[#8FD14F]/[0.10]'
              )}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>
    </motion.main>
  );
}

import React from 'react';
import { cn } from '../utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ checked, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A86A]/50',
        checked
          ? 'bg-[#C9A86A]/20 border-[#C9A86A]/40'
          : 'bg-black/40 border-[#C9A86A]/10'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full shadow transition-all duration-300 ease-in-out',
          checked
            ? 'translate-x-4 bg-[#C9A86A]'
            : 'translate-x-0.5 bg-[#A39E93]/30'
        )}
      />
    </button>
  );
}

import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-[2px] font-['Inter'] font-light uppercase tracking-[3.6px] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:   'bg-[#C9A86A] text-black hover:bg-[#A39E93] hover:text-black',
      secondary: 'bg-transparent text-[#C9A86A] border-[0.8px] border-[#C9A86A]/30 hover:bg-[#C9A86A]/10 hover:border-[#C9A86A]',
      ghost:     'bg-transparent text-[#A39E93] hover:text-[#C9A86A]',
      danger:    'bg-transparent text-[#AED16C] border-[0.8px] border-[#AED16C]/30 hover:bg-[#AED16C]/10',
    };

    const sizes = {
      sm: 'px-3 py-2 text-[10px]',
      md: 'px-4 py-[12px] text-[12px]',
      lg: 'px-8 py-[16px] text-[12px]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

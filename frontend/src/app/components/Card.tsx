import React from 'react';
import { cn } from '../utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  withGlow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, withGlow, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-[2px] bg-transparent",
          withGlow && "before:absolute before:-inset-[1px] before:rounded-[3px] before:bg-[radial-gradient(circle,rgba(201,168,106,0.25)_0.5px,transparent_0.5px)] before:-z-10",
          className
        )}
        {...props}
      >
        <div className={cn(
          "h-full w-full rounded-[2px] p-6",
          "bg-black/40 backdrop-blur-sm",
          "border-[0.8px] border-[#C9A86A]/20",
          className
        )}>
          {children}
        </div>
      </div>
    );
  }
);
Card.displayName = 'Card';

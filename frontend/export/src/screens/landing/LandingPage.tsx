import React from 'react';
import { LandingNav } from './LandingNav';
import { LandingHero } from './LandingHero';
import { LandingFeatures } from './LandingFeatures';
import { LandingFooter } from './LandingFooter';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Edge vignette — inset shadow darkens all four edges */}
      <div className="pointer-events-none fixed inset-0 z-[5] shadow-[inset_0_0_200px_rgba(0,0,0,0.7)]" />

      <LandingNav />
      <LandingHero />   {/* contains ticker as last child of flex column */}
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
}

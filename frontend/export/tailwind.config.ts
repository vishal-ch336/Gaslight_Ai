import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ─── Brand colour tokens ────────────────────────────────────────────────
      // Components use these as arbitrary Tailwind values (e.g. bg-[#C9A86A]).
      // Reference these token names in your own additions (bg-gold-accent, etc.).
      colors: {
        'gold-accent': '#C9A86A',  // primary gold — wordmark, borders, CTA fill
        'warm-grey':   '#A39E93',  // body copy, secondary labels, placeholders
        'label-grey':  '#B8AF9E',  // section eyebrow labels, level labels
        'lime-accent': '#AED16C',  // neutralized state, terminal text, positive
        'lime-bright': '#8FD14F',  // defense-history bars (neutralized)
      },
      // ─── Brand font tokens ──────────────────────────────────────────────────
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        inter:     ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

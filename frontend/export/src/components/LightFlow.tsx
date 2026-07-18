import { useEffect, useRef } from 'react';

type Line = {
  baseY: number;
  amp:   number;
  freqX: number;
  speed: number;
  phase: number;
  core:  number;
  glow:  number;
};

const LINES: Line[] = [
  // ── Upper band (ambient texture — very recessed) ───────────────────
  { baseY: 0.19, amp: 22, freqX: 4.1, speed: 0.013, phase: 0.0, core: 0.15, glow: 0.034 },
  { baseY: 0.23, amp: 17, freqX: 3.4, speed: 0.011, phase: 2.2, core: 0.18, glow: 0.042 },
  { baseY: 0.27, amp: 25, freqX: 4.7, speed: 0.015, phase: 4.1, core: 0.15, glow: 0.034 },

  // ── Center band — all three moderate, middle is the one focal ribbon ─
  { baseY: 0.46, amp: 33, freqX: 3.7, speed: 0.010, phase: 1.0, core: 0.18, glow: 0.042 },
  { baseY: 0.50, amp: 27, freqX: 3.1, speed: 0.008, phase: 2.9, core: 0.45, glow: 0.108 },
  { baseY: 0.54, amp: 31, freqX: 4.0, speed: 0.012, phase: 5.0, core: 0.18, glow: 0.042 },

  // ── Lower band (ambient texture — very recessed) ───────────────────
  { baseY: 0.73, amp: 19, freqX: 4.3, speed: 0.014, phase: 1.8, core: 0.15, glow: 0.034 },
  { baseY: 0.77, amp: 15, freqX: 3.6, speed: 0.010, phase: 3.5, core: 0.18, glow: 0.042 },
  { baseY: 0.81, amp: 22, freqX: 4.9, speed: 0.016, phase: 0.5, core: 0.15, glow: 0.034 },
];

const STEP    = 3;
const REP_R   = 155;
const REP_STR = 112;

export function LightFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    let mx = -9999, my = -9999;
    let frame = 0;
    let raf: number;

    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';

    const tick = () => {
      frame++;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0,0,0,0.97)';
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'screen';

      for (const line of LINES) {
        const drift = Math.sin(frame * 0.0022 + line.phase * 0.55) * 16;

        ctx.beginPath();
        let first = true;
        for (let x = 0; x <= W; x += STEP) {
          const wp = (x / W) * Math.PI * 2 * line.freqX + frame * line.speed + line.phase;
          const ny = line.baseY * H + drift + Math.sin(wp) * line.amp;

          let dy = 0;
          if (mx > -999) {
            const ddx = x - mx;
            const ddy = ny - my;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < REP_R && dist > 0.5) {
              const f = Math.pow((REP_R - dist) / REP_R, 1.5) * REP_STR;
              dy = (ddy / dist) * f;
            }
          }

          const y = ny + dy;
          if (first) { ctx.moveTo(x, y); first = false; }
          else          ctx.lineTo(x, y);
        }

        ctx.lineWidth   = 28;
        ctx.strokeStyle = `rgba(148, 98, 22, ${line.glow * 0.52})`;
        ctx.stroke();

        ctx.lineWidth   = 9;
        ctx.strokeStyle = `rgba(201, 168, 106, ${line.glow * 2.1})`;
        ctx.stroke();

        ctx.lineWidth   = 1.5;
        ctx.strokeStyle = `rgba(255, 236, 155, ${line.core})`;
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(tick);
    };

    tick();

    const onMove   = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave  = () => { mx = -9999; my = -9999; };
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    };

    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize',     onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize',     onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[2] pointer-events-none" />;
}

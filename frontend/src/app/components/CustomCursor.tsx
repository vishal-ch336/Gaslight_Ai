import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const echoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    const echo = echoRef.current;
    if (!dot || !ring || !echo) return;

    const IDLE  = 30;  // default ring diameter px
    const HOVER = 21;  // 70% — shrink on interactive elements
    const CLICK = 12;  // 40% — shrink on press

    let mouseX = -200, mouseY = -200;
    let echoX  = -200, echoY  = -200;
    let visible    = false;
    let isPointer  = false;
    let isText     = false;
    let isClicking = false;
    let raf: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Transition strings — applied before changing width/height so CSS transition fires correctly
    const T_SLOW = 'width 150ms ease-out, height 150ms ease-out, box-shadow 150ms ease-out, opacity 200ms ease-out';
    const T_FAST = 'width 80ms ease-out,  height 80ms ease-out,  box-shadow 80ms ease-out,  opacity 200ms ease-out';

    const applyState = () => {
      const v = visible;

      if (isText) {
        // Caret — dot morphs to thin vertical line, ring + echo hidden
        dot.style.width        = '2px';
        dot.style.height       = '18px';
        dot.style.borderRadius = '1px';
        dot.style.opacity      = v ? '1' : '0';
        ring.style.transition  = T_SLOW;
        ring.style.width       = `${IDLE}px`;
        ring.style.height      = `${IDLE}px`;
        ring.style.boxShadow   = 'none';
        ring.style.opacity     = '0';
        echo.style.opacity     = '0';
        return;
      }

      // Restore dot to circle for all non-text states
      dot.style.width        = '7px';
      dot.style.height       = '7px';
      dot.style.borderRadius = '50%';
      dot.style.opacity      = v ? '1' : '0';

      if (isClicking) {
        ring.style.transition = T_FAST;
        ring.style.width      = `${CLICK}px`;
        ring.style.height     = `${CLICK}px`;
        ring.style.boxShadow  = '0 0 8px rgba(255,255,255,0.5)';
        ring.style.opacity    = v ? '1' : '0';
        echo.style.opacity    = '0'; // hidden during click per spec
      } else if (isPointer) {
        ring.style.transition = T_SLOW;
        ring.style.width      = `${HOVER}px`;
        ring.style.height     = `${HOVER}px`;
        ring.style.boxShadow  = '0 0 8px rgba(255,255,255,0.5)';
        ring.style.opacity    = v ? '0.95' : '0';
        echo.style.opacity    = v ? '0.28' : '0';
      } else {
        ring.style.transition = T_SLOW;
        ring.style.width      = `${IDLE}px`;
        ring.style.height     = `${IDLE}px`;
        ring.style.boxShadow  = 'none';
        ring.style.opacity    = v ? '0.5'  : '0';
        echo.style.opacity    = v ? '0.25' : '0';
      }
    };

    // Spawn a temporary ring that expands 1x → 2x and fades 0.6 → 0 over 300ms
    const spawnPulse = (x: number, y: number) => {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed; top: 0; left: 0;
        width: ${IDLE}px; height: ${IDLE}px;
        border-radius: 50%;
        border: 1px solid white;
        mix-blend-mode: exclusion;
        pointer-events: none;
        z-index: 99997;
        opacity: 0.6;
        transform: translate(${x}px, ${y}px) translate(-50%, -50%) scale(1);
        transition: transform 300ms linear, opacity 300ms linear;
        will-change: transform, opacity;
      `;
      document.body.appendChild(el);
      // Two rAF frames ensure the starting state is painted before the transition kicks off
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(2)`;
          el.style.opacity   = '0';
        });
      });
      setTimeout(() => el.remove(), 350);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) {
        // Teleport echo to cursor on first appearance to prevent slide-in from off-screen
        echoX   = mouseX;
        echoY   = mouseY;
        visible = true;
        applyState();
      }

      const target      = e.target as HTMLElement;
      const nextText    = !!target.closest('input, textarea, [contenteditable]');
      const nextPointer = !nextText && !!target.closest('button, a, [role="button"], select, label, [tabindex="0"]');

      if (nextText !== isText || nextPointer !== isPointer) {
        isText    = nextText;
        isPointer = nextPointer;
        applyState();
      }
    };

    const onLeave = () => { visible = false; applyState(); };
    const onEnter = () => { visible = true;  applyState(); };

    const onDown = () => {
      if (isText) return;
      isClicking = true;
      applyState();
      spawnPulse(mouseX, mouseY);
    };

    const onUp = () => {
      isClicking = false;
      applyState();
    };

    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);
    window.addEventListener('mousedown',  onDown);
    window.addEventListener('mouseup',    onUp);

    const tick = () => {
      // Echo trails cursor with ~120ms perceived lag (lerp 0.12 at 60fps)
      echoX = lerp(echoX, mouseX, 0.12);
      echoY = lerp(echoY, mouseY, 0.12);

      // Dot and ring snap directly; echo lerps
      dot.style.transform  = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
      echo.style.transform = `translate(${echoX}px,${echoY}px) translate(-50%,-50%)`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mouseup',    onUp);
    };
  }, []);

  return (
    <>
      {/* Echo ring — always idle size, trails cursor at ~120ms delay */}
      <div
        ref={echoRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '30px',
          height:        '30px',
          borderRadius:  '50%',
          border:        '1px solid white',
          mixBlendMode:  'exclusion',
          pointerEvents: 'none',
          zIndex:        99996,
          opacity:       0,
          willChange:    'transform',
          transition:    'opacity 200ms ease',
        }}
      />
      {/* Center dot — snaps directly to cursor; morphs to caret on text inputs */}
      <div
        ref={dotRef}
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          width:           '7px',
          height:          '7px',
          borderRadius:    '50%',
          backgroundColor: 'white',
          mixBlendMode:    'exclusion',
          pointerEvents:   'none',
          zIndex:          99999,
          opacity:         0,
          willChange:      'transform',
          transition:      'width 150ms ease-out, height 150ms ease-out, border-radius 150ms ease-out, opacity 200ms ease-out',
        }}
      />
      {/* Main ring — position via rAF, size/glow via JS-set CSS transitions */}
      <div
        ref={ringRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '30px',
          height:        '30px',
          borderRadius:  '50%',
          border:        '1px solid white',
          mixBlendMode:  'exclusion',
          pointerEvents: 'none',
          zIndex:        99998,
          opacity:       0,
          willChange:    'transform, width, height',
          transition:    'width 150ms ease-out, height 150ms ease-out, box-shadow 150ms ease-out, opacity 200ms ease-out',
        }}
      />
    </>
  );
}

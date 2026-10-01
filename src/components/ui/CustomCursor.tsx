'use client';

import React, { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only run on non-touch desktop screens
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let rafId: number | null = null;
    let mouseX = -100;
    let mouseY = -100;
    let isHovering = false;
    let currentText = '';

    const cursorEl = cursorRef.current;
    const badgeEl = badgeRef.current;
    const dotEl = dotRef.current;

    if (!cursorEl || !badgeEl || !dotEl) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

          const target = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
          if (target) {
            const interactive = target.closest('button, a, [role="button"], tr, input, select');
            if (interactive) {
              if (!isHovering) {
                isHovering = true;
                dotEl.style.display = 'none';
                badgeEl.style.display = 'block';
              }
              const text = target.closest('tr')
                ? 'INSPECT'
                : target.closest('a')
                ? 'OPEN'
                : 'VIEW';
              if (currentText !== text) {
                currentText = text;
                badgeEl.innerText = text;
              }
            } else if (isHovering) {
              isHovering = false;
              badgeEl.style.display = 'none';
              dotEl.style.display = 'block';
            }
          }

          rafId = null;
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] select-none hidden lg:block will-change-transform"
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
    >
      <div
        ref={badgeRef}
        className="-translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-none bg-[#B78A5A] text-[#0D0D0C] font-mono text-[9px] font-bold tracking-widest uppercase shadow-lg border border-[#F3F0E8]/40 hidden"
      >
        VIEW
      </div>
      <div
        ref={dotRef}
        className="-translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#B78A5A] opacity-80"
      />
    </div>
  );
}

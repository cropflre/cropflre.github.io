/* Lightweight progressive enhancement for NOWEN UI website cards.
 * No build tools, no framework, no interaction required for core content. */
(() => {
  'use strict';
  const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!fine.matches) return;
  let card = null, frame = 0, pointer = null;
  document.addEventListener('pointermove', event => {
    if (!(event.target instanceof Element)) return;
    card = event.target.closest('.product-card');
    if (!card) return;
    pointer = {x: event.clientX, y: event.clientY};
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!card || !card.isConnected || !pointer || !fine.matches) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--nowen-pointer-x', (pointer.x - rect.left) + 'px');
      card.style.setProperty('--nowen-pointer-y', (pointer.y - rect.top) + 'px');
    });
  }, {passive: true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) {cancelAnimationFrame(frame); frame = 0;}
  });
})();
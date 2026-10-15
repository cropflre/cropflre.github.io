/* Lightweight progressive enhancement for NOWEN UI website cards.
 * No build tools, no framework, no interaction required for core content. */
(() => {
  'use strict';
  // Preserve an informative surface if GitHub-hosted screenshots are unavailable.
  document.addEventListener('error', event => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.matches('.note-shot, .studio-preview-image')) return;
    const fallback = document.createElement('div');
    fallback.className = 'nowen-image-fallback';
    fallback.setAttribute('role', 'img');
    fallback.setAttribute('aria-label', img.alt || '产品界面截图');
    fallback.textContent = '产品截图暂时无法加载，请查看正式版发布页面。';
    img.replaceWith(fallback);
  }, true);
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
/* Lightweight progressive enhancement for NOWEN website.
 * No build tools, no pointer-tracking glow, static state remains readable. */
(() => {
  'use strict';

  // Preserve an informative surface if a screenshot fails to load.
  document.addEventListener('error', event => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement) || !img.matches('.note-shot, .studio-preview-image')) return;
    const fallback = document.createElement('div');
    fallback.className = 'nowen-image-fallback';
    fallback.setAttribute('role', 'img');
    fallback.setAttribute('aria-label', img.alt || '产品界面截图');
    fallback.textContent = '产品截图暂时无法加载，可以直接查看正式版发布页面。';
    img.replaceWith(fallback);
  }, true);

  // Brief highlight on screenshot callout click (keyboard & reduced-motion friendly).
  let clearTimer = 0;
  function clearHighlights(scope = document) {
    if (clearTimer) {
      window.clearTimeout(clearTimer);
      clearTimer = 0;
    }
    scope.querySelectorAll('.shot-focus-box.is-active').forEach(el => el.classList.remove('is-active'));
    scope.querySelectorAll('.shot-note-item.is-active').forEach(el => el.classList.remove('is-active'));
    scope.querySelectorAll('[data-shot-focus][aria-pressed="true"]').forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
    });
  }

  document.addEventListener('click', event => {
    const trigger = event.target instanceof Element ? event.target.closest('[data-shot-focus]') : null;
    if (!trigger) return;
    const target = trigger.getAttribute('data-shot-focus');
    const preview = trigger.closest('.studio-preview');
    if (!target || !preview) return;

    const alreadyActive = trigger.getAttribute('aria-pressed') === 'true';
    clearHighlights(preview);
    if (alreadyActive) return;

    const box = preview.querySelector(`.shot-focus-box[data-focus-target="${target}"]`);
    const noteItem = trigger.closest('.shot-note-item');
    if (!box) return;

    box.classList.add('is-active');
    noteItem?.classList.add('is-active');
    trigger.setAttribute('aria-pressed', 'true');

    const status = preview.querySelector('.shot-live-status');
    if (status) {
      status.textContent = box.getAttribute('data-focus-label') || '已标出截图对应位置';
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    clearTimer = window.setTimeout(() => {
      clearHighlights(preview);
    }, reduced ? 3200 : 2600);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') clearHighlights(document);
  });
})();

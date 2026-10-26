/* Lazy, non-blocking site counter. Only count production visits. */
(() => {
  'use strict';

  const hostname = window.location.hostname.toLowerCase();
  if (hostname !== 'nowen.cn' && hostname !== 'www.nowen.cn') return;
  if (!document.getElementById('busuanzi_site_pv') || !document.getElementById('busuanzi_site_uv')) return;

  // The provider owns persistent PV/UV data; this site never fabricates or caches figures.
  // Loading asynchronously keeps a slow statistics provider from blocking app navigation.
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js';
  script.onerror = () => {
    // The placeholders remain "—" if the service is blocked or unreachable.
    const stats = document.querySelector('.site-visit-stats');
    if (stats) stats.title = '访问统计暂不可用 / Visit statistics unavailable';
  };
  document.head.appendChild(script);
})();

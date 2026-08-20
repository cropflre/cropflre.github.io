(() => {
  'use strict';

  const data = window.NOWEN_HELP;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const RECENT_KEY = 'nowen-help-recent-v3';
  const readyProducts = () => data.products.filter(p => p.status === 'ready' && data[p.id]?.articles?.length);

  function collection(productId) { return data[productId]; }
  function productInfo(productId) { return data.products.find(p => p.id === productId); }
  function articleMap(productId) { return Object.fromEntries((collection(productId)?.articles || []).map(a => [a.slug, a])); }
  function groupFor(productId, article) { return collection(productId)?.groups?.find(g => g.id === article.group); }
  function articleHref(productId, slug) { return `#/${productId}/${slug}`; }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
  }
  function escapeRegExp(value = '') { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function highlight(text, query) {
    const safe = escapeHtml(text);
    const tokens = query.trim().split(/\s+/).filter(Boolean).sort((a,b) => b.length - a.length);
    if (!tokens.length) return safe;
    const re = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('nowen-help-theme', theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0b1020' : '#f6f7fb';
  }
  function initTheme() {
    const saved = localStorage.getItem('nowen-help-theme');
    const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (systemDark ? 'dark' : 'light'));
    $('#themeToggle')?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  }

  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, '');
    if (!raw) return { type: 'home' };
    const [product, slug] = raw.split('/').filter(Boolean);
    const info = productInfo(product);
    if (!info) return { type: 'home' };
    if (info.status !== 'ready' || !collection(product)?.articles) return { type: 'coming', product };
    return slug ? { type: 'article', product, slug } : { type: 'product', product };
  }

  function readRecent() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').filter(Boolean); }
    catch { return []; }
  }
  function saveRecent(product, slug) {
    const current = readRecent().filter(x => !(x.product === product && x.slug === slug));
    current.unshift({ product, slug, at: Date.now() });
    localStorage.setItem(RECENT_KEY, JSON.stringify(current.slice(0, 8)));
  }
  function recentItems(limit = 6) {
    return readRecent().map(item => {
      const article = articleMap(item.product)[item.slug];
      const product = productInfo(item.product);
      return article && product ? { ...item, article, product } : null;
    }).filter(Boolean).slice(0, limit);
  }

  function productCards() {
    return data.products.map(p => {
      const count = collection(p.id)?.articles?.length || 0;
      return `<a class="product-card ${p.status === 'planned' ? 'is-planned' : ''}" href="#/${p.id}">
        <div class="product-icon">${p.icon}</div>
        <div class="product-title-row"><h3>${escapeHtml(p.name)}</h3><span>${escapeHtml(p.cn)}</span></div>
        <p>${escapeHtml(p.desc)}</p>
        <div class="product-bottom"><span class="status ${p.status}">${p.status === 'ready' ? `${count} 篇教程` : '即将上线'}</span><span class="arrow">→</span></div>
      </a>`;
    }).join('');
  }

  function popularItems() {
    const out = [];
    readyProducts().forEach(p => {
      const c = collection(p.id);
      const map = articleMap(p.id);
      (c.popular || []).slice(0, 4).forEach(slug => map[slug] && out.push({ product: p, article: map[slug], group: groupFor(p.id, map[slug]) }));
    });
    return out.slice(0, 8);
  }
  function popularCards() {
    return popularItems().map(({ product, article, group }) => `<a class="topic-card" href="${articleHref(product.id, article.slug)}">
      <span class="topic-icon">${group?.icon || product.icon}</span>
      <div><span class="product-chip">${escapeHtml(product.name)}</span><b>${escapeHtml(article.title)}</b><p>${escapeHtml(article.summary)}</p></div>
      <span class="topic-arrow">→</span>
    </a>`).join('');
  }

  function recentSection() {
    const items = recentItems();
    if (!items.length) return '';
    return `<section class="home-section recent-section">
      <div class="section-head"><div><span>RECENT</span><h2>最近浏览</h2></div><button class="text-btn" type="button" id="clearRecent">清除记录</button></div>
      <div class="recent-grid">${items.map(({ product, article }) => `<a class="recent-card" href="${articleHref(product.id, article.slug)}"><span>${product.icon}</span><div><small>${escapeHtml(product.name)}</small><b>${escapeHtml(article.title)}</b></div><i>→</i></a>`).join('')}</div>
    </section>`;
  }

  function renderHome() {
    $('#appMain').innerHTML = `
      <section class="hero-shell">
        <div class="hero-copy">
          <span class="eyebrow">NOWEN OPEN SOURCE LAB · HELP CENTER</span>
          <h1>一个入口，找到所有 <em>Nowen 使用答案</em></h1>
          <p>从第一次安装到高级功能，从日常使用到故障排查。统一维护 Nowen Note、Reader、Video 与 NOWEN 书签的官方使用教程。</p>
          <div class="hero-search search-box"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="heroSearch" type="search" placeholder="例如：NAS 部署、OPDS、图片加载失败、MCP…" autocomplete="off" /><kbd>Enter</kbd></div>
          <div class="hero-links"><a href="#/note/quick-start">Note 5 分钟上手</a><a href="#/reader/quick-start">Reader 快速部署</a><a href="#/reader/opds">OPDS</a><a href="#/note/mcp">MCP</a></div>
        </div>
        <div class="hero-panel" aria-hidden="true"><div class="window-dots"><i></i><i></i><i></i></div><div class="hero-panel-head"><span>Nowen Help Center</span><span>⌘ K</span></div><div class="hero-panel-grid"><div><small>已上线产品</small><b>Nowen Note</b><b>Nowen Reader</b><b>Nowen Video</b><b>Bookmarks</b></div><div><small>高频问题</small><b>Docker / NAS 部署</b><b>漫画与笔记管理</b><b>Android / OPDS</b><b>备份与故障排查</b></div></div></div>
      </section>
      <section class="home-section"><div class="section-head"><div><span>PRODUCTS</span><h2>选择产品</h2></div><p>统一设计语言，按产品独立维护内容。</p></div><div class="product-grid">${productCards()}</div></section>
      ${recentSection()}
      <section class="home-section soft-section"><div class="section-head"><div><span>POPULAR</span><h2>热门教程</h2></div><p>Nowen Note + Nowen Reader</p></div><div class="topic-grid">${popularCards()}</div></section>
      <section class="home-section trust-row"><div><b>基于真实代码维护</b><span>教程以各产品当前主分支能力为事实基线。</span></div><div><b>真实产品截图</b><span>Reader 教程直接使用项目仓库中的当前界面截图。</span></div><div><b>持续扩展</b><span>Video 与书签继续沿用同一套文档引擎接入。</span></div></section>`;
    document.body.dataset.view = 'home';
    document.title = 'Nowen 帮助中心 · 使用教程与问题解答';
    initHeroSearch();
    $('#clearRecent')?.addEventListener('click', () => { localStorage.removeItem(RECENT_KEY); renderHome(); });
  }

  function sidebarHtml(productId, active = '') {
    const c = collection(productId); const info = productInfo(productId); const meta = c.meta || {};
    const switcher = readyProducts().filter(p => p.id !== productId).map(p => `<a href="#/${p.id}">${p.icon} ${escapeHtml(p.name)}</a>`).join('');
    return `<div class="sidebar-product"><a href="#/" class="back-products">← 全部产品</a><div class="sidebar-product-title"><span>${info.icon}</span><div><b>${escapeHtml(info.name)}</b><small>${escapeHtml(info.cn)}</small></div></div>${switcher ? `<div class="product-switch-mini"><small>切换产品</small>${switcher}</div>` : ''}</div>
      <nav class="sidebar-nav">${c.groups.map(g => `<section class="side-group"><h3><span>${g.icon}</span>${escapeHtml(g.title)}</h3>${c.articles.filter(a => a.group === g.id).map(a => `<a class="side-link ${a.slug === active ? 'active' : ''}" href="${articleHref(productId, a.slug)}">${escapeHtml(a.title)}</a>`).join('')}</section>`).join('')}</nav>
      ${meta.repoUrl ? `<div class="sidebar-repo"><a href="${meta.repoUrl}" target="_blank" rel="noopener">GitHub 仓库 ↗</a><a href="${meta.issues}" target="_blank" rel="noopener">问题反馈 ↗</a></div>` : ''}`;
  }

  function renderDocsShell(productId, inner, active = '') {
    $('#appMain').innerHTML = `<div class="docs-shell"><aside class="docs-sidebar" id="docsSidebar">${sidebarHtml(productId, active)}</aside><div class="docs-content">${inner}</div><aside class="docs-toc" id="docsToc"></aside></div>`;
    document.body.dataset.view = 'docs';
  }

  function renderProduct(productId) {
    const c = collection(productId); const info = productInfo(productId); const meta = c.meta || {};
    const groups = c.groups.map(g => `<section class="guide-group-card"><div class="guide-group-head"><span>${g.icon}</span><div><b>${escapeHtml(g.title)}</b><small>${c.articles.filter(a => a.group === g.id).length} 篇</small></div></div>${c.articles.filter(a => a.group === g.id).map(a => `<a href="${articleHref(productId, a.slug)}"><span>${escapeHtml(a.title)}</span><small>${escapeHtml(a.time)}</small></a>`).join('')}</section>`).join('');
    renderDocsShell(productId, `<div class="product-overview"><nav class="breadcrumbs"><a href="#/">帮助中心</a><span>/</span><span>${escapeHtml(info.name)}</span></nav><div class="product-hero-card"><div class="product-hero-icon">${info.icon}</div><div><span class="eyebrow">${escapeHtml(info.name.toUpperCase())} · ${escapeHtml(info.cn)}</span><h1>${escapeHtml(info.name)} 使用教程</h1><p>${escapeHtml(meta.description || info.desc)}</p><div class="meta-row"><span class="pill ready">${c.articles.length} 篇教程已上线</span><span class="pill">按当前主分支维护</span>${meta.repoUrl ? `<a class="pill link" href="${meta.repoUrl}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}</div></div></div><div class="guide-grid">${groups}</div></div>`);
    const quick = (c.popular || []).slice(0, 6).map(slug => articleMap(productId)[slug]).filter(Boolean);
    $('#docsToc').innerHTML = `<div class="toc-card"><b>快速入口</b>${quick.map(a => `<a href="${articleHref(productId, a.slug)}">${escapeHtml(a.title)}</a>`).join('')}</div>`;
    document.title = `${info.name} 使用教程 · Nowen 帮助中心`;
  }

  function figureHtml(article) {
    if (!article.figure) return '';
    return `<figure class="article-figure lightbox-target"><img src="${article.figure.src}" alt="${escapeHtml(article.figure.alt)}" loading="lazy" /><figcaption>${escapeHtml(article.figure.caption)}</figcaption><button class="image-zoom-hint" type="button" aria-label="放大查看图片">⌕ 点击放大</button></figure>`;
  }

  function pager(productId, slug) {
    const list = collection(productId).articles; const i = list.findIndex(a => a.slug === slug); const prev = list[i - 1]; const next = list[i + 1];
    return `<div class="pager">${prev ? `<a href="${articleHref(productId, prev.slug)}" class="pager-card"><small>← 上一篇</small><b>${escapeHtml(prev.title)}</b></a>` : '<span></span>'}${next ? `<a href="${articleHref(productId, next.slug)}" class="pager-card next"><small>下一篇 →</small><b>${escapeHtml(next.title)}</b></a>` : '<span></span>'}</div>`;
  }

  function tokenSet(article) {
    return new Set(`${article.title} ${article.keywords || ''}`.toLowerCase().split(/[\s/、，,：:·]+/).filter(x => x.length > 1));
  }
  function relatedArticles(productId, article, limit = 3) {
    const target = tokenSet(article);
    return collection(productId).articles.filter(a => a.slug !== article.slug).map(a => {
      let score = a.group === article.group ? 5 : 0;
      tokenSet(a).forEach(t => { if (target.has(t)) score += 2; });
      return { a, score };
    }).filter(x => x.score > 0).sort((x,y) => y.score - x.score).slice(0, limit).map(x => x.a);
  }
  function relatedHtml(productId, article) {
    const related = relatedArticles(productId, article);
    if (!related.length) return '';
    return `<section class="related-section"><div class="related-head"><span>RELATED</span><h2>你可能还需要</h2></div><div class="related-grid">${related.map(a => `<a href="${articleHref(productId, a.slug)}"><small>${escapeHtml(groupFor(productId, a)?.title || '')}</small><b>${escapeHtml(a.title)}</b><span>${escapeHtml(a.summary)}</span><i>→</i></a>`).join('')}</div></section>`;
  }

  function renderArticle(productId, slug) {
    const c = collection(productId); const info = productInfo(productId); const map = articleMap(productId); const article = map[slug] || c.articles[0]; const group = groupFor(productId, article); const meta = c.meta || {};
    saveRecent(productId, article.slug);
    renderDocsShell(productId, `<article class="article-wrap"><nav class="breadcrumbs"><a href="#/">帮助中心</a><span>/</span><a href="#/${productId}">${escapeHtml(info.name)}</a><span>/</span><span>${escapeHtml(group.title)}</span></nav><div class="article-head"><span class="eyebrow">${group.icon} ${escapeHtml(group.title)}</span><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.summary)}</p><div class="meta-row"><span class="pill">阅读约 ${escapeHtml(article.time)}</span><span class="pill">更新于 ${escapeHtml(article.updated)}</span>${meta.docs ? `<a class="pill link" target="_blank" rel="noopener" href="${meta.docs}">仓库文档 ↗</a>` : ''}</div></div>${figureHtml(article)}<div class="prose" id="articleBody">${article.body}</div><div class="article-feedback"><div><b>没有解决你的问题？</b><span>反馈时建议附上版本、平台、部署方式和复现步骤。</span></div>${meta.issues ? `<a target="_blank" rel="noopener" href="${meta.issues}">前往 GitHub Issues ↗</a>` : ''}</div>${relatedHtml(productId, article)}${pager(productId, article.slug)}</article>`, article.slug);
    buildToc();
    initLightbox();
    initFaq();
    document.title = `${article.title} · ${info.name} 帮助中心`;
  }

  function slugify(text, index) {
    const base = text.trim().toLowerCase().replace(/[\s\/：:]+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '').replace(/-+/g, '-');
    return base || `section-${index + 1}`;
  }
  function buildToc() {
    const body = $('#articleBody'); const toc = $('#docsToc'); if (!body || !toc) return;
    const heads = $$('h2,h3', body); const used = new Set();
    heads.forEach((h, i) => { let id = slugify(h.textContent, i); let n = 2; while (used.has(id)) id = `${id}-${n++}`; used.add(id); h.id = id; });
    toc.innerHTML = heads.length ? `<div class="toc-card"><b>本页目录</b>${heads.map(h => `<a class="toc-${h.tagName.toLowerCase()}" href="#${h.id}" data-section="${h.id}">${escapeHtml(h.textContent)}</a>`).join('')}</div>` : '';
    $$('[data-section]', toc).forEach(a => a.addEventListener('click', e => { e.preventDefault(); document.getElementById(a.dataset.section)?.scrollIntoView({ behavior:'smooth', block:'start' }); }));
  }

  function initFaq() {
    $$('.faq-list details').forEach(details => details.addEventListener('toggle', () => {
      if (!details.open) return;
      $$('.faq-list details').forEach(other => { if (other !== details) other.open = false; });
    }));
  }

  function ensureLightbox() {
    if ($('#imageLightbox')) return $('#imageLightbox');
    const box = document.createElement('div');
    box.id = 'imageLightbox'; box.className = 'image-lightbox'; box.setAttribute('aria-hidden', 'true');
    box.innerHTML = `<button type="button" class="lightbox-close" aria-label="关闭图片预览">×</button><div class="lightbox-stage"><img alt="" /><p></p></div>`;
    document.body.appendChild(box);
    const close = () => { box.classList.remove('open'); box.setAttribute('aria-hidden','true'); document.body.classList.remove('lightbox-open'); };
    $('.lightbox-close', box).addEventListener('click', close);
    box.addEventListener('click', e => { if (e.target === box) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) close(); });
    return box;
  }
  function openLightbox(img, caption = '') {
    const box = ensureLightbox(); const preview = $('img', box); preview.src = img.currentSrc || img.src; preview.alt = img.alt || ''; $('p', box).textContent = caption; box.classList.add('open'); box.setAttribute('aria-hidden','false'); document.body.classList.add('lightbox-open'); $('.lightbox-close', box).focus();
  }
  function initLightbox() {
    const root = $('.article-wrap'); if (!root) return;
    $$('figure.article-figure img, .prose img', root).forEach(img => { img.classList.add('zoomable-image'); img.tabIndex = 0; const open = () => openLightbox(img, img.closest('figure')?.querySelector('figcaption')?.textContent || img.alt || ''); img.addEventListener('click', open); img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }); });
    $$('.image-zoom-hint', root).forEach(btn => btn.addEventListener('click', () => { const img = btn.closest('figure')?.querySelector('img'); if (img) openLightbox(img, btn.closest('figure')?.querySelector('figcaption')?.textContent || ''); }));
  }

  function renderComing(productId) {
    const p = productInfo(productId);
    $('#appMain').innerHTML = `<div class="coming-wrap"><div class="coming-icon">${p.icon}</div><span class="eyebrow">COMING SOON</span><h1>${escapeHtml(p.name)}</h1><p>${escapeHtml(p.desc)}</p><div class="coming-actions"><a class="primary-btn" href="#/">返回帮助中心</a><a class="secondary-btn" href="https://github.com/cropflre" target="_blank" rel="noopener">查看 GitHub</a></div></div>`;
    document.body.dataset.view = 'docs'; document.title = `${p.name} · Nowen 帮助中心`;
  }

  function search(query) {
    const q = query.toLowerCase().trim(); if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean); const results = [];
    readyProducts().forEach(product => collection(product.id).articles.forEach(a => {
      const title = a.title.toLowerCase(); const keywords = (a.keywords || '').toLowerCase(); const hay = `${a.title} ${a.summary} ${a.keywords || ''} ${a.body.replace(/<[^>]+>/g,' ')}`.toLowerCase(); let score = 0;
      tokens.forEach(t => { if (title.includes(t)) score += 10; if (keywords.includes(t)) score += 5; if (hay.includes(t)) score += 1; });
      if (score) results.push({ product, article:a, score });
    }));
    return results.sort((a,b) => b.score - a.score).slice(0, 12);
  }

  let searchIndex = -1;
  function showSearch(query) {
    const box = $('#searchResults'); if (!box) return; const results = search(query); searchIndex = -1;
    if (!query.trim()) { box.classList.remove('open'); box.innerHTML = ''; return; }
    box.innerHTML = results.length ? results.map(({ product, article }, i) => `<a data-search-index="${i}" href="${articleHref(product.id, article.slug)}"><div class="search-title-line"><span class="product-chip">${product.icon} ${escapeHtml(product.name)}</span><b>${highlight(article.title, query)}</b></div><span>${highlight(article.summary, query)}</span></a>`).join('') : `<div class="search-empty">没有找到“${escapeHtml(query)}”相关教程</div>`;
    box.classList.add('open');
  }
  function moveSearch(delta) {
    const links = $$('[data-search-index]', $('#searchResults')); if (!links.length) return;
    searchIndex = (searchIndex + delta + links.length) % links.length; links.forEach((a,i) => a.classList.toggle('keyboard-active', i === searchIndex)); links[searchIndex].scrollIntoView({ block:'nearest' });
  }

  function initSearch() {
    const input = $('#globalSearch'); const box = $('#searchResults');
    input?.addEventListener('input', () => showSearch(input.value));
    input?.addEventListener('focus', () => { if (input.value.trim()) showSearch(input.value); });
    input?.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSearch(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveSearch(-1); }
      else if (e.key === 'Enter') { const links = $$('[data-search-index]', box); const target = links[searchIndex] || links[0]; if (target) { e.preventDefault(); location.hash = target.getAttribute('href'); box.classList.remove('open'); } }
      else if (e.key === 'Escape') { box.classList.remove('open'); input.blur(); }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.global-search')) box?.classList.remove('open'); });
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input?.focus(); input?.select(); }
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName || '')) { e.preventDefault(); input?.focus(); }
    });
  }
  function initHeroSearch() {
    const input = $('#heroSearch');
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') { const first = search(input.value)[0]; if (first) location.hash = articleHref(first.product.id, first.article.slug); else $('#globalSearch')?.focus(); } });
  }

  function initMobile() {
    $('#mobileMenu')?.addEventListener('click', () => $('#docsSidebar')?.classList.toggle('open'));
    document.addEventListener('click', e => { if (e.target.closest('.docs-sidebar a')) $('#docsSidebar')?.classList.remove('open'); });
  }

  function renderRoute() {
    const route = parseRoute();
    if (route.type === 'home') renderHome();
    else if (route.type === 'product') renderProduct(route.product);
    else if (route.type === 'article') renderArticle(route.product, route.slug);
    else renderComing(route.product);
    $('#docsSidebar')?.classList.remove('open');
    window.scrollTo({ top:0, behavior:'instant' });
  }

  initTheme();
  initSearch();
  initMobile();
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
})();
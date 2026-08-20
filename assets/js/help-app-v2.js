(() => {
  'use strict';

  const data = window.NOWEN_HELP;
  if (!data) return;

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const note = data.note;
  const articleMap = Object.fromEntries(note.articles.map(a => [a.slug, a]));

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
    $('#themeToggle')?.addEventListener('click', () => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, '');
    if (!raw) return { type: 'home' };
    const [product, slug] = raw.split('/').filter(Boolean);
    if (product === 'note') return slug ? { type: 'article', product, slug } : { type: 'product', product };
    if (['reader', 'video', 'bookmarks'].includes(product)) return { type: 'coming', product };
    return { type: 'home' };
  }

  function groupFor(article) {
    return note.groups.find(g => g.id === article.group);
  }

  function productCards() {
    return data.products.map(p => `
      <a class="product-card ${p.status === 'planned' ? 'is-planned' : ''}" href="#/${p.id}">
        <div class="product-icon">${p.icon}</div>
        <div class="product-title-row"><h3>${p.name}</h3><span>${p.cn}</span></div>
        <p>${p.desc}</p>
        <div class="product-bottom">
          <span class="status ${p.status}">${p.status === 'ready' ? `${note.articles.length} 篇教程` : '即将上线'}</span>
          <span class="arrow">→</span>
        </div>
      </a>`).join('');
  }

  function popularCards() {
    return note.popular.map(slug => articleMap[slug]).filter(Boolean).map(a => {
      const group = groupFor(a);
      return `<a class="topic-card" href="#/note/${a.slug}">
        <span class="topic-icon">${group?.icon || '•'}</span>
        <div><b>${a.title}</b><p>${a.summary}</p></div>
        <span class="topic-arrow">→</span>
      </a>`;
    }).join('');
  }

  function renderHome() {
    $('#appMain').innerHTML = `
      <section class="hero-shell">
        <div class="hero-copy">
          <span class="eyebrow">NOWEN OPEN SOURCE LAB · HELP CENTER</span>
          <h1>一个入口，找到所有 <em>Nowen 使用答案</em></h1>
          <p>从第一次安装到高级功能，从日常使用到故障排查。统一维护 Nowen Note、Reader、Video 与 NOWEN 书签的官方使用教程。</p>
          <div class="hero-search search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input id="heroSearch" type="search" placeholder="例如：NAS 部署、图片加载失败、MCP…" autocomplete="off" />
            <kbd>Enter</kbd>
          </div>
          <div class="hero-links"><a href="#/note/quick-start">5 分钟上手</a><a href="#/note/nas">NAS 部署</a><a href="#/note/faq">常见问题</a><a href="#/note/mcp">MCP</a></div>
        </div>
        <div class="hero-panel" aria-hidden="true">
          <div class="window-dots"><i></i><i></i><i></i></div>
          <div class="hero-panel-head"><span>Nowen Help Center</span><span>⌘ K</span></div>
          <div class="hero-panel-grid">
            <div><small>产品</small><b>Nowen Note</b><b>Reader</b><b>Video</b><b>Bookmarks</b></div>
            <div><small>热门教程</small><b>5 分钟快速上手</b><b>NAS 部署</b><b>Android 连接</b><b>备份与升级</b></div>
          </div>
        </div>
      </section>
      <section class="home-section">
        <div class="section-head"><div><span>PRODUCTS</span><h2>选择产品</h2></div><p>统一设计语言，按产品独立维护内容。</p></div>
        <div class="product-grid">${productCards()}</div>
      </section>
      <section class="home-section soft-section">
        <div class="section-head"><div><span>POPULAR</span><h2>Nowen Note 高频教程</h2></div><a href="#/note">查看全部 ${note.articles.length} 篇 →</a></div>
        <div class="topic-grid">${popularCards()}</div>
      </section>
      <section class="home-section trust-row">
        <div><b>基于真实代码维护</b><span>教程以 nowen-note/main 当前能力为事实基线。</span></div>
        <div><b>为自托管场景设计</b><span>重点覆盖 NAS、Docker、多端与数据安全。</span></div>
        <div><b>多产品可扩展</b><span>Reader、Video、书签无需重做帮助中心骨架。</span></div>
      </section>`;
    document.body.dataset.view = 'home';
    document.title = 'Nowen 帮助中心 · 使用教程与问题解答';
    initHeroSearch();
  }

  function sidebarHtml(active = '') {
    return `
      <div class="sidebar-product">
        <a href="#/" class="back-products">← 全部产品</a>
        <div class="sidebar-product-title"><span>📓</span><div><b>Nowen Note</b><small>弄文笔记</small></div></div>
      </div>
      <nav class="sidebar-nav">
        ${note.groups.map(g => `
          <section class="side-group">
            <h3><span>${g.icon}</span>${g.title}</h3>
            ${note.articles.filter(a => a.group === g.id).map(a => `<a class="side-link ${a.slug === active ? 'active' : ''}" href="#/note/${a.slug}">${a.title}</a>`).join('')}
          </section>`).join('')}
      </nav>`;
  }

  function renderDocsShell(inner, active = '') {
    $('#appMain').innerHTML = `
      <div class="docs-shell">
        <aside class="docs-sidebar" id="docsSidebar">${sidebarHtml(active)}</aside>
        <div class="docs-content">${inner}</div>
        <aside class="docs-toc" id="docsToc"></aside>
      </div>`;
    document.body.dataset.view = 'docs';
  }

  function renderProduct() {
    const groups = note.groups.map(g => `
      <section class="guide-group-card">
        <div class="guide-group-head"><span>${g.icon}</span><div><b>${g.title}</b><small>${note.articles.filter(a => a.group === g.id).length} 篇</small></div></div>
        ${note.articles.filter(a => a.group === g.id).map(a => `<a href="#/note/${a.slug}"><span>${a.title}</span><small>${a.time}</small></a>`).join('')}
      </section>`).join('');
    renderDocsShell(`
      <div class="product-overview">
        <nav class="breadcrumbs"><a href="#/">帮助中心</a><span>/</span><span>Nowen Note</span></nav>
        <div class="product-hero-card">
          <div class="product-hero-icon">📓</div>
          <div><span class="eyebrow">NOWEN NOTE · 弄文笔记</span><h1>Nowen Note 使用教程</h1><p>从第一次部署、写下第一篇笔记，到知识管理、AI、任务、多端、NAS 和数据安全。按目标阅读，不需要从头看到尾。</p>
          <div class="meta-row"><span class="pill ready">${note.articles.length} 篇教程已上线</span><span class="pill">按 main 当前能力维护</span></div></div>
        </div>
        <div class="guide-grid">${groups}</div>
      </div>`);
    $('#docsToc').innerHTML = `<div class="toc-card"><b>快速入口</b><a href="#/note/quick-start">5 分钟上手</a><a href="#/note/nas">NAS 部署</a><a href="#/note/android">Android</a><a href="#/note/faq">常见问题</a><a href="#/note/mcp">MCP</a></div>`;
    document.title = 'Nowen Note 使用教程 · Nowen 帮助中心';
  }

  function figureHtml(article) {
    if (!article.figure) return '';
    return `<figure class="article-figure"><img src="${article.figure.src}" alt="${article.figure.alt}" loading="lazy" /><figcaption>${article.figure.caption}</figcaption></figure>`;
  }

  function pager(slug) {
    const i = note.articles.findIndex(a => a.slug === slug);
    const prev = note.articles[i - 1];
    const next = note.articles[i + 1];
    return `<div class="pager">
      ${prev ? `<a href="#/note/${prev.slug}" class="pager-card"><small>← 上一篇</small><b>${prev.title}</b></a>` : '<span></span>'}
      ${next ? `<a href="#/note/${next.slug}" class="pager-card next"><small>下一篇 →</small><b>${next.title}</b></a>` : '<span></span>'}
    </div>`;
  }

  function renderArticle(slug) {
    const article = articleMap[slug] || articleMap['intro'];
    const group = groupFor(article);
    renderDocsShell(`
      <article class="article-wrap">
        <nav class="breadcrumbs"><a href="#/">帮助中心</a><span>/</span><a href="#/note">Nowen Note</a><span>/</span><span>${group.title}</span></nav>
        <div class="article-head">
          <span class="eyebrow">${group.icon} ${group.title}</span>
          <h1>${article.title}</h1>
          <p>${article.summary}</p>
          <div class="meta-row"><span class="pill">阅读约 ${article.time}</span><span class="pill">更新于 ${article.updated}</span><a class="pill link" target="_blank" rel="noopener" href="https://github.com/cropflre/nowen-note/tree/main/docs/tutorials">仓库教程 ↗</a></div>
        </div>
        ${figureHtml(article)}
        <div class="prose" id="articleBody">${article.body}</div>
        <div class="article-feedback"><div><b>没有解决你的问题？</b><span>提交问题时建议附上 Nowen Note 版本、平台、服务器部署方式和复现步骤。</span></div><a target="_blank" rel="noopener" href="https://github.com/cropflre/nowen-note/issues">前往 GitHub Issues ↗</a></div>
        ${pager(article.slug)}
      </article>`, article.slug);
    buildToc();
    document.title = `${article.title} · Nowen Note 帮助中心`;
  }

  function slugify(text, index) {
    const base = text.trim().toLowerCase().replace(/[\s\/：:]+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '').replace(/-+/g, '-');
    return base || `section-${index + 1}`;
  }

  function buildToc() {
    const body = $('#articleBody');
    const toc = $('#docsToc');
    if (!body || !toc) return;
    const heads = $$('h2,h3', body);
    const used = new Set();
    heads.forEach((h, i) => {
      let id = slugify(h.textContent, i);
      let n = 2;
      while (used.has(id)) id = `${id}-${n++}`;
      used.add(id);
      h.id = id;
    });
    toc.innerHTML = heads.length ? `<div class="toc-card"><b>本页目录</b>${heads.map(h => `<a class="toc-${h.tagName.toLowerCase()}" href="#${h.id}" data-section="${h.id}">${h.textContent}</a>`).join('')}</div>` : '';
    $$('[data-section]', toc).forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById(a.dataset.section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  function renderComing(product) {
    const p = data.products.find(x => x.id === product);
    renderDocsShell(`
      <div class="coming-wrap">
        <div class="coming-icon">${p.icon}</div><span class="eyebrow">COMING SOON</span><h1>${p.name}</h1><p>${p.desc}</p>
        <div class="coming-actions"><a class="primary-btn" href="#/">返回帮助中心</a><a class="secondary-btn" href="https://github.com/cropflre" target="_blank" rel="noopener">查看 GitHub</a></div>
      </div>`);
    $('#docsSidebar').innerHTML = `<div class="sidebar-product"><a href="#/" class="back-products">← 全部产品</a><div class="sidebar-product-title"><span>${p.icon}</span><div><b>${p.name}</b><small>教程建设中</small></div></div></div>`;
    $('#docsToc').innerHTML = '';
    document.title = `${p.name} · Nowen 帮助中心`;
  }

  function search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    return note.articles.map(a => {
      const title = a.title.toLowerCase();
      const hay = `${a.title} ${a.summary} ${a.keywords} ${a.body.replace(/<[^>]+>/g, ' ')}`.toLowerCase();
      let score = 0;
      tokens.forEach(t => { if (title.includes(t)) score += 8; if (a.keywords.toLowerCase().includes(t)) score += 4; if (hay.includes(t)) score += 1; });
      return { a, score };
    }).filter(x => x.score > 0).sort((x, y) => y.score - x.score).slice(0, 9).map(x => x.a);
  }

  function showSearch(query) {
    const box = $('#searchResults');
    if (!box) return;
    const results = search(query);
    if (!query.trim()) { box.classList.remove('open'); box.innerHTML = ''; return; }
    box.innerHTML = results.length ? results.map(a => `<a href="#/note/${a.slug}"><b>${a.title}</b><span>${a.summary}</span></a>`).join('') : `<div class="search-empty">没有找到“${query.replace(/[<>]/g, '')}”相关教程</div>`;
    box.classList.add('open');
  }

  function initGlobalSearch() {
    const input = $('#globalSearch');
    input?.addEventListener('input', () => showSearch(input.value));
    input?.addEventListener('focus', () => { if (input.value.trim()) showSearch(input.value); });
    input?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const first = search(input.value)[0]; if (first) location.hash = `#/note/${first.slug}`; }
      if (e.key === 'Escape') { $('#searchResults')?.classList.remove('open'); input.blur(); }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.global-search')) $('#searchResults')?.classList.remove('open'); });
    document.addEventListener('keydown', e => {
      const tag = document.activeElement?.tagName || '';
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input?.focus(); input?.select(); }
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(tag)) { e.preventDefault(); input?.focus(); }
    });
  }

  function initHeroSearch() {
    const input = $('#heroSearch');
    input?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const first = search(input.value)[0];
        location.hash = first ? `#/note/${first.slug}` : '#/note';
      }
    });
  }

  function initMobile() {
    $('#mobileMenu')?.addEventListener('click', () => $('#docsSidebar')?.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (e.target.closest('.side-link, .back-products')) $('#docsSidebar')?.classList.remove('open');
    });
  }

  function renderRoute() {
    const r = parseRoute();
    if (r.type === 'home') renderHome();
    else if (r.type === 'product') renderProduct();
    else if (r.type === 'article') renderArticle(r.slug);
    else renderComing(r.product);
    $('#docsSidebar')?.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  initTheme();
  initGlobalSearch();
  initMobile();
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
})();

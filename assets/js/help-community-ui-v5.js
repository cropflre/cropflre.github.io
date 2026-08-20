(() => {
  'use strict';

  const data = window.NOWEN_HELP;
  const note = data?.note;
  const community = note?.meta?.community;
  if (!community) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const qqNumber = community.qq.number;

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
  }

  function copyText(value, button) {
    const done = () => {
      if (!button) return;
      const old = button.textContent;
      button.textContent = '已复制';
      button.classList.add('copied');
      window.setTimeout(() => {
        button.textContent = old;
        button.classList.remove('copied');
      }, 1600);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(done).catch(() => fallbackCopy(value, done));
    } else {
      fallbackCopy(value, done);
    }
  }

  function fallbackCopy(value, done) {
    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try { document.execCommand('copy'); done(); } catch (_) { /* no-op */ }
    input.remove();
  }

  function communityCards(compact = false) {
    return `
      <div class="community-v5-cards ${compact ? 'is-compact' : ''}">
        <article class="community-v5-card wechat-card">
          <div class="community-v5-copy">
            <span class="community-v5-kicker">微信公众号</span>
            <h3>${escapeHtml(community.wechat.name)}</h3>
            <p>${escapeHtml(community.wechat.description)}</p>
            <a href="#/note/community">查看社区与反馈说明 →</a>
          </div>
          <button class="community-v5-qr community-qr-open" type="button" aria-label="放大查看 ${escapeHtml(community.wechat.name)} 微信公众号二维码">
            <img src="${community.wechat.qr}" alt="${escapeHtml(community.wechat.name)} 微信公众号二维码" loading="lazy" />
            <span>扫码关注</span>
          </button>
        </article>
        <article class="community-v5-card qq-card">
          <div class="community-v5-icon">QQ</div>
          <div class="community-v5-copy">
            <span class="community-v5-kicker">QQ 群</span>
            <h3>${escapeHtml(qqNumber)}</h3>
            <p>${escapeHtml(community.qq.description)}</p>
            <button type="button" class="community-copy-btn" data-copy-community="${escapeHtml(qqNumber)}">复制群号</button>
          </div>
        </article>
      </div>`;
  }

  function homeSection() {
    return `<section class="home-section community-v5-section community-v5" aria-labelledby="community-title">
      <div class="section-head"><div><span>COMMUNITY</span><h2 id="community-title">社区与支持</h2></div><a href="#/note/community">查看联系方式与反馈方式 →</a></div>
      ${communityCards(false)}
    </section>`;
  }

  function productSection() {
    return `<section class="community-v5-product community-v5">
      <div class="community-v5-heading"><div><span>COMMUNITY</span><h2>加入 Nowen 社区</h2></div><p>关注公众号获取项目动态，加入 QQ 群交流使用与部署问题。</p></div>
      ${communityCards(false)}
    </section>`;
  }

  function articleSection() {
    return `<aside class="community-v5-article community-v5" aria-label="Nowen Note 社区与支持">
      <div><span>需要交流或获取项目动态？</span><b>微信公众号 · ${escapeHtml(community.wechat.name)}</b><small>QQ 群 ${escapeHtml(qqNumber)}</small></div>
      <div class="community-v5-article-actions">
        <button class="secondary-community-btn community-qr-open" type="button">公众号二维码</button>
        <button class="community-copy-btn" type="button" data-copy-community="${escapeHtml(qqNumber)}">复制 QQ 群号</button>
        <a href="#/note/community">更多 →</a>
      </div>
    </aside>`;
  }

  function ensureQrDialog() {
    let dialog = $('#communityQrDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'communityQrDialog';
    dialog.className = 'community-qr-dialog';
    dialog.innerHTML = `
      <div class="community-qr-dialog-inner">
        <button type="button" class="community-qr-close" aria-label="关闭">×</button>
        <span class="community-v5-kicker">微信公众号</span>
        <h2>${escapeHtml(community.wechat.name)}</h2>
        <img src="${community.wechat.qr}" alt="${escapeHtml(community.wechat.name)} 微信公众号二维码" />
        <p>使用微信扫码关注 ${escapeHtml(community.wechat.name)} 公众号</p>
      </div>`;
    document.body.appendChild(dialog);
    $('.community-qr-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    return dialog;
  }

  function bindActions(root = document) {
    root.querySelectorAll('[data-copy-community]').forEach(button => {
      if (button.dataset.communityBound) return;
      button.dataset.communityBound = '1';
      button.addEventListener('click', () => copyText(button.dataset.copyCommunity || qqNumber, button));
    });
    root.querySelectorAll('.community-qr-open').forEach(button => {
      if (button.dataset.communityBound) return;
      button.dataset.communityBound = '1';
      button.addEventListener('click', () => {
        const dialog = ensureQrDialog();
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      });
    });
  }

  function augment() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [product, slug] = raw.split('/').filter(Boolean);

    if (!raw) {
      const trust = $('.trust-row');
      if (trust && !$('.community-v5-section')) trust.insertAdjacentHTML('beforebegin', homeSection());
    } else if (product === 'note' && !slug) {
      const hero = $('.product-overview .product-hero-card');
      if (hero && !$('.community-v5-product')) hero.insertAdjacentHTML('afterend', productSection());
    } else if (product === 'note' && slug) {
      const feedback = $('.article-wrap .article-feedback');
      if (feedback && !$('.community-v5-article')) feedback.insertAdjacentHTML('beforebegin', articleSection());
    }

    bindActions(document);
  }

  window.addEventListener('hashchange', () => queueMicrotask(augment));
  augment();
})();

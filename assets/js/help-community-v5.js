(() => {
  'use strict';

  const data = window.NOWEN_HELP;
  if (!data?.note) return;

  const note = data.note;
  const qrUrl = 'https://raw.githubusercontent.com/cropflre/nowen-note/release/v1.5.0/frontend/src/assets/community/nowen-lab-wechat.jpg';

  note.meta = note.meta || {};
  note.meta.community = {
    wechat: {
      name: 'Nowen开源实验室',
      label: '微信公众号',
      qr: qrUrl,
      description: '扫码关注 Nowen开源实验室公众号，获取项目更新与社区内容。'
    },
    qq: {
      label: 'QQ 群',
      number: '1093473044',
      description: '加入 QQ 群交流使用经验、部署问题与功能建议。'
    }
  };

  if (!note.articles.some(article => article.slug === 'community')) {
    note.articles.push({
      slug: 'community',
      group: 'support',
      title: '微信公众号、QQ 群与问题反馈',
      summary: '关注 Nowen开源实验室公众号、加入 QQ 群，并选择合适的问题反馈渠道。',
      keywords: '微信公众号 公众号 微信 Nowen开源实验室 Nowen开源实验室 QQ群 QQ 群 1093473044 社区 交流 反馈 Issues',
      updated: '2026-08-20',
      time: '3 分钟',
      body: `
        <p>除了 GitHub Issues，Nowen Note 也提供微信公众号与 QQ 群，方便获取项目动态、交流使用经验和讨论部署问题。</p>
        <div class="community-article-grid">
          <section class="community-article-card">
            <span class="community-kicker">WECHAT</span>
            <h2>微信公众号 · Nowen开源实验室</h2>
            <p>使用微信扫描下方二维码关注公众号。该二维码直接使用 Nowen Note <code>release/v1.5.0</code> 中的官方社区资源。</p>
            <figure class="community-qr-figure">
              <img src="${qrUrl}" alt="Nowen开源实验室微信公众号二维码" loading="lazy" />
              <figcaption>扫码关注 Nowen开源实验室公众号</figcaption>
            </figure>
          </section>
          <section class="community-article-card">
            <span class="community-kicker">QQ GROUP</span>
            <h2>QQ 群 · 1093473044</h2>
            <p>群号：<strong>1093473044</strong>。适合交流安装、NAS、客户端、同步、编辑器等使用问题，也欢迎讨论功能建议。</p>
            <button class="community-copy-btn" type="button" data-copy-community="1093473044">复制 QQ 群号</button>
          </section>
        </div>
        <h2>遇到问题应该发到哪里？</h2>
        <table><thead><tr><th>渠道</th><th>适合内容</th></tr></thead><tbody>
          <tr><td>微信公众号</td><td>关注项目动态、版本与社区内容。</td></tr>
          <tr><td>QQ 群 1093473044</td><td>使用交流、快速讨论、部署经验与一般问题。</td></tr>
          <tr><td>GitHub Issues</td><td>可稳定复现的 Bug、明确功能建议、需要长期跟踪的问题。</td></tr>
        </tbody></table>
        <div class="callout tip"><strong>提交 Bug 时建议一起提供</strong><span>Nowen Note 版本、Web / Desktop / Android 平台、部署方式、复现步骤、错误截图，以及必要的服务端 / 客户端日志。不要公开发送密码、Token 或其他密钥。</span></div>
      `
    });
  }
})();

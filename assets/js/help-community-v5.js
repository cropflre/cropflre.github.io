(() => {
  'use strict';

  const data = window.NOWEN_HELP;
  if (!data?.note) return;

  const note = data.note;
  const qrUrl = 'https://raw.githubusercontent.com/cropflre/nowen-note/release/v1.5.0/frontend/src/assets/community/nowen-lab-wechat.jpg';

  note.meta = note.meta || {};
  note.meta.community = {
    forum: {
      name: '弄文社区',
      url: 'https://community.nowen.cn',
      description: '官方交流社区：发布 Bug 反馈、功能建议、使用交流和作品分享，讨论内容可追踪。'
    },
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
      title: '弄文社区、微信公众号与 QQ 群',
      summary: '前往弄文社区发帖提问、反馈 Bug 与建议，也可以通过公众号和 QQ 群交流。',
      keywords: '弄文社区 community.nowen.cn 反馈 Bug 功能建议 微信公众号 公众号 QQ群 1093473044 交流 Issues',
      updated: '2026-10-29',
      time: '3 分钟',
      body: `
        <p>现在可以直接在 <a href="https://community.nowen.cn" target="_blank" rel="noopener noreferrer">弄文社区（community.nowen.cn）↗</a> 提问、发布使用经验、提交 Bug 反馈和功能建议。微信公众号和 QQ 群继续作为补充交流渠道。</p>
        <section class="community-article-card community-article-forum">
          <span class="community-kicker">OFFICIAL COMMUNITY</span>
          <h2>弄文社区 · 交流与反馈</h2>
          <p>选择弄文笔记、弄文阅读、弄文影视等板块，发表问题或建议，按状态持续跟进。</p>
          <a class="community-forum-link" href="https://community.nowen.cn" target="_blank" rel="noopener noreferrer">进入弄文社区 <span aria-hidden="true">↗</span></a>
        </section>
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
          <tr><td><a href="https://community.nowen.cn" target="_blank" rel="noopener noreferrer">弄文社区 ↗</a></td><td>正式的发帖、交流、Bug 与功能建议反馈入口。</td></tr>
           <tr><td>微信公众号</td><td>关注项目动态、版本与社区内容。</td></tr>
          <tr><td>QQ 群 1093473044</td><td>使用交流、快速讨论、部署经验与一般问题。</td></tr>
          <tr><td>GitHub Issues</td><td>可稳定复现的 Bug、明确功能建议、需要长期跟踪的问题。</td></tr>
        </tbody></table>
        <div class="callout tip"><strong>提交 Bug 时建议一起提供</strong><span>Nowen Note 版本、Web / Desktop / Android 平台、部署方式、复现步骤、错误截图，以及必要的服务端 / 客户端日志。不要公开发送密码、Token 或其他密钥。</span></div>
      `
    });
  }
})();

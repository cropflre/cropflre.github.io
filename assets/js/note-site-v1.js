/* Nowen Note product pages, isolated from the existing tutorial renderer. */
(function () {
  'use strict';
  const R = window.NowenReleases;
  if (!R) return;
  const APP = 'https://github.com/cropflre/nowen-note';
  const STORE = 'https://chromewebstore.google.com/detail/nowen-note-web-clipper/nglkodhfdbnfielchjpkjhenfaecafpg';
  const DOCS = APP + '/blob/v1.5.1/docs/tutorials/';
  const SCREEN = 'https://raw.githubusercontent.com/cropflre/nowen-note/v1.5.1/docs/screenshots/';
  const DEVELOPMENT = 'v1.5.2';
  const LOGO = 'https://raw.githubusercontent.com/cropflre/nowen-note/v1.5.1/build/icons/128x128.png';
  const platforms = [
    ['windows', 'Windows'], ['mac', 'macOS'], ['linux', 'Linux'],
    ['android', 'Android'], ['extension', '浏览器插件'], ['fnos', '飞牛 fnOS'],
    ['ugos', '绿联 UGOS'], ['docker', 'Docker / NAS'], ['ios', 'iOS / 鸿蒙']
  ];
  let selected = R.detectPlatform(navigator.userAgent);
  if (!platforms.some(function (p) { return p[0] === selected; })) selected = 'windows';
  let snapshot = { release: null, source: 'loading' };
  let generation = 0;

  const esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };
  function link(href, text, cls, attrs) {
    return '<a class="' + (cls || '') + '" href="' + esc(href) + '"' +
      (attrs || '') + '>' + esc(text) + '</a>';
  }
  function buttonAsset(key, label, primary) {
    const a = R.matrix(snapshot.release)[key];
    if (!a) return '<span class="note-unavailable">' + esc(label) + ' · 当前正式版未提供安装包</span>';
    return '<a class="' + (primary ? 'note-cta' : 'note-secondary') + '" href="' + esc(a.url) +
      '" target="_blank" rel="noopener noreferrer" download>' + esc(label) +
      ' <span class="note-size">' + esc(R.sizeLabel(a.size)) + '</span> <span aria-hidden="true">↗</span></a>';
  }
  function guide(href, title) { return link(href, title + ' →', 'note-quiet'); }
  function meta() {
    const release = snapshot.release;
    if (!release) return '<span class="note-status">正在确认正式发布附件…</span>';
    const date = /^\d{4}-\d{2}-\d{2}/.exec(release.published || '');
    const source = snapshot.source === 'live' ? '已从 GitHub 核验' :
      snapshot.source === 'cached' ? '近期缓存，最多 10 分钟' : '已核验清单（实时刷新暂不可用）';
    return '<div class="note-release-meta"><strong>最新正式版 ' + esc(release.version) + '</strong><span>' +
      esc(date ? date[0] : '发布日期待确认') + '</span><span>' + esc(source) + '</span>' +
      link(release.url, '查看 Release ↗', 'note-quiet', ' target="_blank" rel="noopener noreferrer"') + '</div>';
  }
  function nav(active) {
    const items = [['note', '产品介绍'], ['download', '下载'], ['features', '功能'], ['changelog', '版本']];
    return '<nav class="note-navigation" aria-label="Nowen Note 页面导航">' +
      link('#/', '← 帮助中心', 'note-back') + '<div class="note-nav-items">' +
      items.map(function (i) {
        const url = i[0] === 'note' ? '#/note' : '#/note/' + i[0];
        return link(url, i[1], active === i[0] ? 'is-current' : '');
      }).join('') + link('#/note/tutorials', '所有教程', '') + '</div></nav>';
  }
  function frame(section, html) {
    document.getElementById('appMain').innerHTML = '<div class="note-site">' + nav(section) + html + footer() + '</div>';
    document.body.dataset.view = 'note-site';
  }
  function footer() {
    return '<footer class="note-site-footer"><span>NOWEN · 开源实验室</span>' +
      '<div>' + link('#/note/tutorials', '帮助文档') + link('#/note/community', '社区') +
      link(APP + '/issues', '反馈问题', '', ' target="_blank" rel="noopener noreferrer"') + '</div></footer>';
  }
  function screenshot(name, alt, shape) {
    const isQa = name.indexOf('qa:') === 0;
    const src = isQa ? 'https://raw.githubusercontent.com/cropflre/nowen-note/release/v1.5.2/docs/qa/artifacts/task-composer/' + name.slice(3) : SCREEN + name;
    return '<img class="note-shot ' + (shape || '') + '" src="' + src +
      '" alt="' + esc(alt + (isQa ? '（开发 QA 截图，未正式发布）' : '')) + '" loading="lazy" decoding="async" />';
  }
  function feature(title, body, label, img, href) {
    return '<article class="note-feature-card">' +
      (img ? screenshot(img, title + '界面截图') : '<div class="note-feature-placeholder" aria-label="尚无经核验的新功能截图">正式界面截图待验收</div>') +
      '<div class="note-feature-copy"><span class="note-feature-label">' + esc(label) + '</span><h3>' +
      esc(title) + '</h3><p>' + esc(body) + '</p>' +
      link(href, '了解更多 →', 'note-quiet') + '</div></article>';
  }
  function renderProduct() {
    frame('note', '<section class="note-hero note-hero-product"><div class="note-hero-text">' +
      '<div class="note-identity"><img src="' + LOGO + '" width="46" height="46" alt="" /><span class="note-kicker">NOWEN NOTE · 弄文笔记</span></div>' +
      '<h1>记录灵感，<br />整理成自己的知识库。</h1>' +
      '<p>一款开源笔记与知识管理工具。写笔记、管理资料、安排任务，让数据保存在你掌控的设备或服务器上。</p>' +
      '<div class="note-actions">' + link('#/note/download', '免费下载 Nowen Note', 'note-cta') +
      link('http://note.nowen.cn/', '在线体验 ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"') +
      link(APP, 'GitHub ↗', 'note-quiet', ' target="_blank" rel="noopener noreferrer"') + '</div>' +
      '<p class="note-fine">桌面端可本地使用；跨设备同步需要连接同一服务端。在线演示不适合存放真实资料。</p></div>' +
      '<div class="note-hero-art">' + screenshot('desktop-ai-writing.png', 'Nowen Note 桌面端 AI 写作界面') + '</div></section>' +
      '<section class="note-section"><div class="note-section-heading"><span>WHY NOWEN</span><h2>从日常记录到长期积累</h2></div>' +
      '<div class="note-values"><article><b>01 · 数据自主掌控</b><p>支持桌面本地使用，也能将服务部署在自己的 NAS 或服务器。</p></article>' +
      '<article><b>02 · 笔记有条理</b><p>用知识树整理 Markdown、富文本与附件，查找更方便。</p></article>' +
      '<article><b>03 · AI 与任务协作</b><p>写作辅助、知识问答与日常任务放在一个工作空间。</p></article>' +
      '<article><b>04 · 多设备访问</b><p>Web、桌面与 Android 均有正式版；跨端同步请按教程配置。</p></article></div></section>' +
      '<section class="note-section"><div class="note-section-heading"><span>IN THE APP</span><h2>真实界面，真实工作流</h2>' +
      '<p>以下截图来自 v1.5.1 正式代码标签，非概念设计。</p></div><div class="note-shot-grid">' +
      '<figure>' + screenshot('desktop-ai-writing.png', '桌面端笔记与 AI 助手') + '<figcaption>桌面端 · 记录与创作</figcaption></figure>' +
      '<figure class="note-shot-mobile">' + screenshot('mobile-editor.png', 'Android 移动端编辑器') + '<figcaption>移动端 · 随时记录</figcaption></figure></div></section>' +
      '<section class="note-section note-download-teaser"><div><span class="note-kicker">GET STARTED</span>' +
      '<h2>选对版本，就能开始。</h2><p>Windows、macOS、Linux、Android、浏览器插件及 NAS 安装方式集中在一处。</p></div>' +
      link('#/note/download', '选择我的设备 →', 'note-cta') + '</section>' +
      '<section class="note-section"><div class="note-section-heading"><span>THREE STEPS</span><h2>三步开始使用</h2></div>' +
      '<div class="note-steps"><div><b>1</b><h3>选择安装方式</h3><p>个人电脑下载客户端，NAS 选择安装包或 Docker。</p></div>' +
      '<div><b>2</b><h3>安装或部署</h3><p>跟随对应平台教程。自托管需先准备服务器。</p></div>' +
      '<div><b>3</b><h3>开始记录</h3><p>创建笔记，按需要再设置 AI 与同步。</p></div></div></section>' +
      '<section class="note-section"><div class="note-section-heading"><span>OPEN SOURCE</span><h2>开放源码，也开放讨论</h2></div>' +
      '<div class="note-inline-links">' + link(APP, 'GitHub 仓库 ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"') +
      link('#/note/quick-start', '使用教程', 'note-secondary') + link('#/note/community', '公众号与 QQ 群', 'note-secondary') +
      link(APP + '/issues', '问题反馈 ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"') + '</div></section>' +
      faq());
    document.title = 'Nowen Note（弄文笔记）· 开源笔记与知识管理';
  }
  function faq() {
    const items = [
      ['收费吗？需要自己部署服务器吗？', '项目开放源码，桌面端支持本地模式，不必先部署服务器；需要跨设备访问同一份服务端数据时可使用自托管部署。'],
      ['手机和电脑怎么同步？', '在各端连接同一个服务器地址、账号和工作区。离线变更与冲突请按同步排障教程核查，当前并非所有平台都经过同等级验收。'],
      ['NAS 怎么装？', '飞牛可下载经正式发布的 FPK；绿联在没有 UPK 正式附件时，请使用 Docker。请先核对 NAS 的 CPU 架构与 Docker 能力。'],
      ['升级会丢数据吗？', '不要把镜像回退当作数据回退。升级前必须备份数据库、附件以及部署配置，并做一次恢复验证。'],
      ['怎么导入原有笔记？', '先用少量样本验证 Markdown、DOCX 或其他支持的格式，尤其检查附件和目录，再批量迁移。']
    ];
    return '<section class="note-section note-faq"><div class="note-section-heading"><span>FAQ</span><h2>常见问题</h2></div>' +
      items.map(function (x) { return '<details><summary>' + esc(x[0]) + '</summary><p>' + esc(x[1]) + '</p></details>'; }).join('') +
      '<p>' + guide('#/note/sync-troubleshooting', '同步问题排查') + '　' + guide('#/note/backup-restore-drill', '备份恢复教程') + '</p></section>';
  }

  function downloadPanel() {
    if (!snapshot.release) return '<div class="note-panel-body"><p>暂时无法确认正式版安装包，请使用下方 GitHub Releases 备用入口。接口故障不代表没有安装包。</p></div>';
    const x = R.matrix(snapshot.release);
    const header = '<div class="note-panel-head"><h2>' + esc(platforms.find(function (p) { return p[0] === selected; })[1]) +
      '</h2><span>适用版本：' + esc(snapshot.release ? snapshot.release.version : '待确认') + '</span></div>';
    let body = '';
    if (selected === 'windows') body = '<p>推荐安装版，免安装需求可选择便携版。</p>' +
      buttonAsset('winSetup', '下载 Windows 安装版', true) +
      '<details><summary>其他版本：便携版</summary>' + buttonAsset('winPortable', '下载便携版', false) + '</details>' +
      guide(DOCS + 'desktop.md', 'Windows 安装说明');
    if (selected === 'mac') body = '<p>请先在「苹果菜单 → 关于本机」查看芯片类型，再选择安装包。网页无法可靠判断你的 Mac 芯片。</p>' +
      '<div class="note-package-grid">' + buttonAsset('macArm', 'Apple Silicon（M 系列）', true) +
      buttonAsset('macIntel', 'Intel 芯片', false) + '</div>' +
      '<p class="note-fine">下载 DMG 后将应用拖入「应用程序」。首次启动如有系统安全提示，请参考官方安装说明；不建议随意关闭安全保护。</p>' +
      guide(DOCS + 'desktop.md', 'macOS 安装与启动问题');
    if (selected === 'linux') body = '<p>AppImage 适合直接运行；Debian / Ubuntu 用户可选择 DEB。当前附件为 x86-64 架构。</p>' +
      '<div class="note-package-grid">' + buttonAsset('linuxAppImage', '下载 AppImage', true) +
      buttonAsset('linuxDeb', '下载 DEB', false) + '</div>' +
      '<details><summary>其他版本：Linux Lite（轻量版）</summary><div class="note-package-grid">' +
      buttonAsset('linuxLiteAppImage', 'Lite AppImage', false) + buttonAsset('linuxLiteDeb', 'Lite DEB', false) + '</div></details>' +
      '<p class="note-fine">AppImage 下载后需要赋予执行权限：chmod +x 文件名.AppImage；DEB 可使用系统软件包管理器安装。</p>' +
      guide(DOCS + 'desktop.md', 'Linux 使用说明');
    if (selected === 'android') body = '<p>正式发布的 APK，不包含调试包、内测包或验收包。</p>' +
      buttonAsset('androidApk', '下载 Android APK', true) +
      '<p class="note-fine">下载后按 Android 系统提示授权安装来自此来源的应用。安装前可先备份旧数据。</p>' +
      guide(DOCS + 'android.md', 'Android 安装及连接服务端');
    if (selected === 'extension') {
      const zip = x.clipperZip;
      const match = zip && /^nowen-clipper-(\d+\.\d+\.\d+)\.zip$/.exec(zip.name);
      body = '<p>用于将网页内容保存到你的 Nowen Note。首次使用需要设置服务端地址与访问令牌。</p>' +
        link(STORE, '前往 Chrome Web Store', 'note-cta', ' target="_blank" rel="noopener noreferrer"') +
        '<p class="note-fine">Edge 支持从 Chrome 扩展商店安装兼容扩展；商店版版本号以商店页面显示为准。</p>' +
        '<details><summary>其他安装方式：GitHub ZIP 手动安装</summary>' +
        (match ? '<p>GitHub ZIP 版本：v' + esc(match[1]) + '</p>' : '') + buttonAsset('clipperZip', '下载扩展 ZIP', false) +
        '<p>解压后进入扩展管理页面，启用开发者模式，加载已解压扩展。请按浏览器要求操作。</p></details>' +
        guide(DOCS + 'clipper.md', '浏览器扩展配置教程');
    }
    if (selected === 'fnos') body = '<p>适用于支持手动安装 FPK 的飞牛 fnOS。目前官方包主要适配 x86-64；其他架构先核对设备兼容性。</p>' +
      buttonAsset('fnosFpk', '下载 fnOS FPK', true) +
      '<ol><li>打开飞牛应用中心 → 设置 → 手动安装应用。</li><li>选择下载的 FPK，按安装向导配置。</li>' +
      '<li>首次安装可能需要拉取 Docker 镜像，请保持网络畅通。</li><li>启动后确认数据目录和备份策略，再配置公网 HTTPS。</li></ol>' +
      guide(DOCS + 'nas-deploy.md', '飞牛安装教程');
    if (selected === 'ugos') body = x.ugosUpk ?
      '<p>UPK 安装包以此正式版附件为准，请先核对设备架构。</p>' + buttonAsset('ugosUpk', '下载 UGOS UPK', true) :
      '<p>当前正式版未提供 UGOS UPK 安装附件，因此不展示 UPK 下载按钮。可以使用绿联 NAS 的 Docker 功能部署。</p>' +
      link('#/note/download', '查看 Docker 安装方式 ↓', 'note-secondary', ' data-switch-platform="docker"') +
      guide(DOCS + 'nas-deploy.md', '绿联 NAS 部署教程');
    if (selected === 'docker') {
      const ver = snapshot.release && snapshot.release.version;
      const command = ver ? 'git clone --depth 1 --branch ' + ver + ' https://github.com/cropflre/nowen-note.git\ncd nowen-note\ndocker compose up -d' : '';
      body = '<p>适用于服务器、群晖、威联通、绿联等支持 Docker Engine 与 Compose v2 的设备，官方镜像为 <code>cropflre/nowen-note</code>。</p>' +
        (command ? '<div class="note-code-head"><span>使用正式版 ' + esc(ver) + ' 的 Compose 配置</span><button type="button" data-copy-command>复制命令</button></div>' +
        '<pre class="note-code"><code>' + esc(command) + '</code></pre>' : '<p>暂时无法确认正式版标签，请先查看部署教程。</p>') +
        '<p class="note-fine">启动后访问 http://设备IP:3001。默认账号和密码须在首次登录后立即修改。数据挂载为 /app/data，升级前备份数据库、附件及配置；公开访问建议 HTTPS。</p>' +
        guide('#/note/nas', 'NAS 部署教程') + '　' + guide(DOCS + 'docker-deploy.md', 'Docker Compose 文档');
    }
    if (selected === 'ios') body = '<p>当前正式 Release 没有 iOS 或 HarmonyOS 可直接分发的安装包。项目存在相关工程，但这不代表已上架或可下载。</p>' +
      link(APP + '/blob/release/v1.5.2/docs/iOS-Release.md', '了解 iOS 开发进展 ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"');
    return header + '<div class="note-panel-body">' + body + '</div>';
  }

  function selectPlatform(id) {
    if (!platforms.some(function (p) { return p[0] === id; })) return;
    selected = id;
    const panel = document.getElementById('notePlatformPanel');
    if (!panel) return;
    panel.innerHTML = downloadPanel();
    document.querySelectorAll('[data-note-platform]').forEach(function (button) {
      const active = button.dataset.notePlatform === id;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.tabIndex = active ? 0 : -1;
    });
  }
  function bindDownload() {
    document.querySelectorAll('[data-note-platform]').forEach(function (btn) {
      btn.addEventListener('click', function () { selectPlatform(btn.dataset.notePlatform); });
      btn.addEventListener('keydown', function (event) {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const index = platforms.findIndex(function (p) { return p[0] === selected; });
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? platforms.length - 1 :
          (index + (event.key === 'ArrowRight' ? 1 : -1) + platforms.length) % platforms.length;
        selectPlatform(platforms[next][0]);
        document.querySelector('[data-note-platform="' + platforms[next][0] + '"]').focus();
      });
    });
    document.getElementById('notePlatformPanel').addEventListener('click', async function (event) {
      const switcher = event.target.closest('[data-switch-platform]');
      if (switcher) { event.preventDefault(); selectPlatform(switcher.dataset.switchPlatform); return; }
      const btn = event.target.closest('[data-copy-command]');
      if (!btn) return;
      const pre = document.querySelector('.note-code code');
      if (!pre) return;
      try {
        await navigator.clipboard.writeText(pre.textContent);
        btn.textContent = '已复制';
      } catch {
        btn.textContent = '复制失败，请手动选择命令';
      }
    });
  }
  function renderDownload() {
    const seq = ++generation;
    frame('download', '<section class="note-heading"><span class="note-kicker">DOWNLOAD · OFFICIAL RELEASES</span>' +
      '<div class="note-identity"><img src="' + LOGO + '" width="44" height="44" alt="" /><span class="note-kicker">Nowen Note · 弄文笔记</span></div><h1>下载 Nowen Note</h1><p>选择你的设备，开始使用弄文笔记。不确定选哪个？先使用系统推荐选项。</p>' +
      '<div id="noteReleaseMeta" aria-live="polite">' + meta() + '</div></section>' +
      '<section class="note-section note-download-section" aria-label="选择安装平台"><h2 class="note-small-title">选择设备</h2>' +
      '<div class="note-platform-tabs" role="tablist" aria-label="选择操作系统">' +
      platforms.map(function (p) { return '<button role="tab" type="button" data-note-platform="' + p[0] +
        '" class="' + (selected === p[0] ? 'active' : '') + '" aria-selected="' +
        (selected === p[0] ? 'true' : 'false') + '" tabindex="' + (selected === p[0] ? '0' : '-1') + '">' +
        esc(p[1]) + '</button>'; }).join('') + '</div>' +
      '<div id="notePlatformPanel" class="note-platform-panel" role="tabpanel" aria-live="polite">' + downloadPanel() + '</div>' +
      '<p class="note-fine">未找到适合的附件？' +
      link(R.RELEASES, '查看 GitHub Releases 备用下载入口 ↗', 'note-quiet', ' target="_blank" rel="noopener noreferrer"') +
      '　' + link('#/note/quick-start', '新手入门', 'note-quiet') + '</p></section>' +
      '<section class="note-section note-release-warning"><h2>' + DEVELOPMENT + ' 正在开发</h2>' +
      '<p>当前下载中心只展示最新正式 Release。功能分支中的变化不会提前作为正式版发布。</p>' +
      link('#/note/changelog', '查看版本状态 →', 'note-secondary') + '</section>');
    document.title = '下载 Nowen Note · Windows / macOS / Linux / Android / NAS';
    bindDownload();
    R.load(function (next) {
      if (seq !== generation || !document.getElementById('notePlatformPanel')) return;
      snapshot = next;
      document.getElementById('noteReleaseMeta').innerHTML = meta();
      selectPlatform(selected);
    });
  }
  function renderFeatures() {
    frame('features', '<section class="note-heading"><span class="note-kicker">PRODUCT FEATURES</span><h1>把想法整理成成果</h1>' +
      '<p>先了解正式版已有能力；v1.5.2 新增内容明确标注为开发中。</p></section>' +
      '<section class="note-section"><div class="note-section-heading"><span>AVAILABLE · 正式版</span><h2>日常使用的核心功能</h2></div><div class="note-feature-grid">' +
      feature('Markdown 与富文本', '在熟悉的编辑器中记录笔记，按照内容选择合适格式。', 'v1.5.1 已发布', 'desktop-ai-writing.png', '#/note/advanced-content-blocks') +
      feature('手机随时记录', '移动端创建、编辑笔记；连接服务端后按同一账号访问。', 'v1.5.1 已发布', 'mobile-editor.png', '#/note/quick-start') +
      feature('AI 辅助写作', '整理文字、总结内容，让创作更高效；需要先配置 AI 服务。', 'v1.5.1 已发布', 'settings-ai.png', '#/note/ai') +
      '</div></section>' +
      '<section class="note-section"><div class="note-section-heading"><span>IN DEVELOPMENT</span><h2>' + DEVELOPMENT + ' 开发中</h2>' +
      '<p>代码分支存在不等于已发版，也不等于通过 Android 或 NAS 真机验收。</p></div><div class="note-feature-grid">' +
      feature('AI 生成与整理任务', '把自然语言想法整理为可执行的待办，具体交互仍需验收。', '开发 QA 截图 · 未正式发布', 'qa:desktop-light-en.png', '#/note/changelog') +
      feature('任务复盘与归档', '目标是汇总每日成果，并安全保存已完成任务。', '开发中 · 不属于当前正式版', '', '#/note/changelog') +
      feature('附件管理体验升级', '目标是让图片、文档与附件更好查找和整理。', '开发中 · 不属于当前正式版', '', '#/note/changelog') +
      '</div></section>');
    document.title = 'Nowen Note 核心功能 · 已发布与开发中';
  }
  function renderChangelog() {
    frame('changelog', '<section class="note-heading"><span class="note-kicker">RELEASE STATUS</span><h1>版本与更新</h1>' +
      '<p>安装请以 GitHub 正式 Release 为准，开发计划不代表已经发布。</p><div id="noteChangelogLive" aria-live="polite">' + meta() + '</div></section>' +
      '<section class="note-section note-version-list"><article><span class="note-feature-label">已发布记录 · 2026-10-08</span><h2>v1.5.1</h2>' +
      '<p>任务自动化与 AI 助手体验、移动端可靠性、数据保护与故障排查改进。</p>' +
      link(APP + '/releases/tag/v1.5.1', '查看正式更新内容 ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"') + '</article>' +
      '<article><span class="note-feature-label">2026-10-15 审计状态：开发中</span><h2>v1.5.2</h2>' +
      '<p>任务生成、每日汇总与归档、附件管理、文件标签等需求处于开发及验收阶段。多端同步与 NAS 场景需重点回归验证。最终发布内容以正式 Release 为准。</p>' +
      link(APP + '/tree/release/v1.5.2', '查看开发分支 ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"') + '</article></section>' +
      '<section class="note-section">' + link(APP + '/blob/main/CHANGELOG.md', '完整历史更新日志 ↗', 'note-quiet', ' target="_blank" rel="noopener noreferrer"') +
      '　' + link('#/note/download', '下载最新正式版 →', 'note-cta') + '</section>');
    document.title = 'Nowen Note 版本更新 · 正式版与开发状态';
    const seq = generation;
    R.load(function (releaseState) {
      if (generation !== seq || !document.getElementById('noteChangelogLive')) return;
      snapshot = releaseState;
      document.getElementById('noteChangelogLive').innerHTML = meta();
    });
  }
  function render(name) {
    if (name !== 'download') generation++;
    if (name === 'download') return renderDownload();
    if (name === 'features') return renderFeatures();
    if (name === 'changelog') return renderChangelog();
    return renderProduct();
  }
  window.NowenNoteSite = { render: render };
})();

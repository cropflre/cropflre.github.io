/* Nowen Note product pages, isolated from the existing tutorial renderer. */
(function () {
  'use strict';
  const R = window.NowenReleases;
  if (!R) return;
  const APP = 'https://github.com/cropflre/nowen-note';
  const STORE = 'https://chromewebstore.google.com/detail/nowen-note-web-clipper/nglkodhfdbnfielchjpkjhenfaecafpg';
  const MS_STORE = 'https://apps.microsoft.com/detail/9MZ7Z6S39LL3';
  const APP_GALLERY = 'https://appgallery.huawei.com/app/detail?id=com.nowen.note';
  const DOCS = APP + '/blob/v1.5.5/docs/tutorials/';
  const SCREEN = 'assets/images/';
  const LOGO = 'assets/images/nowen-brand-icon.png';
  const platforms = [
    ['windows', 'Windows'], ['mac', 'macOS'], ['linux', 'Linux'],
    ['android', 'Android'], ['harmony', 'HarmonyOS'], ['extension', '浏览器插件'],
    ['fnos', '飞牛 fnOS'], ['ugos', '绿联 UGOS'], ['docker', 'Docker / NAS'], ['ios', 'iOS']
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
    const mirrorLabel = a.source === 'r2' ? ' · R2 下载' : '';
    const primaryLink = '<a class="' + (primary ? 'note-cta' : 'note-secondary') + '" href="' + esc(a.url) +
      '" target="_blank" rel="noopener noreferrer" download>' + esc(label) +
      ' <span class="note-size">' + esc(R.sizeLabel(a.size)) + esc(mirrorLabel) +
      '</span> <span aria-hidden="true">↗</span></a>';
    return primaryLink + (a.githubUrl
      ? ' ' + link(a.githubUrl, 'GitHub 原站备用 ↗', 'note-quiet', ' target="_blank" rel="noopener noreferrer"')
      : '');
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
    return '<footer class="note-site-footer"><span>NOWEN · 弄文笔记</span>' +
      '<div>' + link('#/note/tutorials', '帮助文档') + link('#/note/community', '社区') +
      link(APP + '/issues', '反馈问题', '', ' target="_blank" rel="noopener noreferrer"') +
      link('privacy/', 'Windows 隐私政策', '', ' target="_blank" rel="noopener noreferrer"') + '</div></footer>';
  }
  function screenshot(name, alt, shape, eager) {
    return '<img class="note-shot ' + (shape || '') + '" src="' + SCREEN + esc(name) +
      '" alt="' + esc(alt) + '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async"' + (eager ? ' fetchpriority="high"' : '') + ' />';
  }
  function feature(title, body, label, img, href) {
    return '<article class="note-feature-card">' +
      (img ? screenshot(img, title + '界面截图') : '<div class="note-feature-placeholder" aria-label="此功能暂无正式截图">功能界面截图持续补充</div>') +
      '<div class="note-feature-copy"><span class="note-feature-label">' + esc(label) + '</span><h3>' +
      esc(title) + '</h3><p>' + esc(body) + '</p>' +
      link(href, '了解更多 →', 'note-quiet') + '</div></article>';
  }
  function renderProduct() {
    frame('note', '<section class="note-hero note-hero-product"><div class="note-hero-text">' +
      '<div class="note-identity"><img src="' + LOGO + '" width="40" height="40" alt="" /><span class="note-kicker">弄文笔记 · 开源自托管</span></div>' +
      '<h1>Nowen Note 弄文笔记</h1>' +
      '<p>把零散想法、Markdown 文档和日常资料放进自己的目录树。装在电脑上直接写，家里有 NAS 也能自己搭一套服务端。</p>' +
      '<div class="note-actions">' + link('#/note/download', '下载 Nowen Note', 'note-cta') +
      link('#/note/nas', '查看部署教程', 'note-secondary') +
      link('http://note.nowen.cn/', '在线体验 ↗', 'note-quiet', ' target="_blank" rel="noopener noreferrer"') +
      link(APP, 'GitHub ↗', 'note-quiet', ' target="_blank" rel="noopener noreferrer"') + '</div>' +
      '<p class="note-fine">桌面版装上就能本地写；想让手机和电脑看同一份资料，连上自己的服务端就行。在线演示会定期清空，别往里存重要资料。</p></div>' +
      '<div class="note-hero-art">' + screenshot('note-desktop-tree.png', 'Nowen Note 正式版桌面端目录树与 Markdown 笔记界面', '', true) + '</div></section>' +
      '<section class="note-section"><div class="note-section-heading"><h2>平时能用来做什么</h2>' +
      '<p>不堆虚头巴脑的概念，就是把每天写字、收资料和同步这几件事做顺。</p></div>' +
      '<div class="note-values"><article><b>按目录树把资料收好</b><p>文件夹可以套子目录，Markdown、富文本和图片附件放一起。建个「家庭资料」记下 NAS 备份了什么，下次不用翻聊天记录。</p></article>' +
      '<article><b>本地直接写，也能装到 NAS</b><p>不想折腾服务器就先装桌面版；家里有飞牛、绿联或旧电脑，Docker 几分钟就能跑起来，数据留在自己手里。</p></article>' +
      '<article><b>顺手记待办，按需叫出 AI</b><p>写完笔记顺手列几条待办，需要总结或改写时再接自己选的 AI 接口，不强迫联网。</p></article>' +
      '<article><b>电脑和手机接着写</b><p>Windows、macOS、Linux、Android 都有正式版，连上同一服务端就能同步看到改动。</p></article></div></section>' +
      '<section class="note-section note-release-highlight"><div class="note-section-heading"><h2>v1.5.5 刚更新了什么</h2>' +
      '<p>2026-11-09 正式发布，重点把多端同步通知、知识树冲突修复和桌面端启动恢复做扎实了。</p></div><div class="note-values">' +
      '<article><b>Web / PC / Android 双向同步</b><p>在线时改进变更通知和打开中笔记的更新；两端同时改同一篇时保留双方正文，避免静默覆盖。</p></article>' +
      '<article><b>知识树冲突修复</b><p>处理目录结构差异前先做预检和意图确认，减少跨设备首次引导状态不一致。</p></article>' +
      '<article><b>桌面恢复更清楚</b><p>首次下载进度、本机登录恢复和后端启动失败重试都有更直白的提示与操作入口。</p></article>' +
      '<article><b>编辑与分享细节</b><p>顺手修了 Word 粘贴图片、Markdown 换行展示和手机分享弹窗裁切问题。</p></article></div>' +
      '<p class="note-fine">v1.5.5 已正式发布。实时同步需联网并连接同一服务端，弱网下不保证零延迟或零冲突。macOS GitHub 包未做 Apple 公证；升级前请先备份。Workspace / App Studio / 扩展平台 V3 留在 v1.6.0 规划。</p>' +
      '<div class="note-inline-links">' + link('#/note/changelog', '查看 v1.5.5 详细更新 →', 'note-secondary') +
      link(APP + '/releases/tag/v1.5.5', 'GitHub 正式发布 ↗', 'note-quiet', ' target="_blank" rel="noopener noreferrer"') + '</div></section>' +
      '<section class="note-section"><div class="note-section-heading"><h2>真实软件界面</h2>' +
      '<p>下面都是正式版里直接截出来的画面，没有重新画概念图。</p></div><div class="note-shot-grid">' +
      '<figure>' + screenshot('note-desktop-editor.png', '桌面端目录树与富文本编辑界面') + '<figcaption>桌面端 · 左侧知识树，右侧正文、清单和代码块</figcaption></figure>' +
      '<figure class="note-shot-mobile">' + screenshot('note-mobile-editor.png', 'Android 移动端编辑器') + '<figcaption>Android 端 · 路上随手记一条</figcaption></figure></div></section>' +
      '<section class="note-section note-download-teaser"><div>' +
      '<h2>挑对设备就能装</h2><p>Windows、macOS、Linux、Android、HarmonyOS、浏览器剪藏插件和 NAS 的安装入口都收在一页里。</p></div>' +
      link('#/note/download', '去选我的设备 →', 'note-cta') + '</section>' +
      '<section class="note-section"><div class="note-section-heading"><h2>三步用起来</h2></div>' +
      '<div class="note-steps"><div><b>1</b><h3>选好安装方式</h3><p>个人电脑直接下客户端，家里有 NAS 就选 FPK、UPK 或 Docker。</p></div>' +
      '<div><b>2</b><h3>装完或跑起服务</h3><p>照着对应平台的教程一步步来，自托管记得改掉默认密码。</p></div>' +
      '<div><b>3</b><h3>写下第一篇笔记</h3><p>先建两个顺手的目录，同步、剪藏和 AI 等用顺手了再慢慢配。</p></div></div></section>' +
      '<section class="note-section"><div class="note-section-heading"><h2>代码开放，有问题直接聊</h2></div>' +
      '<div class="note-inline-links">' + link(APP, 'GitHub 仓库 ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"') +
      link('#/note/quick-start', '5 分钟上手教程', 'note-secondary') + link('#/note/community', '公众号与 QQ 群', 'note-secondary') +
      link(APP + '/issues', '去提 Issue ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"') + '</div></section>' +
      faq());
    document.title = 'Nowen Note 弄文笔记 · 开源自托管笔记与知识库';
  }
  function faq() {
    const items = [
      ['收费吗？一定要自己搭服务器吗？', '开源免费。桌面版支持本地模式，不搭服务器也能直接用；想在手机和电脑之间同步同一份资料，再装一套自己的服务端就行。'],
      ['手机和电脑怎么同步？', '在各端连到同一个服务端地址、账号和工作区即可。遇到离线修改或冲突时，可以按同步排障教程一步步核查。'],
      ['家里的 NAS 怎么装？', '飞牛可以直接装正式 FPK；绿联提供 AMD64 和 ARM64 两种 UPK，装之前先核对一下设备 CPU 架构。其他 NAS 用 Docker Compose 就能跑。'],
      ['升级会丢数据吗？', '别把镜像回退当成数据回退。升级前务必先备份数据库、附件和部署配置，顺手确认一下备份能恢复。'],
      ['原来的笔记怎么迁进来？', '先挑两三篇带图片的样本试一下 Markdown 或 DOCX 导入，确认目录和附件都没问题，再批量迁进来。']
    ];
    return '<section class="note-section note-faq"><div class="note-section-heading"><h2>几个常被问到的问题</h2></div>' +
      items.map(function (x) { return '<details><summary>' + esc(x[0]) + '</summary><p>' + esc(x[1]) + '</p></details>'; }).join('') +
      '<p>' + guide('#/note/sync-troubleshooting', '同步问题排查') + '　' + guide('#/note/backup-restore-drill', '备份恢复教程') + '</p></section>';
  }

  function downloadPanel() {
    if (selected === 'harmony') return '<div class="note-panel-head"><h2>HarmonyOS</h2></div>' +
      '<div class="note-panel-body"><p>适用于运行 HarmonyOS 5 及以上版本的手机和平板。</p>' +
      link(APP_GALLERY, '在华为应用市场下载', 'note-cta') +
      '<p class="note-fine">也可在设备的华为应用市场搜索「弄文笔记」安装。</p></div>';
    if (!snapshot.release) return '<div class="note-panel-body"><p>暂时无法确认正式版安装包，请使用下方 GitHub Releases 备用入口。接口故障不代表没有安装包。</p></div>';
    const x = R.matrix(snapshot.release);
    const header = '<div class="note-panel-head"><h2>' + esc(platforms.find(function (p) { return p[0] === selected; })[1]) +
      '</h2><span>适用版本：' + esc(snapshot.release ? snapshot.release.version : '待确认') + '</span></div>';
    let body = '';
    if (selected === 'windows') body = '<p>推荐安装版，免安装需求可选择便携版。</p>' +
      buttonAsset('winSetup', '下载 Windows 安装版', true) +
      '<details><summary>其他版本：便携版</summary>' + buttonAsset('winPortable', '下载便携版', false) + '</details>' +
      '<details><summary>Windows Lite 轻量版</summary>' + buttonAsset('winLiteSetup', '下载 Lite 安装版', false) + buttonAsset('winLitePortable', '下载 Lite 便携版', false) + '</details>' +
      '<p class="note-fine">GitHub 直装 Windows EXE 未提供代码签名。也可' + link(MS_STORE, '查看 Microsoft Store', 'note-quiet', ' target="_blank" rel="noopener noreferrer"') + '（商店渠道独立更新）。</p>' +
      guide(DOCS + 'desktop.md', 'Windows 安装说明');
    if (selected === 'mac') body = '<p>请先在「苹果菜单 → 关于本机」查看芯片类型，再选择安装包。网页无法可靠判断你的 Mac 芯片。</p>' +
      '<div class="note-package-grid">' + buttonAsset('macArm', 'Apple Silicon（M 系列）', true) +
      buttonAsset('macIntel', 'Intel 芯片', false) + '</div>' +
      '<p class="note-fine">本版需要 macOS 12+，DMG 未做 Developer ID 签名和 Apple 公证。首次打开如被阻止，请先核对下载来源与校验信息，再参考安装说明，不建议关闭系统安全保护。</p>' +
      guide(DOCS + 'desktop.md', 'macOS 安装与启动问题');
    if (selected === 'linux') body = '<p>AppImage 适合直接运行；Debian / Ubuntu 用户可选择 DEB。当前附件为 x86-64 架构。</p>' +
      '<div class="note-package-grid">' + buttonAsset('linuxAppImage', '下载 AppImage', true) +
      buttonAsset('linuxDeb', '下载 DEB', false) + '</div>' +
      (x.linuxLiteAppImage || x.linuxLiteDeb ? '<details><summary>其他版本：Linux Lite（轻量版）</summary><div class="note-package-grid">' +
      buttonAsset('linuxLiteAppImage', 'Lite AppImage', false) + buttonAsset('linuxLiteDeb', 'Lite DEB', false) + '</div></details>' : '') +
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
        '<p>解压后进入扩展管理页面，启用开发者模式，加载已解压扩展。请按浏览器要求操作。</p>' +
        buttonAsset('clipperEdgeZip', '下载 Edge ZIP', false) + buttonAsset('clipperFirefoxZip', '下载 Firefox ZIP', false) + '</details>' +
        guide(DOCS + 'clipper.md', '浏览器扩展配置教程');
    }
    if (selected === 'fnos') body = '<p>适用于支持手动安装 FPK 的飞牛 fnOS。目前官方包主要适配 x86-64；其他架构先核对设备兼容性。</p>' +
      buttonAsset('fnosFpk', '下载 fnOS FPK', true) +
      '<ol><li>打开飞牛应用中心 → 设置 → 手动安装应用。</li><li>选择下载的 FPK，按安装向导配置。</li>' +
      '<li>首次安装可能需要拉取 Docker 镜像，请保持网络畅通。</li><li>启动后确认数据目录和备份策略，再配置公网 HTTPS。</li></ol>' +
      guide(DOCS + 'nas-deploy.md', '飞牛安装教程');
    if (selected === 'ugos') body = (x.ugosAmd64 || x.ugosArm64 || x.ugosUpk) ?
      '<p>请根据绿联 NAS CPU 架构选择对应正式 UPK；不确定时先在系统信息中核对设备架构。</p>' +
      '<div class="note-package-grid">' + buttonAsset('ugosAmd64', '下载 AMD64 UPK', true) +
      buttonAsset('ugosArm64', '下载 ARM64 UPK', false) + '</div>' +
      (x.ugosUpk ? buttonAsset('ugosUpk', '其他正式 UPK', false) : '') :
      '<p>当前正式版未提供 UGOS UPK 安装附件，可使用绿联 NAS 的 Docker 功能部署。</p>' +
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
    if (selected === 'ios') body = '<p>当前正式 Release 没有可直接分发的 iOS 安装包。</p>' +
      link(APP + '/blob/v1.5.5/docs/iOS-Release.md', '了解 iOS 开发进展 ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"');
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
    frame('download', '<section class="note-heading">' +
      '<div class="note-identity"><img src="' + LOGO + '" width="40" height="40" alt="" /><span class="note-kicker">弄文笔记 · 正式安装包</span></div><h1>下载 Nowen Note</h1><p>选好你的设备就能装。拿不准先看默认推荐的这一项。</p>' +
      '<div id="noteReleaseMeta" aria-live="polite">' + meta() + '</div></section>' +
      '<section class="note-section note-download-section" aria-label="选择安装平台"><h2 class="note-small-title">选择设备</h2>' +
      '<div class="note-platform-tabs" role="tablist" aria-label="选择操作系统">' +
      platforms.map(function (p) { return '<button role="tab" type="button" data-note-platform="' + p[0] +
        '" class="' + (selected === p[0] ? 'active' : '') + '" aria-selected="' +
        (selected === p[0] ? 'true' : 'false') + '" tabindex="' + (selected === p[0] ? '0' : '-1') + '">' +
        esc(p[1]) + '</button>'; }).join('') + '</div>' +
      '<div id="notePlatformPanel" class="note-platform-panel" role="tabpanel" aria-live="polite">' + downloadPanel() + '</div>' +
      '<p class="note-fine">已镜像的正式安装包优先使用 R2 下载源，旁边保留 GitHub 原站备用入口；未镜像的便携版、Lite、UPK 等继续使用 GitHub。若 R2 清单不可用则自动回退 GitHub。</p>' +
      '<p class="note-fine">未找到适合的附件？' +
      link(R.RELEASES, '查看 GitHub Releases 备用下载入口 ↗', 'note-quiet', ' target="_blank" rel="noopener noreferrer"') +
      '　' + link('#/note/quick-start', '新手入门', 'note-quiet') + '</p></section>' +
      '<section class="note-section note-release-warning"><h2>升级前备份提醒</h2>' +
      '<p>升级前请备份数据库、附件和部署配置并验证可恢复；镜像回滚不会恢复持久化数据。本次 macOS 包未经 Apple 公证，Windows GitHub EXE 未签名。安装包仅来自公开正式 Release。</p>' +
      link('#/note/changelog', '查看版本说明 →', 'note-secondary') + '</section>');
    document.title = '下载 Nowen Note · Windows / macOS / Linux / Android / HarmonyOS / NAS';
    bindDownload();
    let releaseRevision = 0;
    R.load(function (next) {
      if (seq !== generation || !document.getElementById('notePlatformPanel')) return;
      const revision = ++releaseRevision;
      snapshot = next;
      document.getElementById('noteReleaseMeta').innerHTML = meta();
      if (selected !== 'harmony') selectPlatform(selected);
      if (!next.release) return;
      // Never guess a CDN URL: only switch after its verified R2 manifest was loaded.
      R.resolveMirrors(next.release, fetch.bind(window)).then(function (verified) {
        if (seq !== generation || revision !== releaseRevision ||
          snapshot.release?.version !== next.release.version ||
          !document.getElementById('notePlatformPanel')) return;
        if (verified === next.release) return; // R2 inaccessible or not published yet: use GitHub.
        snapshot = { release: verified, source: next.source };
        if (selected !== 'harmony') selectPlatform(selected);
      });
    });
  }
  function renderFeatures() {
    frame('features', '<section class="note-heading"><span class="note-kicker">v1.5.5 功能说明</span><h1>同步更及时，交互更顺手</h1>' +
      '<p>2026-11-09 正式发布：完善 Web、PC、Android 在线同步通知、冲突修复预检、桌面启动恢复和交互动效。Workspace、个人应用 Studio 与扩展平台 V3 仍规划在 v1.6.0。</p></section>' +
      '<section class="note-section"><div class="note-section-heading"><h2>这次更新了什么？</h2>' +
      '<p>多端同步需要在线连接同一个服务端及账号；弱网和并发编辑仍可能有待处理冲突。</p></div><div class="note-feature-grid">' +
      feature('双向实时同步', 'Web / PC / Android 在线变更通知、正在打开的笔记自动更新；并发编辑保留两端正文。', 'v1.5.5 正式发布', '', '#/note/changelog') +
      feature('知识树冲突修复', '优化目录结构差异修复预检与用户操作意图校验，减少新手引导状态不一致。', 'v1.5.5 正式发布', '', '#/note/changelog') +
      feature('桌面启动与恢复', '改善首次下载进度、本机账号登录恢复和后台失败后的重试体验。', 'v1.5.5 正式发布', '', '#/note/offline-workspace') +
      feature('统一动效与响应式', '统一核心界面交互动效，修复窗口从窄到宽时的工作区布局恢复。', 'v1.5.5 正式发布', '', '#/note/changelog') +
      feature('编辑器与分享', '修复 Word 粘贴图片、Markdown 换行展示与手机端分享弹窗裁切。', 'v1.5.5 正式发布', '', '#/note/attachments') +
      feature('AI 标识与兼容性', '完善 AI 生成内容标识、个人日记授权接口、鸿蒙导出及历史数据库兼容。', 'v1.5.5 正式发布', '', '#/note/changelog') +
      '</div></section>' +
      '<section class="note-section"><div class="note-section-heading"><h2>日常写作与整理</h2></div><div class="note-feature-grid">' +
      feature('Markdown 与富文本', '选择合适的编辑方式，用统一知识树整理笔记。', '持续维护', 'note-desktop-editor.png', '#/note/advanced-content-blocks') +
      feature('手机随时记录', 'Android 客户端支持日常记录；跨设备访问需要正确配置服务端和账号。', '持续维护', 'note-mobile-editor.png', '#/note/quick-start') +
      feature('AI 辅助写作', '总结、改写与知识问答，模型由你选择，在线服务可能发送相关文本。', '持续维护', 'note-settings-ai.png', '#/note/ai') +
      '</div></section>');
    document.title = 'Nowen Note v1.5.5 功能更新 · 多端同步与交互优化';
  }
  function renderChangelog() {
    const seq = ++generation;
    frame('changelog', '<section class="note-heading"><span class="note-kicker">v1.5.5 更新日志</span><h1>版本与更新</h1>' +
      '<p>v1.5.5 于 2026-11-09 正式发布，支持的架构与安装包以 GitHub 实际 Release 附件为准。</p><div id="noteChangelogLive" aria-live="polite">' + meta() + '</div></section>' +
      '<section class="note-section note-version-list"><article><span class="note-feature-label">v1.5.5 · 2026-11-09 · 正式发布</span><h2>多端同步与桌面体验稳定性更新</h2>' +
      '<p><strong>多端同步：</strong>改善 Web、PC、Android 在线双向同步通知和打开中笔记自动更新（#910）；并发编辑保留两端正文。<strong>目录与登录：</strong>加强知识树冲突修复预检及首次引导状态。<strong>桌面与界面：</strong>首次下载进度、登录和后端故障恢复，统一动效与窗口响应布局。<strong>编辑与兼容：</strong>修复 Word 图片粘贴、Markdown 换行、移动端分享弹窗及历史数据库兼容。</p>' +
      '<p class="note-fine">多端同步依赖在线连接同一服务端，并非所有场景无延迟或无冲突。macOS GitHub 包未签名或公证，Windows 直接下载 EXE 未签名；升级前请备份数据库、附件和配置。</p>' +
      link(APP + '/releases/tag/v1.5.5', '查看 v1.5.5 正式 Release ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"') + '</article>' +
      '<article><span class="note-feature-label">上一正式版 · 2026-11-02</span><h2>v1.5.4 · AI 与离线体验</h2>' +
      '<p>AI 修改建议先预览再确认、Markdown 章节折叠、原图与附件恢复、桌面完整版 NAS 离线副本和 DOCX 1GB 导入。</p>' +
      link(APP + '/releases/tag/v1.5.4', '查看 v1.5.4 历史 Release ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"') + '</article>' +
      '<article><span class="note-feature-label">下一阶段 · v1.6.0 规划</span><h2>Workspace · App Studio · 扩展平台 V3</h2>' +
      '<p>完整 Workspace、个人应用 Studio 和扩展平台 V3 不属于 v1.5.5 已交付功能。</p></article>' +
      '<article><span class="note-feature-label">历史正式版 · 2026-10-23</span><h2>v1.5.3</h2>' +
      '<p>收藏搜索、图片转存、解除加密及节假日日历等能力。</p>' +
      link(APP + '/releases/tag/v1.5.3', '查看 v1.5.3 Release ↗', 'note-secondary', ' target="_blank" rel="noopener noreferrer"') + '</article></section>' +
      '<section class="note-section note-release-warning"><h2>升级前请备份</h2><p>数据库、附件及部署配置需独立备份并验证恢复；客户端或 Docker 镜像回退不会恢复持久化数据库。</p>' +
      link('#/note/backup-restore-drill', '备份与恢复教程 →', 'note-secondary') + '</section>' +
      '<section class="note-section">' + link(APP + '/blob/main/CHANGELOG.md', '完整历史更新日志 ↗', 'note-quiet', ' target="_blank" rel="noopener noreferrer"') +
      '　' + link('#/note/download', '下载最新公开正式版 →', 'note-cta') + '</section>');
    document.title = 'Nowen Note v1.5.5 更新日志 · 版本与更新';
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

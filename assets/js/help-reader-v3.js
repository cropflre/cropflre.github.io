(() => {
  'use strict';

  const data = window.NOWEN_HELP;
  if (!data) return;

  data.version = '2026.08.20-v3';

  const readerProduct = data.products.find(p => p.id === 'reader');
  if (readerProduct) {
    readerProduct.status = 'ready';
    readerProduct.cn = '漫画与小说';
    readerProduct.desc = '高性能自托管漫画与小说管理阅读平台，支持 NAS、AI、OPDS 与多端阅读。';
  }

  data.note.meta = {
    id: 'note', name: 'Nowen Note', cn: '弄文笔记', icon: '📓',
    repo: 'cropflre/nowen-note', repoUrl: 'https://github.com/cropflre/nowen-note',
    issues: 'https://github.com/cropflre/nowen-note/issues',
    docs: 'https://github.com/cropflre/nowen-note/tree/main/docs/tutorials',
    description: '知识库、每日记录、任务、AI、协作、多端与 NAS 自托管工作台。'
  };

  // 将第一版普通 FAQ 升级为可折叠问答。
  const noteFaq = data.note.articles.find(a => a.slug === 'faq');
  if (noteFaq) {
    noteFaq.summary = '用可折叠问答快速排查访问、客户端、附件、同步和升级问题。';
    noteFaq.body = `
      <div class="faq-list">
        <details open><summary>浏览器打不开 Nowen Note 怎么办？</summary><div><p>先检查服务是否运行、端口是否监听、Docker 映射是否正确，再检查 NAS 防火墙和反向代理。排障时优先确认浏览器能直接访问服务端地址。</p></div></details>
        <details><summary>浏览器能打开，但桌面端或手机端登录不上？</summary><div><p>核对完整服务器 URL、HTTPS 证书、公开地址、CORS 和 WebSocket。手机或其他电脑访问 NAS 时不要填写 <code>localhost</code> 或 <code>127.0.0.1</code>。</p></div></details>
        <details><summary>图片或附件加载失败怎么排查？</summary><div><p>先确认原附件仍存在，再检查附件请求、签名地址、对象存储配置和当前客户端网络。问题未定位前不要执行“孤儿清理”。</p></div></details>
        <details><summary>多端同步异常或出现冲突内容怎么办？</summary><div><p>确认各端连接的是同一服务器和工作区，网络恢复后给同步队列时间处理。重要冲突内容应先保留副本，不要边排查边永久删除。</p></div></details>
        <details><summary>升级后出现白屏、异常或数据问题怎么办？</summary><div><p>记录升级前后版本，检查浏览器 / WebView 缓存、服务端日志和数据库迁移状态。真正需要回退时应使用升级前完整备份恢复，而不是只切换旧镜像。</p></div></details>
      </div>`;
  }

  data.reader = {
    meta: {
      id: 'reader', name: 'Nowen Reader', cn: '漫画与小说', icon: '📖',
      repo: 'cropflre/nowen-reader', repoUrl: 'https://github.com/cropflre/nowen-reader',
      issues: 'https://github.com/cropflre/nowen-reader/issues',
      docs: 'https://github.com/cropflre/nowen-reader/tree/main/docs',
      description: '面向 NAS 与个人服务器的轻量漫画 / 小说管理阅读平台。'
    },
    groups: [
      { id: 'start', title: '快速上手', icon: '✨' },
      { id: 'library', title: '书库与内容管理', icon: '📚' },
      { id: 'reading', title: '阅读体验', icon: '📖' },
      { id: 'integrations', title: 'AI、多端与协议', icon: '🔌' },
      { id: 'ops', title: '部署、运维与排障', icon: '🛠️' }
    ],
    popular: ['quick-start','library','comic-reader','nas','opds','ai','flutter','faq'],
    articles: [
      {
        slug: 'intro', group: 'start', title: 'Nowen Reader 是什么？',
        summary: '认识这套面向 NAS 的轻量漫画与小说管理阅读平台。',
        keywords: '介绍 漫画 小说 自托管 NAS Go React SQLite PWA Flutter', updated: '2026-08-20', time: '5 分钟',
        figure: { src: 'https://raw.githubusercontent.com/cropflre/nowen-reader/main/docs/%E6%A1%8C%E9%9D%A2%E7%AB%AF2.png', alt: 'Nowen Reader 桌面端网格视图真实截图', caption: 'Nowen Reader 桌面端真实界面截图，来源于项目 main 分支 docs。' },
        body: `
          <p>Nowen Reader 是一套<strong>高性能、自托管的漫画与小说管理阅读平台</strong>，针对 NAS 和个人服务器场景优化。后端为 Go 单二进制，前端通过 <code>go:embed</code> 内嵌，数据库使用 SQLite（WAL + FTS5）。</p>
          <div class="feature-grid">
            <div class="feature-card"><b>轻量部署</b><span>Docker 镜像约 30 MB，NAS 配置默认 512 MB 内存上限。</span></div>
            <div class="feature-card"><b>漫画 + 小说</b><span>覆盖 ZIP/CBZ/CBR/RAR/7Z/PDF 与 TXT/EPUB/MOBI/AZW3/HTML 等格式。</span></div>
            <div class="feature-card"><b>多端阅读</b><span>Web PWA + Flutter 客户端，支持 Android / iOS / 桌面方向。</span></div>
            <div class="feature-card"><b>开放连接</b><span>提供 REST API，并支持 OPDS 1.2 与 OPDS-PSE 逐页阅读。</span></div>
          </div>
          <h2>适合哪些用户？</h2>
          <ul><li>漫画、轻小说和电子书较多，希望集中管理的个人用户。</li><li>已有群晖、威联通、绿联、铁威马等 NAS，希望家庭内多端阅读的用户。</li><li>希望按用户隔离书库权限、保留独立阅读状态的家庭或小团队。</li><li>需要 AI 摘要、翻译、语义搜索或 OPDS 串流的进阶用户。</li></ul>
        `
      },
      {
        slug: 'quick-start', group: 'start', title: '5 分钟快速部署',
        summary: '使用官方生产 Compose 启动服务、创建管理员并让第一本书入库。',
        keywords: '快速开始 Docker compose 6680 管理员 comics novels 扫描', updated: '2026-08-20', time: '6 分钟',
        body: `
          <h2>1. 下载生产配置并启动</h2>
          <pre><code>curl -O https://raw.githubusercontent.com/cropflre/nowen-reader/main/docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up -d</code></pre>
          <p>默认从宿主机访问 <code>http://localhost:6680</code>。如果部署在 NAS，请把 localhost 换成 NAS 的局域网 IP。</p>
          <h2>2. 创建管理员账号</h2>
          <p>首次访问会进入管理员注册流程。这里不是使用固定默认密码，而是由你自己创建首个管理员。</p>
          <h2>3. 放入内容</h2>
          <ol class="steps"><li><b>漫画放入 comics</b><span>例如 CBZ、ZIP、CBR、7Z 或 PDF。</span></li><li><b>小说放入 novels</b><span>例如 TXT、EPUB、MOBI、AZW3 或 HTML。</span></li><li><b>等待自动扫描</b><span>也可以在 Web UI 手动触发扫描目录。</span></li><li><b>打开详情并开始阅读</b><span>阅读进度会按用户保存。</span></li></ol>
          <div class="callout tip"><strong>新用户建议</strong><span>如果你有多个漫画目录或多用户权限需求，完成最小部署后直接使用“管理后台 → 书库管理”，不要继续堆叠旧式额外目录配置。</span></div>
        `
      },
      {
        slug: 'formats', group: 'start', title: '支持哪些漫画和小说格式？',
        summary: '查看压缩包、PDF、电子书和图片格式的当前支持范围。',
        keywords: 'CBZ CBR ZIP RAR 7Z CB7 PDF TXT EPUB MOBI AZW3 HTML AVIF WebP 格式', updated: '2026-08-20', time: '4 分钟',
        body: `
          <table><thead><tr><th>类型</th><th>当前支持</th></tr></thead><tbody>
            <tr><td>漫画 / 压缩包</td><td><code>.zip</code> <code>.cbz</code> <code>.cbr</code> <code>.rar</code> <code>.7z</code> <code>.cb7</code> <code>.pdf</code> <code>.azw3</code></td></tr>
            <tr><td>小说 / 电子书</td><td><code>.txt</code> <code>.epub</code> <code>.mobi</code> <code>.azw3</code> <code>.html</code> <code>.htm</code></td></tr>
            <tr><td>压缩包内图片</td><td>JPG / JPEG / PNG / GIF / WebP / BMP / AVIF</td></tr>
          </tbody></table>
          <p>Docker 镜像已内置常用外部依赖。手动二进制部署时，7Z、PDF 和 WebP 等能力可能需要按需安装对应工具。</p>
        `
      },
      {
        slug: 'library', group: 'library', title: '书库管理与多目录配置',
        summary: '用独立书库管理漫画、小说、混合目录和多用户访问范围。',
        keywords: '书库管理 rootPath comic novel mixed public private scanEnabled 多目录 权限', updated: '2026-08-20', time: '9 分钟',
        figure: { src: 'https://raw.githubusercontent.com/cropflre/nowen-reader/main/docs/%E6%A1%8C%E9%9D%A2%E7%AB%AF%E5%90%8E%E5%8F%B0.png', alt: 'Nowen Reader 后台管理真实截图', caption: '后台管理真实截图。新版推荐通过书库管理统一配置内容根目录与访问权限。' },
        body: `
          <p>新版本推荐在<strong>管理后台 → 书库管理</strong>创建独立书库，而不是只依赖一个全局漫画目录。</p>
          <table><thead><tr><th>设置</th><th>含义</th></tr></thead><tbody><tr><td><code>rootPath</code></td><td>书库在容器内可见的根目录。</td></tr><tr><td><code>defaultAccess</code></td><td><code>public</code> 或 <code>private</code>。</td></tr><tr><td><code>scanEnabled</code></td><td>是否参与自动扫描。</td></tr><tr><td>类型</td><td>漫画库、小说库或混合库。</td></tr></tbody></table>
          <div class="callout danger"><strong>填写容器内路径</strong><span>例如 Compose 把 <code>/volume1/comics</code> 挂载为 <code>/app/comics</code>，书库 rootPath 应填写 <code>/app/comics</code>，而不是宿主机路径。</span></div>
          <h2>上传文件时为什么看不到某个书库？</h2>
          <p>目标书库必须同时满足：已启用、rootPath 非空、类型与当前页面匹配。漫画页只显示 comic / mixed，小说页只显示 novel / mixed。</p>
        `
      },
      {
        slug: 'metadata', group: 'library', title: '元数据抓取、分类与整理',
        summary: '理解自动扫描、元数据来源、收藏评分、标签分类与重复检测。',
        keywords: 'AniList Bangumi MangaDex MangaUpdates Kitsu ComicInfo 元数据 标签 分类 评分 重复', updated: '2026-08-20', time: '7 分钟',
        body: `
          <p>Nowen Reader 支持从 <strong>AniList、Bangumi、MangaDex、MangaUpdates、Kitsu</strong> 等来源补全元数据，并能读取 ComicInfo.xml 与小说内嵌元数据。</p>
          <h2>推荐整理流程</h2>
          <ol class="steps"><li><b>先保证文件名和目录结构可读</b><span>减少自动识别歧义。</span></li><li><b>扫描入库</b><span>先确认文件能正常打开和统计页数。</span></li><li><b>再抓取元数据</b><span>封面、简介、作者与分类可以后补。</span></li><li><b>最后做收藏、评分与标签</b><span>避免把文件层级和产品分类混为一谈。</span></li></ol>
        `
      },
      {
        slug: 'permissions', group: 'library', title: '多用户、书库权限与阅读状态',
        summary: '按书库控制访问范围，并理解每个用户独立的阅读状态。',
        keywords: '用户 书库权限 public private 用户组 403 想读 在读 已读完', updated: '2026-08-20', time: '6 分钟',
        body: `
          <p>书库支持公开 / 私有访问，并可给用户或用户组分配访问权限。无权访问的内容会返回明确的 403，而不会只在界面上“隐藏”。</p>
          <h2>阅读状态是每个人独立的吗？</h2>
          <p>是。<strong>想读 / 在读 / 已读完</strong>属于用户级状态，同一本漫画在不同账号中可以拥有完全不同的状态，不会互相覆盖。</p>
          <div class="callout info"><strong>家庭场景建议</strong><span>每个人使用自己的账号，再按书库授权。这样既能隔离内容，也能保留各自进度、收藏和阅读状态。</span></div>
        `
      },
      {
        slug: 'comic-reader', group: 'reading', title: '漫画阅读器：单页、双页与 Webtoon',
        summary: '掌握多种阅读模式、图片滤镜、缩放与漫画书签。',
        keywords: '漫画阅读 单页 双页 条漫 Webtoon 滤镜 亮度 对比度 灰度 书签 缩放', updated: '2026-08-20', time: '8 分钟',
        figure: { src: 'https://raw.githubusercontent.com/cropflre/nowen-reader/main/docs/%E6%A1%8C%E9%9D%A2%E7%AB%AF%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.png', alt: 'Nowen Reader 深色桌面界面真实截图', caption: '真实深色界面截图。阅读器本身还提供多种漫画阅读方式与图片滤镜。' },
        body: `
          <p>漫画阅读器支持单页、双页、条漫 / Webtoon 等模式。你可以根据屏幕尺寸与漫画排版切换。</p>
          <h2>图片滤镜</h2><p>阅读设置中可以实时调整亮度、对比度和灰度，并提供夜间护眼、老漫画增强、黑白增强等预设。</p>
          <h2>Webtoon 放大</h2><p>Webtoon 模式下双击图片区域可以放大到 200%，再次双击还原；放大后可拖拽查看细节。</p>
          <h2>漫画书签</h2><p>当前漫画书签保存在浏览器 localStorage，按漫画 ID 隔离，刷新仍保留，但目前不支持跨设备同步。</p>
        `
      },
      {
        slug: 'novel-pdf', group: 'reading', title: '小说、电子书与 PDF 阅读',
        summary: '了解章节渲染、电子书支持和 PDF 渲染依赖。',
        keywords: '小说 TXT EPUB MOBI AZW3 HTML PDF 渲染 pdftoppm mutool', updated: '2026-08-20', time: '6 分钟',
        body: `
          <p>小说方向支持 TXT、EPUB、MOBI、AZW3、HTML；PDF 则走专门的页面渲染链路。</p>
          <h2>PDF 渲染失败怎么办？</h2>
          <p>系统会依次尝试 <code>pdftoppm</code>、<code>mutool</code> 和 ImageMagick。官方 Docker 镜像已经内置 poppler-utils 与 mupdf-tools；非 Docker 部署建议优先安装 poppler-utils。</p>
          <div class="callout tip"><strong>部署差异</strong><span>如果同一个 PDF 在 Docker 里正常、二进制部署失败，优先检查外部工具，而不是先怀疑文件损坏。</span></div>
        `
      },
      {
        slug: 'progress', group: 'reading', title: '继续阅读、阅读统计与目标',
        summary: '使用继续阅读、用户级进度、阅读统计和阅读目标。',
        keywords: '继续阅读 进度 阅读统计 阅读目标 历史 收藏 评分', updated: '2026-08-20', time: '5 分钟',
        body: `
          <p>Nowen Reader 会保存用户级阅读进度，并提供继续阅读、阅读历史、统计、目标、收藏和评分等能力。多人使用时这些数据不会互相覆盖。</p>
          <h2>什么时候进度不会自动写入？</h2><p>通过 OPDS-PSE 逐页请求时，服务端不会因为客户端预加载页面就自动写入阅读进度，避免把“预取”误判成真正阅读。</p>
        `
      },
      {
        slug: 'ai', group: 'integrations', title: '配置 AI 与智能阅读能力',
        summary: '可选接入多种国内外模型，用于摘要、翻译、搜索和阅读洞察。',
        keywords: 'AI OpenAI Anthropic Gemini DeepSeek 通义 Kimi 摘要 翻译 语义搜索', updated: '2026-08-20', time: '8 分钟',
        body: `
          <p>AI 完全可选，不配置不会影响核心阅读与书库功能。进入<strong>设置 → AI 面板</strong>选择供应商、填写 API Key、选择模型并测试连接。</p>
          <h2>常见 AI 场景</h2>
          <ul><li>语义搜索与内容发现。</li><li>智能摘要、章节摘要和阅读洞察。</li><li>标签 / 分类建议、文件名解析与封面分析。</li><li>页面翻译、AI 对话等辅助阅读能力。</li></ul>
          <div class="callout info"><strong>隐私提醒</strong><span>使用在线模型时，与当前 AI 功能相关的内容可能会发送给你配置的模型服务商。敏感书库请根据实际隐私要求选择供应商。</span></div>
        `
      },
      {
        slug: 'opds', group: 'integrations', title: '用 OPDS 连接 KOReader / Moon+ Reader',
        summary: '把 Nowen Reader 作为 OPDS 目录，并正确使用用户 API Key。',
        keywords: 'OPDS KOReader Moon+ Reader Mihon API Key PSE 串流', updated: '2026-08-20', time: '9 分钟',
        body: `
          <h2>目录地址</h2><pre><code>http://你的IP:6680/api/opds</code></pre>
          <p>KOReader、Moon+ Reader 等支持 OPDS 的客户端可以添加该地址。需要认证时，用户名填写 Nowen Reader 用户名，<strong>密码填写该用户创建的完整 API Key</strong>，不要填写账户登录密码。</p>
          <h2>哪些内容会出现在 OPDS？</h2><p>只包含已启用漫画书库中的受支持文件，并且当前用户需要拥有对应书库的下载权限。小说书库、只可查看的书库和停用书库不会进入目录。</p>
          <h2>OPDS-PSE</h2><p>当前同时支持 OPDS 1.2 文件获取与 OPDS-PSE 1.2 逐页阅读。压缩漫画、PDF 以及识别为图片漫画的部分电子书可以逐页返回 JPEG。</p>
          <div class="callout danger"><strong>公网务必 HTTPS</strong><span>在不可信局域网或公网使用 OPDS 认证时，应通过 HTTPS 暴露服务。</span></div>
        `
      },
      {
        slug: 'flutter', group: 'integrations', title: 'Web / PWA 与 Flutter 客户端',
        summary: '理解浏览器 PWA 与 Flutter 原生客户端的多端定位。',
        keywords: 'Web PWA Flutter Android iOS Desktop Material 3 手势 阅读进度同步', updated: '2026-08-20', time: '5 分钟',
        figure: { src: 'https://raw.githubusercontent.com/cropflre/nowen-reader/main/docs/%E7%A7%BB%E5%8A%A8%E7%AB%AF1.png', alt: 'Nowen Reader 移动端 PWA 真实截图', caption: 'Nowen Reader 移动端 / PWA 真实截图，来源于项目 main 分支。' },
        body: `
          <p>Nowen Reader 同时提供 Web PWA 和 Flutter 原生客户端方向。Flutter 客户端采用 Material 3，并围绕触屏缩放、沉浸阅读与阅读进度同步设计。</p>
          <h2>怎么选？</h2><table><thead><tr><th>场景</th><th>推荐</th></tr></thead><tbody><tr><td>电脑管理书库、批量操作</td><td>Web</td></tr><tr><td>手机临时访问、无需安装</td><td>PWA / 浏览器</td></tr><tr><td>更偏原生手势和沉浸阅读</td><td>Flutter 客户端</td></tr></tbody></table>
        `
      },
      {
        slug: 'nas', group: 'ops', title: 'NAS 部署：群晖 / 威联通 / 绿联 / 铁威马',
        summary: '使用 NAS 专用 Compose，正确映射数据、缓存和书库目录。',
        keywords: 'NAS 群晖 威联通 绿联 铁威马 Docker 512MB PUID PGID permission denied', updated: '2026-08-20', time: '10 分钟',
        body: `
          <h2>使用 NAS 专用配置</h2><pre><code>curl -O https://raw.githubusercontent.com/cropflre/nowen-reader/main/docker-compose.nas.yml
# 修改宿主机路径后启动
docker compose -f docker-compose.nas.yml up -d</code></pre>
          <table><thead><tr><th>容器路径</th><th>用途</th></tr></thead><tbody><tr><td><code>/data</code></td><td>SQLite 数据库，必须持久化。</td></tr><tr><td><code>/app/.cache</code></td><td>缩略图、页面缓存与配置。</td></tr><tr><td><code>/app/comics</code></td><td>漫画目录。</td></tr><tr><td><code>/app/novels</code></td><td>小说目录。</td></tr></tbody></table>
          <h2>permission denied 怎么办？</h2><p>优先把 <code>PUID</code> / <code>PGID</code> 设置为宿主机文件实际 UID/GID，并保持合理 UMASK。SMB/NFS 等无法 chown 的场景，确认风险后再考虑 <code>PERMISSION_FIX_MODE=relaxed</code>。</p>
        `
      },
      {
        slug: 'backup-update', group: 'ops', title: '数据备份与版本更新',
        summary: '知道哪些数据必须备份，并使用 Compose 安全更新。',
        keywords: '备份 SQLite nowen-reader.db 更新 docker compose pull up -d 数据迁移', updated: '2026-08-20', time: '6 分钟',
        body: `
          <p>数据库默认位于 <code>${DATA_DIR}/nowen-reader.db</code>，Docker 内通常为 <code>/data/nowen-reader.db</code>。这里保存用户、阅读历史、收藏、评分、进度、标签、分类和元数据修改。</p>
          <div class="callout danger"><strong>至少备份数据库</strong><span>定期备份数据库文件；如果你还希望快速恢复缩略图和自定义配置，也应把数据 / 缓存相关持久化目录纳入 NAS 快照或备份计划。</span></div>
          <h2>Docker 更新</h2><pre><code>docker compose pull
docker compose up -d</code></pre>
          <p>数据库升级会自动完成。生产环境仍建议在升级前做备份，并记录当前镜像版本。</p>
        `
      },
      {
        slug: 'faq', group: 'ops', title: '常见问题排查',
        summary: '用折叠问答快速定位端口、权限、缩略图、PDF、上传和 OPDS 问题。',
        keywords: 'FAQ 6680 out of memory permission denied 缩略图 PDF 上传 扫描 OPDS', updated: '2026-08-20', time: '10 分钟',
        body: `
          <div class="faq-list">
            <details open><summary>Docker 启动后为什么访问不了？</summary><div><p>确认默认端口映射是 <code>6680:3000</code>，检查防火墙、NAS Docker 服务，并通过 <code>docker compose logs -f</code> 查看日志。</p></div></details>
            <details><summary>SQLite 报 out of memory，真的是内存不够吗？</summary><div><p>常见原因其实是目录权限。先确认 data 目录对容器运行用户可写，再检查 PUID / PGID 与挂载权限。</p></div></details>
            <details><summary>缩略图不显示怎么办？</summary><div><p>系统优先使用 cwebp、ffmpeg，最后降级到 Go 原生 JPEG。Docker 镜像已内置 cwebp，可到系统诊断查看编码器状态并手动批量生成缩略图。</p></div></details>
            <details><summary>上传成功后为什么列表没有立刻出现？</summary><div><p>上传接口只负责保存文件，入库依赖同步 / 扫描流程。通常会自动触发同步；仍未出现时手动点击“扫描目录”。</p></div></details>
            <details><summary>NAS 出现 permission denied 怎么办？</summary><div><p>优先对齐宿主机 UID/GID 与 Compose 的 PUID/PGID；书库管理中填写的是容器内路径，不是宿主机路径。</p></div></details>
            <details><summary>OPDS 客户端提示密码错误？</summary><div><p>用户名填写 Nowen Reader 用户名，密码填写该用户创建的完整 API Key，不要使用账户登录密码。</p></div></details>
          </div>`
      }
    ]
  };
})();
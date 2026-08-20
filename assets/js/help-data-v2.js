window.NOWEN_HELP = {
  version: '2026.08.20-v2',
  products: [
    { id: 'note', name: 'Nowen Note', cn: '弄文笔记', icon: '📓', status: 'ready', desc: '知识库、每日记录、任务、AI、协作与自托管工作台。' },
    { id: 'reader', name: 'Nowen Reader', cn: '阅读', icon: '📖', status: 'planned', desc: '漫画与小说阅读平台。教程结构已预留。' },
    { id: 'video', name: 'Nowen Video', cn: '影音', icon: '🎬', status: 'planned', desc: '私人家庭影音中心。教程结构已预留。' },
    { id: 'bookmarks', name: 'NOWEN 书签', cn: '书签', icon: '🔖', status: 'planned', desc: '书签、导航与系统入口。教程结构已预留。' }
  ],
  note: {
    groups: [
      { id: 'start', title: '快速上手', icon: '✨' },
      { id: 'write', title: '笔记与知识管理', icon: '📝' },
      { id: 'productivity', title: '效率与 AI', icon: '⚡' },
      { id: 'clients', title: '多端、部署与数据', icon: '🖥️' },
      { id: 'support', title: '迁移、排障与开放能力', icon: '🛠️' }
    ],
    popular: ['quick-start','first-note','nas','android','backup-upgrade','ai','clipper','mcp'],
    articles: [
      {
        slug: 'intro', group: 'start', title: 'Nowen Note 是什么？',
        summary: '认识弄文笔记：开源、自托管、多端可用的知识库与工作台。',
        keywords: '介绍 自托管 知识库 数据 NAS 开源', updated: '2026-08-20', time: '4 分钟',
        body: `
          <p>Nowen Note（弄文笔记）是一套<strong>开源、自托管的知识库、每日记录与任务协作工作台</strong>。它把知识树、富文本 / Markdown、附件、搜索、每日记录、任务、AI 与团队协作放进同一套产品。</p>
          <div class="callout info"><strong>适合谁</strong><span>希望数据留在自己 NAS / 服务器的个人用户；需要长期整理知识的重度笔记用户；需要权限与共享的小团队；以及希望用 API / MCP 接入 AI 和自动化的开发者。</span></div>
          <h2>和普通云笔记最大的区别</h2>
          <div class="feature-grid">
            <div class="feature-card"><b>数据自己掌控</b><span>Docker / NAS 自托管，数据库、附件、索引和备份由你管理。</span></div>
            <div class="feature-card"><b>一棵树组织全部内容</b><span>文件夹、富文本和 Markdown 文档混合组织，支持根目录文档与多层级。</span></div>
            <div class="feature-card"><b>知识与行动统一</b><span>笔记、每日记录、任务、思维导图、AI 和协作不需要切换多套工具。</span></div>
            <div class="feature-card"><b>开放连接</b><span>OpenAPI、Token、SDK、CLI、Webhook、MCP 与浏览器剪藏扩展。</span></div>
          </div>
          <h2>推荐使用路线</h2>
          <ol class="steps"><li><b>先跑通访问和登录</b><span>长期使用推荐 Docker / NAS。</span></li><li><b>建立少量稳定一级目录</b><span>跨目录主题交给标签和搜索。</span></li><li><b>写第一篇笔记并上传一张图片</b><span>确认保存、附件和访问链路正常。</span></li><li><b>创建第一份完整备份</b><span>重要数据入库前先验证备份。</span></li></ol>
        `
      },
      {
        slug: 'quick-start', group: 'start', title: '5 分钟快速上手',
        summary: '从启动、登录到创建第一篇笔记和备份，一次跑通最重要链路。',
        keywords: '快速上手 Docker 登录 admin admin123 第一篇笔记 备份', updated: '2026-08-20', time: '5 分钟',
        body: `
          <p>第一次使用时，不要先研究所有设置。先完成“<strong>访问 → 登录 → 建目录 → 写笔记 → 备份</strong>”这条最短路径。</p>
          <h2>1. 启动服务</h2>
          <pre><code>git clone https://github.com/cropflre/nowen-note.git
cd nowen-note
docker compose up -d</code></pre>
          <p>浏览器访问 <code>http://&lt;服务器或 NAS IP&gt;:3001</code>。容器持久化数据目录为 <code>/app/data</code>，长期使用前请确认已经正确映射。</p>
          <h2>2. 首次登录</h2>
          <table><thead><tr><th>字段</th><th>默认值</th></tr></thead><tbody><tr><td>用户名</td><td><code>admin</code></td></tr><tr><td>密码</td><td><code>admin123</code></td></tr></tbody></table>
          <div class="callout danger"><strong>必须修改默认密码</strong><span>进入「设置 → 安全设置」修改管理员密码。公网部署还应配置 HTTPS、公开访问地址与允许的来源。</span></div>
          <h2>3. 建目录并写一篇笔记</h2>
          <ol class="steps"><li><b>创建目录</b><span>例如“工作 / 学习 / 生活”。</span></li><li><b>新建笔记</b><span>选择富文本或 Markdown。</span></li><li><b>插入图片或附件</b><span>确认上传链路正常。</span></li><li><b>切换到另一篇再返回</b><span>确认保存结果仍然存在。</span></li></ol>
          <h2>4. 创建第一份完整备份</h2>
          <p>进入「设置 → 数据管理」创建完整备份。只复制数据库文件不能完整恢复图片与附件。</p>
        `
      },
      {
        slug: 'ui-overview', group: 'start', title: '界面与导航',
        summary: '快速看懂文档树、笔记列表、编辑器、设置和移动端导航。',
        keywords: '界面 三栏 导航 文档树 侧边栏 编辑器 设置', updated: '2026-08-20', time: '6 分钟',
        figure: { src: 'assets/help/note/ui-overview.svg', alt: 'Nowen Note 桌面端三栏布局操作示意', caption: '界面结构示意：用于帮助定位功能，具体按钮位置以当前版本为准。' },
        body: `
          <p>桌面宽屏下可以把 Nowen Note 理解成<strong>全局导航 / 文档树 → 笔记列表 → 编辑器</strong>三层结构。移动端则把这些区域收进抽屉与单页流程中。</p>
          <h2>左侧：全局导航和知识树</h2>
          <ul><li>切换个人空间、工作区和功能模块。</li><li>展开 / 收起目录，进入某个知识范围。</li><li>通过右键菜单新建、重命名、移动、删除。</li><li>支持拖拽排序和调整父子层级。</li></ul>
          <h2>中间：笔记列表</h2>
          <p>显示当前范围的文档，并提供标题、摘要、更新时间、置顶 / 收藏状态与排序入口。批量整理时优先使用多选操作。</p>
          <h2>右侧：编辑器</h2>
          <p>编辑标题、标签与正文，并使用附件、分享、版本历史和 AI。桌面端可以拖动分隔线改变栏宽，也可以收起栏位获得更大的写作区域。</p>
          <h2>移动端</h2>
          <p>手机端使用抽屉式导航，适合快速记录、查看任务、浏览和处理图片；大规模目录整理与批量操作仍推荐在桌面宽屏完成。</p>
        `
      },
      {
        slug: 'first-note', group: 'start', title: '创建第一篇笔记',
        summary: '从选择目录到自动保存、标签、图片和版本历史，完整走一遍写作流程。',
        keywords: '新建笔记 自动保存 标题 标签 图片 版本历史', updated: '2026-08-20', time: '7 分钟',
        figure: { src: 'assets/help/note/first-note.svg', alt: '创建第一篇 Nowen Note 笔记流程示意', caption: '建议第一次就测试文字、图片、保存和重新打开四个环节。' },
        body: `
          <h2>推荐第一次这样操作</h2>
          <ol class="steps"><li><b>选择一个目录</b><span>不要一开始就建立很深的文件夹。</span></li><li><b>点击新建</b><span>根据内容选择富文本或 Markdown。</span></li><li><b>填写标题和正文</b><span>可以添加标签、收藏或置顶。</span></li><li><b>插入一张图片</b><span>用粘贴、拖拽或附件入口验证媒体链路。</span></li><li><b>等待保存状态完成</b><span>Nowen Note 默认自动保存，不需要频繁手动 Ctrl/Cmd + S。</span></li><li><b>切换笔记后再返回</b><span>确认正文和图片仍然正确显示。</span></li></ol>
          <h2>什么时候用富文本，什么时候用 Markdown？</h2>
          <table><thead><tr><th>场景</th><th>推荐</th></tr></thead><tbody><tr><td>日常记录、图文内容、快速排版</td><td>富文本</td></tr><tr><td>技术文档、纯文本、代码较多</td><td>Markdown</td></tr><tr><td>需要表格、公式、Mermaid</td><td>两者都支持，按个人习惯选择</td></tr></tbody></table>
          <div class="callout tip"><strong>误改怎么办</strong><span>重要笔记可以利用版本历史恢复旧内容；删除的内容先进入回收站，不要直接把回收站当普通归档区。</span></div>
        `
      },
      {
        slug: 'tree-organize', group: 'write', title: '知识树、标签与长期整理',
        summary: '用层级负责结构、标签负责横向主题、搜索负责定位。',
        keywords: '知识树 文件夹 拖拽 排序 标签 收藏 置顶 回收站', updated: '2026-08-20', time: '8 分钟',
        body: `
          <p>推荐的组织原则是：<strong>目录负责稳定结构，标签负责横向属性，搜索负责快速定位</strong>。</p>
          <h2>一个容易维护的目录例子</h2>
          <pre><code>工作
├─ 项目
├─ 会议
└─ 资料
学习
├─ 阅读
└─ 技术
生活
├─ 记录
└─ 计划</code></pre>
          <h2>常见管理动作</h2>
          <table><thead><tr><th>动作</th><th>适合场景</th></tr></thead><tbody><tr><td>收藏</td><td>高频回看的内容</td></tr><tr><td>置顶</td><td>当前阶段最重要的内容</td></tr><tr><td>标签</td><td>跨目录的项目、人物、状态和主题</td></tr><tr><td>锁定</td><td>避免查看时误编辑</td></tr><tr><td>版本历史</td><td>找回误改内容</td></tr><tr><td>回收站</td><td>删除后的缓冲区</td></tr></tbody></table>
          <div class="callout tip"><strong>不要为了每个主题建一层目录</strong><span>目录过深会增加维护成本。很多“分类问题”其实更适合标签和全文搜索。</span></div>
        `
      },
      {
        slug: 'rich-text', group: 'write', title: '富文本编辑器',
        summary: '掌握格式、斜杠命令、表格、代码、公式、Mermaid 与媒体内容。',
        keywords: '富文本 Tiptap 斜杠 表格 代码 KaTeX Mermaid 图片 视频', updated: '2026-08-20', time: '9 分钟',
        body: `
          <p>富文本编辑器适合所见即所得写作。当前能力包括标题、列表、引用、链接、高亮、表格、代码块、KaTeX、Mermaid、脚注、Callout、图片、视频与其他附件。</p>
          <h2>高频技巧</h2>
          <ul><li>输入 <code>/</code> 打开斜杠命令，快速插入内容块。</li><li>粘贴或拖拽图片可以直接进入附件流程。</li><li>跨笔记粘贴时会尽量保留结构和格式。</li><li>复杂表格、Mermaid 和公式在导出前建议预览一次。</li></ul>
          <h2>图片与媒体</h2>
          <p>图片进入统一附件系统，可预览、下载并跟随笔记引用。移动端富文本图片支持复制、剪切、粘贴等操作，并保留尺寸、旋转、翻转等节点属性。</p>
          <div class="callout info"><strong>长文建议</strong><span>打开大纲并适当收起侧边栏；不要用大量空行模拟版式，优先使用标题、列表、Callout 和分隔结构。</span></div>
        `
      },
      {
        slug: 'markdown', group: 'write', title: 'Markdown 编辑器',
        summary: 'CodeMirror、实时预览、分屏、滚动同步与扩展语法。',
        keywords: 'Markdown CodeMirror 实时预览 分屏 Mermaid 数学公式', updated: '2026-08-20', time: '7 分钟',
        body: `
          <p>Markdown 模式更适合技术文档、代码笔记和纯文本工作流。Nowen Note 使用 CodeMirror，并提供实时预览和分屏阅读。</p>
          <h2>适合 Markdown 的场景</h2>
          <ul><li>代码和命令较多的技术文档。</li><li>希望内容可被其他 Markdown 工具直接处理。</li><li>习惯键盘输入而不是频繁点击工具栏。</li></ul>
          <h2>切换格式前注意</h2>
          <p>富文本与 Markdown 都支持丰富内容，但复杂表格、扩展块、媒体和特殊样式在互转后应检查一次显示结果。重要笔记转换前建议保留版本或备份。</p>
        `
      },
      {
        slug: 'attachments', group: 'write', title: '图片、视频与附件管理',
        summary: '上传、引用、缩略图、对象存储和清理附件时的安全边界。',
        keywords: '附件 图片 视频 上传 缩略图 S3 R2 MinIO 孤儿 清理', updated: '2026-08-20', time: '8 分钟',
        body: `
          <p>附件不仅包含图片，也包含视频和普通文件。新本地附件会按 <code>YYYY/MM</code> 归档，系统还支持缩略图、引用检查、孤儿扫描，以及 S3、Cloudflare R2、MinIO 等存储方式。</p>
          <h2>添加附件</h2>
          <ul><li>拖拽到编辑器。</li><li>粘贴剪贴板图片。</li><li>通过插入 / 附件入口选择文件。</li><li>在支持的导入流程中自动本地化远程图片。</li></ul>
          <h2>清理附件前</h2>
          <ol class="steps"><li><b>先创建完整备份</b><span>不要把孤儿扫描当成绝对正确的删除清单。</span></li><li><b>确认附件引用</b><span>特别检查导入内容、旧笔记和共享空间。</span></li><li><b>再执行清理</b><span>重要文件同时保留独立存储副本。</span></li></ol>
        `
      },
      {
        slug: 'search-links', group: 'write', title: '搜索、双向链接与知识图谱',
        summary: '从找笔记升级到建立内容之间的关系。',
        keywords: '全文搜索 当前目录 搜索 双向链接 反向链接 块引用 知识图谱', updated: '2026-08-20', time: '7 分钟',
        body: `
          <h2>先用搜索解决“找不到”</h2>
          <p>可以从标题和正文中定位内容，也可以在当前目录范围缩小结果。标签适合已知分类，全文搜索更适合只记得内容片段的场景。</p>
          <h2>再用链接解决“内容之间是什么关系”</h2>
          <ul><li><strong>双向链接：</strong>主动建立笔记之间的引用关系。</li><li><strong>反向链接：</strong>查看有哪些内容引用了当前笔记。</li><li><strong>块引用：</strong>引用更细粒度的内容块。</li><li><strong>知识图谱：</strong>从整体视角观察关系网络。</li></ul>
          <div class="callout tip"><strong>不要为了知识图谱而链接</strong><span>链接应该表达真实语义关系。无意义的大量互链会让图谱变成噪声。</span></div>
        `
      },
      {
        slug: 'sharing', group: 'write', title: '工作区、协作、分享与权限',
        summary: '理解实时协作、角色、目录权限、分享密码与公开知识空间。',
        keywords: '工作区 协作 Yjs 权限 ACL Restricted 分享 密码 有效期 评论', updated: '2026-08-20', time: '10 分钟',
        body: `
          <p>团队使用时，先区分“成员角色”“目录权限”和“外部分享”三层控制。Nowen Note 支持实时协作、工作区角色、目录级 ACL、Restricted 受限模式、权限继承、所有权转移、分享密码与有效期。</p>
          <h2>推荐权限原则</h2>
          <ol class="steps"><li><b>默认最小权限</b><span>只给完成任务所需权限。</span></li><li><b>用目录继承减少维护</b><span>只有例外内容再单独覆盖。</span></li><li><b>外部分享设置有效期</b><span>敏感内容同时启用密码。</span></li><li><b>定期检查公开知识空间</b><span>确认公开来源和域名配置符合预期。</span></li></ol>
        `
      },
      {
        slug: 'daily', group: 'productivity', title: '每日记录：瞬间、日历与日记',
        summary: '把碎片记录、日期归档和 AI 周报 / 月报放进同一条时间线。',
        keywords: '每日记录 瞬间 日历 日记 心情 图片 视频 周报 月报', updated: '2026-08-20', time: '6 分钟',
        body: `
          <p>每日记录适合“先记下来，再整理”的内容。当前入口统一覆盖瞬间、日历和日记，可记录短内容、心情、图片和视频，并支持 AI 周报 / 月报。</p>
          <h2>推荐用法</h2>
          <ul><li>瞬间：快速记录灵感、状态和现场信息。</li><li>日历：按日期回看发生过什么。</li><li>日记：沉淀相对完整的当天记录。</li><li>周报 / 月报：让 AI 根据已有记录整理摘要，再人工校正。</li></ul>
        `
      },
      {
        slug: 'tasks', group: 'productivity', title: '任务中心、My Day 与提醒',
        summary: '树形任务、列表、看板、日历、时间轴、重复规则和移动端提醒。',
        keywords: '任务 待办 My Day 看板 日历 甘特 时间轴 重复 提醒 模板 习惯', updated: '2026-08-20', time: '9 分钟',
        body: `
          <p>任务中心不仅是待办列表，还包含树形任务、看板、日历、甘特 / 时间轴、依赖关系、重复规则、提醒和模板，并支持 My Day、Inbox、时间块和习惯。</p>
          <h2>一个简单工作流</h2>
          <ol class="steps"><li><b>先丢进 Inbox</b><span>快速捕获，不在记录当下纠结分类。</span></li><li><b>每天整理 My Day</b><span>只留下今天真正准备完成的任务。</span></li><li><b>项目任务拆层级和依赖</b><span>避免所有任务都堆在一个平面列表。</span></li><li><b>规律事项使用重复规则</b><span>不要手工每天新建。</span></li></ol>
          <p>Android 原生端还支持任务提醒调度；跨时区或全天截止任务建议确认服务器与客户端时间配置一致。</p>
        `
      },
      {
        slug: 'mindmap', group: 'productivity', title: '思维导图与从笔记生成导图',
        summary: '手动构建导图，或让 AI 从已有笔记生成层级结构。',
        keywords: '思维导图 节点 AI 生成 笔记 导出 PNG', updated: '2026-08-20', time: '6 分钟',
        body: `
          <p>思维导图适合梳理层级、方案和概念关系。可以手动创建节点、拖拽调整结构，也可以从已有笔记生成初始层级。</p>
          <h2>AI 生成后一定要做的事</h2>
          <ul><li>删除重复或空泛节点。</li><li>检查事实和数字是否被 AI 改写。</li><li>把过长段落收敛成短节点。</li><li>再按展示需要导出或分享。</li></ul>
        `
      },
      {
        slug: 'ai', group: 'productivity', title: '配置 AI 与 RAG 知识问答',
        summary: '配置在线或本地模型，并理解知识库模式实际会发送哪些内容。',
        keywords: 'AI OpenAI 通义 Gemini DeepSeek 豆包 Ollama RAG Embedding 隐私', updated: '2026-08-20', time: '10 分钟',
        body: `
          <p>Nowen Note 支持 OpenAI 兼容接口、通义千问、Gemini、DeepSeek、豆包和 Ollama 等类型。配置按用户保存，可用于续写、改写、翻译、总结、标题 / 标签生成、Embedding 与 RAG 知识问答。</p>
          <h2>RAG 不等于把全部笔记发给模型</h2>
          <table><thead><tr><th>模式</th><th>主要上下文</th></tr></thead><tbody><tr><td>知识库</td><td>先检索，再发送匹配到的相关片段</td></tr><tr><td>当前笔记</td><td>当前打开的笔记内容</td></tr><tr><td>选中文本</td><td>当前选择或粘贴的文本</td></tr><tr><td>本地 Ollama</td><td>可把模型推理留在自己的设备 / 网络环境</td></tr></tbody></table>
          <div class="callout danger"><strong>敏感信息仍应谨慎</strong><span>使用在线模型或在线 Embedding 时，相关文本会发送给你配置的服务商。身份证、密码、API Key、助记词等不建议以明文进入普通笔记和在线 AI 流程。</span></div>
        `
      },
      {
        slug: 'clipper', group: 'productivity', title: '浏览器剪藏：保存网页到 Nowen Note',
        summary: '安装 Chrome / Edge 扩展，配置服务器与 Token，剪藏正文、选区和整页。',
        keywords: '浏览器 剪藏 Chrome Edge Web Clipper API Token Readability 网页', updated: '2026-08-20', time: '8 分钟',
        figure: { src: 'assets/help/note/clipper.svg', alt: 'Nowen Note 浏览器剪藏流程示意', caption: '浏览器 → 剪藏扩展 → Nowen Note API → 指定目录。' },
        body: `
          <h2>安装</h2>
          <p>Chrome 可从 Chrome Web Store 安装 Nowen Note Web Clipper；Edge 可以兼容安装 Chrome 扩展。</p>
          <h2>首次配置</h2>
          <ol class="steps"><li><b>填写服务器地址</b><span>例如 <code>https://note.example.com</code> 或局域网地址。</span></li><li><b>创建独立 API Token</b><span>不要复用管理员密码，按最小权限创建。</span></li><li><b>测试连接</b><span>先确认扩展能够访问服务端。</span></li><li><b>设置默认目录和标签</b><span>减少每次剪藏后的整理成本。</span></li></ol>
          <h2>剪藏模式</h2>
          <p>根据页面和需求可使用正文、选区、简化、整页、截图或完整截图等模式。正文模式会使用 Readability 思路提取主要内容。</p>
          <div class="callout tip"><strong>图片要本地保存</strong><span>需要长期离线保存网页图片时，选择“下载为本地”；保留原 URL 可能受源站防盗链、失效或删除影响。</span></div>
        `
      },
      {
        slug: 'multi-client', group: 'clients', title: 'Web、桌面端与移动端怎么选',
        summary: '理解各端定位、服务器地址和同账号同步方式。',
        keywords: 'Web Electron Windows macOS Linux Android iOS HarmonyOS 客户端 同步', updated: '2026-08-20', time: '6 分钟',
        body: `
          <table><thead><tr><th>平台</th><th>适合场景</th></tr></thead><tbody><tr><td>Web</td><td>无需安装，任何现代浏览器快速访问</td></tr><tr><td>桌面端</td><td>长期写作、宽屏整理、系统级桌面体验</td></tr><tr><td>Android</td><td>移动记录、图片处理、任务提醒和随时访问</td></tr><tr><td>iOS / HarmonyOS</td><td>工程持续维护中，实际可用版本与安装方式以 Releases / 项目说明为准</td></tr></tbody></table>
          <h2>最容易填错的是服务器地址</h2>
          <p>客户端连接 NAS 时，<code>localhost</code> 和 <code>127.0.0.1</code> 指的是“当前这台客户端设备本身”，不是 NAS。应填写 NAS 局域网 IP、IPv6 地址或可访问的 HTTPS 域名。</p>
        `
      },
      {
        slug: 'android', group: 'clients', title: 'Android 安装、连接与图片操作',
        summary: 'APK 安装、连接 NAS、移动端导航、图片预览和保存到相册。',
        keywords: 'Android APK NAS 连接 手机 图片 相册 Pictures Nowen Note 手势', updated: '2026-08-20', time: '10 分钟',
        figure: { src: 'assets/help/note/android-connect.svg', alt: 'Android 连接 Nowen Note NAS 服务流程示意', caption: '手机必须能从当前网络访问 NAS 地址；不要把 localhost 当作 NAS。' },
        body: `
          <h2>安装与连接</h2>
          <ol class="steps"><li><b>从 GitHub Releases 获取 APK</b><span>安装时按系统提示允许对应来源。</span></li><li><b>输入服务器地址</b><span>例如 <code>http://192.168.1.20:3001</code> 或 HTTPS 域名。</span></li><li><b>登录同一账号</b><span>数据通过同一服务端同步。</span></li></ol>
          <h2>移动端图片</h2>
          <p>Android 原生环境可把整篇笔记导出图片保存到系统相册，也可以在编辑器中选中单张图片保存。默认相册目录为 <strong>Pictures/Nowen Note</strong>。图片预览支持触屏缩放和平移。</p>
          <h2>白屏或升级后异常</h2>
          <p>先确认服务器地址可以在手机浏览器直接打开；再检查 WebView / 应用缓存。清除缓存和清除应用数据不是一回事，后者可能会移除登录状态。</p>
        `
      },
      {
        slug: 'docker', group: 'clients', title: 'Docker 部署',
        summary: '用 Compose 部署 Nowen Note，并确认端口、持久化和日志。',
        keywords: 'Docker Compose 部署 3001 app data 持久化 日志', updated: '2026-08-20', time: '8 分钟',
        body: `
          <h2>最小启动</h2>
          <pre><code>git clone https://github.com/cropflre/nowen-note.git
cd nowen-note
docker compose up -d

docker compose ps
docker compose logs -f --tail=200 nowen-note</code></pre>
          <h2>上线前检查</h2>
          <ul><li>端口是否从局域网 / 反向代理正确访问。</li><li><code>/app/data</code> 是否映射到持久化存储。</li><li>容器重启后笔记和附件是否仍然存在。</li><li>公网访问是否使用 HTTPS。</li><li>是否已经创建完整备份。</li></ul>
          <div class="callout danger"><strong>镜像回滚不是数据库回滚</strong><span>升级前要保留独立完整备份，不要把“重新拉旧镜像”当成数据恢复方案。</span></div>
        `
      },
      {
        slug: 'nas', group: 'clients', title: 'NAS 部署：绿联、飞牛、群晖等',
        summary: '在常见 NAS 上部署，并处理端口、目录映射与远程访问。',
        keywords: 'NAS 绿联 UGOS 飞牛 fnOS 群晖 Synology QNAP 极空间 FPK', updated: '2026-08-20', time: '10 分钟',
        figure: { src: 'assets/help/note/nas-deploy.svg', alt: 'Nowen Note NAS 部署流程示意', caption: '所有 NAS 的核心都相同：镜像 / 项目 → 端口 → /app/data 持久化 → 启动 → 验证。' },
        body: `
          <h2>通用思路</h2>
          <ol class="steps"><li><b>创建容器 / Compose 项目</b><span>使用官方仓库或发布镜像。</span></li><li><b>映射 3001 端口</b><span>如冲突，可调整主机端口。</span></li><li><b>映射持久化目录</b><span>容器内目标必须是 <code>/app/data</code>。</span></li><li><b>启动并用浏览器验证</b><span>访问 <code>http://NAS-IP:3001</code>。</span></li><li><b>做一次重启验证</b><span>确认数据没有因为目录映射错误而丢失。</span></li></ol>
          <h2>不同 NAS</h2>
          <table><thead><tr><th>平台</th><th>常见方式</th></tr></thead><tbody><tr><td>群晖 Synology</td><td>Container Manager / SSH Compose</td></tr><tr><td>绿联 UGOS</td><td>Docker 应用创建 Compose 项目</td></tr><tr><td>飞牛 fnOS</td><td>Docker / Compose；仓库教程也记录了 .fpk 安装方式</td></tr><tr><td>威联通 QNAP</td><td>Container Station</td></tr><tr><td>极空间</td><td>Docker 功能导入 Compose</td></tr></tbody></table>
        `
      },
      {
        slug: 'remote-access', group: 'clients', title: 'NAS 远程访问与客户端登录',
        summary: '理清局域网 IP、IPv6、域名、HTTPS、反向代理和客户端地址。',
        keywords: '远程访问 NAS 公网 域名 HTTPS IPv6 反向代理 localhost 客户端 登录', updated: '2026-08-20', time: '9 分钟',
        body: `
          <h2>先判断你在哪种网络场景</h2>
          <table><thead><tr><th>场景</th><th>服务器地址示例</th></tr></thead><tbody><tr><td>同一局域网</td><td><code>http://192.168.1.20:3001</code></td></tr><tr><td>已配置域名与 HTTPS</td><td><code>https://note.example.com</code></td></tr><tr><td>IPv6 可直达</td><td>使用可从客户端访问的 IPv6 地址 / 域名</td></tr></tbody></table>
          <h2>浏览器能开，客户端却登不上时</h2>
          <ul><li>确认客户端里填的是同一个完整 URL，包含协议和必要端口。</li><li>检查反向代理是否同时允许 API、WebSocket 和附件请求。</li><li>检查证书是否被系统信任，避免使用异常自签证书。</li><li>确认服务端公开地址 / CORS 配置没有只允许某一个来源。</li><li>不要在手机或另一台电脑填写 <code>localhost</code>。</li></ul>
        `
      },
      {
        slug: 'backup-upgrade', group: 'clients', title: '备份、恢复与安全升级',
        summary: '建立完整备份、远程备份和升级前恢复保障。',
        keywords: '备份 恢复 完整 ZIP WebDAV 邮件 升级 回滚 数据库 附件', updated: '2026-08-20', time: '10 分钟',
        body: `
          <p>完整备份需要同时考虑数据库、附件和运行数据。Nowen Note 支持本地自动备份、完整 ZIP、邮件备份与 WebDAV 远程备份等能力。</p>
          <h2>推荐的 3-2-1 思路</h2>
          <ol class="steps"><li><b>至少 3 份数据</b><span>生产数据 + 本地备份 + 另一份副本。</span></li><li><b>至少 2 种介质 / 位置</b><span>例如 NAS 本地盘 + WebDAV / 其他设备。</span></li><li><b>至少 1 份异地</b><span>避免单台 NAS 故障同时带走生产和备份。</span></li></ol>
          <h2>升级前</h2>
          <ul><li>创建一份最新完整备份。</li><li>确认备份文件确实可访问，而不是只看到“任务成功”。</li><li>记录当前版本和 Compose / 环境变量。</li><li>升级后检查登录、笔记、附件、搜索和关键客户端。</li></ul>
          <div class="callout danger"><strong>务必做恢复演练</strong><span>没有被实际恢复过的备份，只能算“可能可用”。</span></div>
        `
      },
      {
        slug: 'import-export', group: 'support', title: '导入、导出与迁移',
        summary: '从 Markdown、DOCX、Obsidian、思源等来源迁移，并理解图片与附件边界。',
        keywords: '导入 导出 Markdown DOCX Obsidian 思源 小米 微信 SingleFile ZIP 附件', updated: '2026-08-20', time: '9 分钟',
        body: `
          <p>当前导入能力覆盖 Markdown、Word / DOCX、网页 URL、微信公众号、SingleFile HTML、思源、Obsidian、小米笔记等来源，并可根据流程选择导入为 Markdown 或富文本。</p>
          <h2>迁移前先做小样本</h2>
          <ol class="steps"><li><b>选 5～20 篇代表性内容</b><span>要包含图片、表格、代码、附件和长文。</span></li><li><b>先测试导入</b><span>确认目录、标题、正文和图片。</span></li><li><b>再批量迁移</b><span>不要第一次就把全部数据塞进生产库。</span></li><li><b>迁移后抽查</b><span>重点检查远程图片是否已本地化、附件是否可下载。</span></li></ol>
        `
      },
      {
        slug: 'security', group: 'support', title: '安全设置与最小权限',
        summary: '管理员密码、2FA、Token、HTTPS、CORS 与公网部署基本安全线。',
        keywords: '安全 密码 2FA Token HTTPS CORS JWT 审计 最小权限', updated: '2026-08-20', time: '8 分钟',
        body: `
          <h2>上线前最低安全线</h2>
          <ul><li>修改默认管理员密码。</li><li>按需要开启 2FA。</li><li>公网入口使用 HTTPS。</li><li>API / MCP / 剪藏分别创建独立 Token，并只给需要的 scopes。</li><li>不要把真实 Token、密码、JWT_SECRET 写进公开仓库。</li><li>多实例部署时确保共享正确的 JWT_SECRET。</li></ul>
          <div class="callout danger"><strong>自托管不等于自动安全</strong><span>数据虽然掌握在自己手中，但公网暴露、弱密码、过度权限和没有备份仍会造成实际风险。</span></div>
        `
      },
      {
        slug: 'faq', group: 'support', title: '常见问题排查',
        summary: '从“打不开、登不上、图片失败、同步异常、升级问题”快速定位。',
        keywords: 'FAQ 登录失败 图片加载失败 同步 冲突 白屏 Docker NAS 排查', updated: '2026-08-20', time: '10 分钟',
        body: `
          <h2>浏览器打不开</h2><p>先检查服务是否运行、端口是否监听、Docker 映射是否正确，再检查 NAS 防火墙和反向代理。</p>
          <h2>浏览器能开，客户端登不上</h2><p>核对完整服务器 URL、证书、CORS / 公开地址和 WebSocket；手机或其他电脑不要填 localhost。</p>
          <h2>图片或附件加载失败</h2><p>先确认原附件仍存在，再检查附件请求、签名地址、对象存储配置和客户端网络。不要第一时间执行“孤儿清理”。</p>
          <h2>多端同步异常</h2><p>确认各端连接的是同一服务器 / 工作区，网络恢复后给同步队列时间处理；重要冲突内容先保留副本，不要边排查边永久删除。</p>
          <h2>升级后异常</h2><p>记录升级前后版本，检查浏览器 / WebView 缓存、服务端日志和数据库迁移状态；必要时使用升级前完整备份恢复，而不是只切换旧镜像。</p>
        `
      },
      {
        slug: 'mcp', group: 'support', title: 'MCP：让 Claude Code / Cursor 连接笔记',
        summary: '源码构建 MCP Server，创建 restricted Token，并配置 AI 客户端。',
        keywords: 'MCP Claude Code Cursor VS Code Node 20 Token NOWEN_URL NOWEN_API_TOKEN', updated: '2026-08-20', time: '12 分钟',
        body: `
          <div class="callout info"><strong>当前官方方式</strong><span>MCP Server 当前以源码安装为正式路径，需要 Node.js 20+、Git 和 npm。客户端应运行稳定启动器 <code>bin/nowen-mcp.mjs</code>。</span></div>
          <h2>1. 构建 MCP Server</h2>
          <pre><code>git clone https://github.com/cropflre/nowen-note.git
cd nowen-note/packages/nowen-mcp
npm install
npm run build</code></pre>
          <h2>2. 创建专用 Personal API Token</h2>
          <p>进入「设置 → 个人访问令牌」，为每个 AI 客户端创建独立 restricted Token。只开启需要的 <code>notes:read</code>、<code>notes:write</code> 等范围，并限制可访问笔记本。</p>
          <h2>3. 配置环境变量</h2>
          <pre><code>NOWEN_URL=http://192.168.1.20:3001
NOWEN_API_TOKEN=nkn_xxx</code></pre>
          <p>如果 Nowen Note 在 NAS 上，<code>NOWEN_URL</code> 必须是运行 AI 客户端的这台电脑真正能访问的 NAS 地址，不能写 localhost。</p>
          <h2>4. 使用绝对路径运行启动器</h2>
          <p>Windows、macOS、Linux / WSL 都应该把 <code>bin/nowen-mcp.mjs</code> 的绝对路径填进客户端。<code>dist/scoped-entry.js</code> 是启动器内部加载的构建产物，不应直接作为客户端入口。</p>
          <div class="callout tip"><strong>安装失败先分层排查</strong><span>浏览器能否打开 NOWEN_URL → Token 是否有效 → Node 是否 ≥20 → build 产物是否存在 → 启动器绝对路径是否正确。</span></div>
        `
      },
      {
        slug: 'api', group: 'support', title: 'API、SDK、CLI 与 Webhook',
        summary: '用 Personal API Token 把 Nowen Note 接入脚本和自动化。',
        keywords: 'OpenAPI API SDK CLI Webhook Personal Token 自动化', updated: '2026-08-20', time: '7 分钟',
        body: `
          <p>Nowen Note 提供 OpenAPI 3.0、TypeScript SDK、CLI、Webhook、Personal API Token 和插件能力。自动化接入应该优先使用专用 Token，而不是模拟网页登录。</p>
          <h2>自动化接入原则</h2>
          <ul><li>一个系统 / 一个客户端使用一个 Token。</li><li>按 scopes 和笔记本资源范围限制权限。</li><li>只读流程不要给写权限。</li><li>Token 放在环境变量或密钥管理系统，不进入前端代码和公开仓库。</li><li>Webhook 接收端需要校验来源并处理重复事件。</li></ul>
          <p>完整接口与字段以仓库当前 OpenAPI / SDK 文档为准。</p>
        `
      }
    ]
  }
};

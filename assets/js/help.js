(() => {
  'use strict';

  const GROUPS = [
    { id: 'start', title: '快速上手' },
    { id: 'knowledge', title: '笔记与知识管理' },
    { id: 'productivity', title: '效率与 AI' },
    { id: 'data', title: '多端、部署与数据' },
    { id: 'support', title: '问题排查与开放能力' }
  ];

  const ARTICLES = [
    {
      slug: 'intro', group: 'start', title: 'Nowen Note 是什么？',
      summary: '认识弄文笔记：开源、自托管、多端可用的知识库与工作台。',
      keywords: '介绍 自托管 知识库 弄文笔记 nowen note 功能', updated: '2026-08-20',
      body: `
        <p>Nowen Note（弄文笔记）是一套<strong>开源、自托管的知识库、每日记录与任务协作工作台</strong>。它把笔记、文档树、富文本 / Markdown、附件、搜索、AI、每日记录、任务和团队协作放在同一套系统中。</p>
        <div class="info-box"><strong>适合谁？</strong>希望把数据保存在自己 NAS / 服务器上的个人用户；希望统一管理工作、学习和生活资料的重度笔记用户；需要多人知识库与权限控制的小团队；以及希望通过 API / MCP 把笔记接入自动化或 AI 工作流的开发者。</div>
        <h2>它和普通云笔记最大的区别</h2>
        <ul>
          <li><strong>数据由你掌控：</strong>可通过 Docker 部署到 NAS 或服务器，数据库、附件、索引和备份由自己管理。</li>
          <li><strong>同一棵知识树：</strong>文件夹、富文本和 Markdown 文档可以混合组织，支持多层级、拖拽与排序。</li>
          <li><strong>在线与离线协同：</strong>Web、桌面端和 Android 可以连接同一台服务，支持离线工作区和恢复同步。</li>
          <li><strong>知识与行动统一：</strong>除了写笔记，还提供每日记录、任务、思维导图、分享、权限和 AI 知识问答。</li>
          <li><strong>开放：</strong>提供 OpenAPI、Personal API Token、SDK、CLI、Webhook、MCP Server 和浏览器剪藏能力。</li>
        </ul>
        <h2>核心功能地图</h2>
        <table><thead><tr><th>模块</th><th>可以做什么</th></tr></thead><tbody>
          <tr><td>笔记与知识树</td><td>创建文件夹、富文本 / Markdown 文档，拖拽层级，标签、收藏、置顶、双链、全文搜索。</td></tr>
          <tr><td>编辑器</td><td>表格、代码块、KaTeX、Mermaid、图片、视频、附件、斜杠命令、版本历史。</td></tr>
          <tr><td>每日记录</td><td>用瞬间、日历、日记记录生活和工作，并生成周报 / 月报。</td></tr>
          <tr><td>任务中心</td><td>树形任务、列表、看板、日历、时间轴、重复规则、提醒、模板和 My Day。</td></tr>
          <tr><td>AI</td><td>续写、改写、翻译、总结、标题 / 标签生成、Embedding 和 RAG 知识问答。</td></tr>
          <tr><td>部署与安全</td><td>Docker / NAS 自托管，备份恢复，对象存储，HTTPS、2FA、Token 与权限控制。</td></tr>
        </tbody></table>
        <h2>推荐第一次使用的路线</h2>
        <ol class="step-list">
          <li><strong>先决定使用方式。</strong>长期使用优先 Docker / NAS；仅体验可以先访问在线演示。</li>
          <li><strong>完成首次登录和密码修改。</strong>自托管默认管理员必须先完成安全设置。</li>
          <li><strong>建立 3～5 个稳定的一级分类。</strong>目录不要一开始就做得太深，跨目录主题交给标签。</li>
          <li><strong>写第一篇笔记并试一次搜索。</strong>确认保存、附件和搜索链路都正常。</li>
          <li><strong>创建一份完整备份。</strong>正式存重要数据之前，先验证备份位置和恢复方式。</li>
        </ol>
      `
    },
    {
      slug: 'quick-start', group: 'start', title: '5 分钟快速上手',
      summary: '从部署、登录到创建第一篇笔记，一次完成最重要的初始化。',
      keywords: '快速上手 安装 登录 第一篇笔记 docker demo', updated: '2026-08-20',
      body: `
        <p>下面这条路径适合第一次接触 Nowen Note 的用户。目标是先跑通“访问 → 登录 → 建目录 → 写笔记 → 备份”，再按需要配置 AI 和高级功能。</p>
        <h2>1. 选择使用方式</h2>
        <h3>Docker Compose（长期使用推荐）</h3>
        <pre><code>git clone https://github.com/cropflre/nowen-note.git
cd nowen-note
docker compose up -d</code></pre>
        <p>启动后在浏览器访问 <code>http://&lt;服务器或 NAS IP&gt;:3001</code>。容器内持久化目录为 <code>/app/data</code>，正式使用前应确认该目录已经正确映射并能跨容器重启保留。</p>
        <h3>桌面端 / Android</h3>
        <p>从 <a href="https://github.com/cropflre/nowen-note/releases" target="_blank" rel="noopener">GitHub Releases</a> 下载对应平台安装包。客户端首次启动时填写你的 Nowen Note 服务地址。手机连接 NAS 时不要填写 <code>localhost</code> 或 <code>127.0.0.1</code>。</p>
        <h3>在线体验</h3>
        <p>可以先访问 <a href="http://note.nowen.cn/" target="_blank" rel="noopener">note.nowen.cn</a>。演示环境的数据可能被重置，不要保存敏感或重要内容。</p>
        <h2>2. 首次登录</h2>
        <table><thead><tr><th>字段</th><th>默认值</th></tr></thead><tbody><tr><td>用户名</td><td><code>admin</code></td></tr><tr><td>密码</td><td><code>admin123</code></td></tr></tbody></table>
        <div class="warning"><strong>首次登录必须做</strong>进入「设置 → 安全设置」修改默认管理员密码。公网部署还应配置 HTTPS、正确公开访问地址和 CORS 来源，并尽快创建第一份完整备份。</div>
        <h2>3. 创建第一个笔记本</h2>
        <ol class="step-list">
          <li>在左侧笔记本 / 文档树区域点击新增入口。</li>
          <li>输入名称，例如“工作”“学习”或“生活”。</li>
          <li>需要时选择 Emoji 图标，然后确认。</li>
          <li>后续可以创建子目录，也可以直接把文档放在根目录。</li>
        </ol>
        <div class="tip"><strong>目录不要过度设计</strong>建议先用少量稳定一级分类；“项目 A / 会议 / 灵感”等跨目录属性更适合用标签和搜索组织。</div>
        <h2>4. 创建第一篇笔记</h2>
        <ol class="step-list"><li>选中一个目录。</li><li>点击“新建笔记”，选择富文本或 Markdown。</li><li>输入标题和正文，插入一张图片或附件测试上传链路。</li><li>等待保存状态完成，再切换到其他笔记并返回确认内容仍然存在。</li></ol>
        <p>Nowen Note 会自动保存，一般不需要手动按 Ctrl / Cmd + S。</p>
        <h2>5. 最后做一次备份</h2>
        <p>进入「设置 → 数据管理」创建完整备份。完整恢复不仅需要数据库，还需要附件和运行数据；只复制数据库文件并不能完整恢复图片与附件。</p>
      `
    },
    {
      slug: 'ui-overview', group: 'start', title: '界面与导航',
      summary: '看懂三栏布局、文档树、笔记列表、编辑器和移动端导航。',
      keywords: '界面 三栏 导航 文档树 侧边栏 移动端 设置', updated: '2026-08-20',
      body: `
        <p>桌面宽屏下，Nowen Note 的核心工作区可以理解为<strong>导航 / 文档树 → 笔记列表 → 编辑器</strong>三层信息结构；手机上则会收敛成抽屉式导航，让一次操作只聚焦一个区域。</p>
        <h2>左侧：全局导航与文档树</h2>
        <p>这里负责“我现在在哪个空间、哪个功能、哪个目录”。常见入口包括所有笔记、收藏、文件、回收站、每日记录 / 说说、任务、思维导图、AI 与工作区。</p>
        <ul><li>点击目录切换当前内容范围。</li><li>展开 / 收起子目录查看层级。</li><li>通过右键菜单完成新建、重命名、移动、删除等操作。</li><li>支持拖拽调整排序和父子层级。</li></ul>
        <h2>中间：笔记列表</h2>
        <p>笔记列表负责显示当前范围的文档。你可以查看标题、摘要、更新时间、置顶 / 收藏状态，并切换手动排序、更新时间、创建时间或标题等排序方式。</p>
        <div class="tip"><strong>批量整理</strong>需要一次移动或删除多篇笔记时，优先使用多选与批量操作，不要逐条处理。</div>
        <h2>右侧：编辑器</h2>
        <p>编辑器包含标题、标签、正文、格式工具和笔记级操作。常见操作有收藏、置顶、锁定、分享、附件、版本历史以及 AI。</p>
        <h2>布局可以调整</h2>
        <p>桌面端可以拖动分隔线改变侧边栏和列表宽度，也可以收起部分栏位，让正文区域获得更大空间。长篇写作或专注阅读时建议收起不需要的栏位。</p>
        <h2>移动端</h2>
        <p>手机采用抽屉式布局。通过左上角菜单打开导航与目录，再进入笔记或其他功能。移动端更适合快速记录、查看任务、处理图片和阅读；复杂批量整理仍推荐在桌面宽屏完成。</p>
      `
    },
    {
      slug: 'notes-organize', group: 'knowledge', title: '创建、整理与管理笔记',
      summary: '用知识树、标签、收藏、置顶、回收站和版本历史组织长期资料。',
      keywords: '新建 笔记本 文件夹 标签 收藏 置顶 回收站 版本 历史 拖拽', updated: '2026-08-20',
      body: `
        <p>Nowen Note 的组织原则是“<strong>层级负责稳定结构，标签负责横向主题，搜索负责快速定位</strong>”。不要把所有知识都塞进很深的文件夹。</p>
        <h2>知识树怎么设计</h2>
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
        <p>一到两层通常已经足够。某篇内容同时属于多个主题时，用标签比重复建立多个目录更合适。</p>
        <h2>常用笔记管理动作</h2>
        <table><thead><tr><th>动作</th><th>建议场景</th></tr></thead><tbody>
          <tr><td>收藏</td><td>经常需要回看的高频笔记。</td></tr><tr><td>置顶</td><td>当前阶段最重要、需要在列表顶部持续可见的内容。</td></tr><tr><td>标签</td><td>跨目录主题、状态、人物、项目等横向分类。</td></tr><tr><td>锁定</td><td>避免重要资料在查看时被误编辑。</td></tr><tr><td>版本历史</td><td>误改、需要找回旧段落或对比变化。</td></tr><tr><td>回收站</td><td>删除后的第一道保护，确认无用后再永久清理。</td></tr>
        </tbody></table>
        <h2>拖拽和手动排序</h2>
        <p>手动排序适合建立固定阅读顺序。拖拽目录或文档时先确认落点高亮的位置，尤其在多层目录中，避免把“排序”误操作成“移动到子目录”。</p>
        <h2>根目录文档</h2>
        <p>Nowen Note 支持根目录直接创建文档。适合临时收集箱、快速捕获和还未确定分类的内容。之后再通过移动或批量整理归档。</p>
      `
    },
    {
      slug: 'editors', group: 'knowledge', title: '富文本与 Markdown 编辑器',
      summary: '选择适合自己的编辑模式，并掌握图片、表格、代码、公式和 Mermaid。',
      keywords: '富文本 markdown 编辑器 tiptap codemirror 表格 图片 mermaid katex 斜杠', updated: '2026-08-20',
      body: `
        <p>Nowen Note 同时提供富文本和 Markdown。两者不是“高级 / 低级”的区别，而是适合不同写作习惯。</p>
        <h2>什么时候用富文本</h2>
        <ul><li>希望所见即所得，不想记语法。</li><li>日常会议、生活记录、资料整理。</li><li>大量使用图片、表格、Callout、链接和复杂内容块。</li></ul>
        <p>富文本编辑器支持标题、列表、引用、高亮、链接、表格、代码块、KaTeX、Mermaid、图片、视频和附件。输入 <code>/</code> 可以打开斜杠命令快速插入内容。</p>
        <h2>什么时候用 Markdown</h2>
        <ul><li>技术文档、README、代码相关内容。</li><li>希望内容保持纯文本、方便 Git 管理或迁移。</li><li>习惯键盘写作和 Markdown 语法。</li></ul>
        <p>Markdown 使用 CodeMirror 编辑，支持实时预览、分屏、滚动同步、代码块、表格、数学公式和 Mermaid。</p>
        <h2>图片与附件</h2>
        <p>常见插入方式包括拖拽文件、粘贴剪贴板图片、斜杠命令和附件按钮。附件会进入统一文件系统，并可生成缩略图、检查引用关系和进行孤儿清理。</p>
        <div class="warning"><strong>切换编辑格式前先检查复杂块</strong>表格、扩展块、图片属性、公式和特殊 Markdown 扩展在格式互转后可能需要人工确认。重要长文建议先保留版本或备份。</div>
      `
    },
    {
      slug: 'search-organize', group: 'knowledge', title: '搜索、标签、双链与知识图谱',
      summary: '快速找到内容，并用标签、双向链接和图谱建立知识之间的关系。',
      keywords: '全文搜索 标签 双向链接 双链 块引用 反向链接 知识图谱 查找', updated: '2026-08-20',
      body: `
        <p>当笔记数量增加以后，最重要的不是“把目录建得更深”，而是让搜索和关联真正可用。</p>
        <h2>全文搜索</h2>
        <p>使用全局搜索查找标题和正文内容；在当前目录工作时，也可以把范围缩小，减少无关结果。找到长文后再使用文内查找 / 替换定位具体段落。</p>
        <h2>标签</h2>
        <p>标签适合描述“这篇内容是什么”，例如 <code>客户</code>、<code>React</code>、<code>待读</code>、<code>2026-Q3</code>。建议控制标签数量并保持命名一致，不要同时存在“前端 / frontend / FrontEnd”这类同义标签。</p>
        <h2>双向链接和反向链接</h2>
        <p>当一篇笔记引用另一篇笔记时，双向链接能够帮助你从被引用页面反向看到关联来源。适合人物、项目、专题和长期知识节点。</p>
        <h2>知识图谱</h2>
        <p>图谱适合观察“哪些知识点正在形成连接”，但不建议把图谱本身当作主要导航。日常查找仍以目录、标签和搜索为主。</p>
        <div class="tip"><strong>推荐方法</strong>稳定的大类用目录，跨目录属性用标签，明确的知识关系用双链，找具体内容用搜索。四种方式各司其职。</div>
      `
    },
    {
      slug: 'daily', group: 'productivity', title: '每日记录：瞬间、日历与日记',
      summary: '记录短内容、心情、图片与日记，并用周报/月报回顾一段时间。',
      keywords: '每日记录 说说 瞬间 日历 日记 心情 周报 月报', updated: '2026-08-20',
      body: `
        <p>每日记录适合承载不值得单独建“正式文档”、但值得保留在时间线里的内容，例如临时想法、工作进度、生活片段和当天总结。</p>
        <h2>瞬间</h2><p>适合快速发布短内容，可以附带心情、图片或视频。它更像你的私人时间线，重点是低成本记录。</p>
        <h2>日历</h2><p>按日期回看记录，适合确认某一天发生了什么，或者补写当天内容。</p>
        <h2>日记</h2><p>需要更完整表达时，把内容写成日记实体并长期归档。它和短内容可以共存：瞬间负责捕捉，日记负责总结。</p>
        <h2>AI 周报 / 月报</h2><p>当一段时间积累了足够记录后，可以让 AI 汇总阶段性内容。生成后建议检查日期、数字、人名和结论，再把真正有价值的总结沉淀成正式笔记。</p>
        <div class="tip"><strong>一个简单习惯</strong>白天用“瞬间”低成本记录，晚上只补一段日记，每周再做一次总结。比强迫自己每条内容都分类更容易长期坚持。</div>
      `
    },
    {
      slug: 'tasks', group: 'productivity', title: '任务中心与习惯管理',
      summary: '用列表、看板、日历、时间轴、提醒和重复规则管理行动。',
      keywords: '任务 待办 看板 日历 甘特 时间轴 提醒 重复 my day 习惯', updated: '2026-08-20',
      body: `
        <p>任务中心用于管理“需要行动的事情”，不要把所有待办都写进正文里。笔记负责解释背景，任务负责明确下一步。</p>
        <h2>从 Inbox 开始</h2><p>临时想到的事项先快速捕获到 Inbox，再在固定时间补充截止日期、标签、优先级或移动到具体项目。</p>
        <h2>选择合适视图</h2>
        <table><thead><tr><th>视图</th><th>适合场景</th></tr></thead><tbody><tr><td>列表</td><td>快速处理和排序日常待办。</td></tr><tr><td>看板</td><td>按状态推进项目，例如待处理 / 进行中 / 已完成。</td></tr><tr><td>日历</td><td>查看有明确日期的任务。</td></tr><tr><td>时间轴 / 甘特</td><td>观察任务跨度、依赖关系和阶段安排。</td></tr><tr><td>My Day</td><td>每天只聚焦今天真正要完成的少量任务。</td></tr></tbody></table>
        <h2>重复、提醒和模板</h2><p>周期性事项不要每天手工创建，使用重复规则；固定流程可以保存为模板；有明确时间点的事情使用提醒。Android 端还可以配合原生任务提醒。</p>
        <h2>任务与笔记怎么配合</h2><p>复杂任务建议在相关笔记里保存背景、资料和决策，在任务里只写可执行动作并附上关联信息。这样能避免任务列表变成长文档。</p>
      `
    },
    {
      slug: 'ai', group: 'productivity', title: '配置与使用 AI',
      summary: '配置 OpenAI 兼容接口、DeepSeek、Gemini、豆包、通义或 Ollama，并使用 RAG。',
      keywords: 'AI OpenAI DeepSeek Gemini 豆包 通义 Ollama RAG embedding 总结 改写', updated: '2026-08-20',
      body: `
        <p>AI 是可选能力。Nowen Note 支持在线模型和本地模型，配置按用户保存，因此管理员和普通成员可以使用不同的服务商和密钥。</p>
        <h2>配置服务商</h2>
        <ol class="step-list"><li>打开「设置 → AI 设置」。</li><li>选择服务商或 OpenAI-compatible 类型。</li><li>填写接口地址、API Key 和模型名等必要信息。</li><li>保存后先做一次最小测试，再开启 Embedding / RAG。</li></ol>
        <p>常见支持类型包括 OpenAI 兼容接口、通义千问、Gemini、DeepSeek、豆包和 Ollama。</p>
        <h2>写作类能力</h2><ul><li>续写、改写、翻译和格式整理。</li><li>根据正文生成标题与标签。</li><li>总结长文、提取要点。</li><li>把笔记内容转换成思维导图结构。</li></ul>
        <h2>RAG 知识问答</h2><p>知识库模式会先从索引中检索相关笔记 / 附件，再把匹配片段发送给模型，而不是每次把全部笔记上传。当前笔记模式和选中文本模式则进一步缩小上下文范围。</p>
        <div class="warning"><strong>隐私边界</strong>只要使用在线模型或在线 Embedding，完成索引或回答所需的相关文本就可能发送给你配置的服务商。身份证、密码、API Key、助记词等高度敏感信息仍不建议明文保存。</div>
        <div class="tip"><strong>追求本地化</strong>可以使用 Ollama 等本地服务，让模型推理尽量留在自己的设备或服务器中。</div>
      `
    },
    {
      slug: 'import-export', group: 'data', title: '导入、导出与迁移内容',
      summary: '从 Markdown、DOCX、网页、Obsidian、思源等来源迁入，并安全导出。',
      keywords: '导入 导出 markdown docx word obsidian 思源 微信 网页 zip 迁移', updated: '2026-08-20',
      body: `
        <p>Nowen Note 的导入导出目标不是只解决“一篇文档”，而是帮助你在不同知识工具之间迁移并保留附件。</p>
        <h2>常见导入来源</h2><p>支持 Markdown、Word / DOCX、网页 URL、微信公众号、SingleFile HTML、思源、Obsidian、小米笔记等来源。部分导入任务支持选择导入为 Markdown 或富文本。</p>
        <h2>迁移前建议</h2><ol class="step-list"><li>先在原工具完整备份。</li><li>选少量典型文档做试导入，包括图片、表格、代码、公式和附件。</li><li>确认目录结构、标题、图片和格式符合预期后再批量迁移。</li><li>迁移后用搜索和附件检查抽样验收。</li></ol>
        <h2>导出</h2><p>根据内容类型可以导出 Markdown 等格式；带图片的内容应优先使用包含附件的 ZIP 方案，以减少正文和资源分离。</p>
        <div class="warning"><strong>不要把“导出成功”当作“迁移完成”</strong>真正的验收至少要抽查正文、图片、附件、目录层级和特殊块。准备离开旧系统前，再做一次完整备份。</div>
      `
    },
    {
      slug: 'clients', group: 'data', title: 'Web、桌面端与移动端',
      summary: '在浏览器、Windows/macOS/Linux 和 Android 上连接同一台 Nowen Note 服务。',
      keywords: 'web electron windows mac linux android ios harmony 客户端 NAS 连接', updated: '2026-08-20',
      body: `
        <p>Nowen Note 的核心思路是“服务端保存统一数据，多端连接同一服务”。因此客户端地址填写是否正确，比安装本身更重要。</p>
        <h2>Web</h2><p>浏览器直接打开你的服务地址即可使用，无需安装。适合任何临时设备，也是排查“客户端无法连接”时最重要的对照组。</p>
        <h2>Windows / macOS / Linux</h2><p>桌面客户端基于 Electron，安装包以 <a href="https://github.com/cropflre/nowen-note/releases" target="_blank" rel="noopener">Releases</a> 为准。首次启动填写服务地址；如果浏览器能访问而客户端不能访问，优先检查证书、代理、跨域 / Origin 和客户端网络策略。</p>
        <h2>Android</h2><p>Android 是正式维护的移动端。连接家中 NAS 时填写 NAS 的局域网 IP、IPv6 地址或可访问域名，不要使用手机自己的 <code>localhost</code>。</p>
        <h2>iOS 与 HarmonyOS</h2><p>项目中已有对应工程或发布流程，具体可用范围和安装方式以仓库最新说明 / Release 为准。</p>
        <h2>公网访问建议</h2><ul><li>优先使用 HTTPS 域名。</li><li>确保证书链完整且客户端信任。</li><li>反向代理 WebSocket 时不要漏掉升级头。</li><li>不要直接暴露不必要的管理端口。</li></ul>
      `
    },
    {
      slug: 'deploy', group: 'data', title: 'Docker 与 NAS 部署',
      summary: '把 Nowen Note 长期运行在 NAS、Linux 服务器或家庭设备上。',
      keywords: 'docker compose nas 绿联 飞牛 群晖 部署 3001 app data', updated: '2026-08-20',
      body: `
        <p>长期自托管首选 Docker Compose。它最容易复现、升级和迁移，也适合绿联 UGOS、飞牛 fnOS、群晖等支持容器的 NAS。</p>
        <h2>最小启动</h2>
        <pre><code>git clone https://github.com/cropflre/nowen-note.git
cd nowen-note
docker compose up -d

docker compose ps
docker compose logs -f --tail=200 nowen-note</code></pre>
        <p>默认服务可通过 <code>http://NAS-IP:3001</code> 访问。</p>
        <h2>最重要的数据目录</h2><p>容器内持久化目录是 <code>/app/data</code>。开始长期写重要内容前，必须验证：容器删除 / 重建后数据仍在；宿主机目录有足够空间；备份任务能够覆盖数据库和附件。</p>
        <h2>NAS 连接</h2><p>服务部署在 NAS 后，Web、桌面端和 Android 都可以通过局域网 IP、IPv6 或已配置 HTTPS 的公网域名连接。</p>
        <h2>上线前检查</h2><ul><li>修改默认管理员密码。</li><li>确认数据卷和备份位置不是临时目录。</li><li>公网使用 HTTPS。</li><li>配置正确公开访问地址和 CORS。</li><li>升级前创建完整备份。</li></ul>
        <div class="warning"><strong>升级和回滚</strong>镜像回滚不等于数据库回滚。生产环境升级前保留独立、可恢复的完整备份，不要只依赖旧镜像。</div>
      `
    },
    {
      slug: 'backup', group: 'data', title: '备份、恢复与数据安全',
      summary: '理解哪些数据必须备份，以及升级前、迁移前和灾难恢复时怎么做。',
      keywords: '备份 恢复 数据安全 app data 数据库 附件 webdav 邮件 s3', updated: '2026-08-20',
      body: `
        <p>对于自托管软件，“能备份”不等于“可恢复”。真正安全的备份必须包含完整数据，并定期做恢复演练。</p>
        <h2>要备份什么</h2><p>Docker 核心运行数据位于 <code>/app/data</code>，其中不仅有数据库，还可能包含附件、备份、字体和运行密钥等。只保存数据库文件无法完整恢复图片和附件。</p>
        <h2>建议的 3-2-1 思路</h2><ul><li>至少保留 3 份数据副本。</li><li>使用 2 种不同存储介质。</li><li>至少 1 份放在设备之外，例如另一台 NAS、WebDAV 或异地存储。</li></ul>
        <h2>什么时候一定要备份</h2><ul><li>升级 Docker 镜像之前。</li><li>批量导入 / 迁移之前。</li><li>大规模清理附件之前。</li><li>调整存储后端或数据库之前。</li></ul>
        <h2>恢复演练</h2><ol class="step-list"><li>在非生产环境准备一套干净实例。</li><li>导入最近完整备份。</li><li>检查笔记数量、图片、附件、登录、搜索和关键设置。</li><li>记录恢复耗时和缺失项，修正备份策略。</li></ol>
        <div class="tip"><strong>最关键的一句话</strong>没有成功恢复过的备份，只能叫“可能有用的文件”。</div>
      `
    },
    {
      slug: 'faq', group: 'support', title: '常见问题与排查思路',
      summary: '登录失败、客户端连不上、图片异常、同步冲突和性能问题怎么排查。',
      keywords: 'faq 登录失败 同步 冲突 图片 加载失败 客户端 白屏 性能 排查', updated: '2026-08-20',
      body: `
        <h2>浏览器能打开，客户端连不上</h2><ol><li>确认客户端填写的是完整服务地址，不是 <code>localhost</code>。</li><li>如果使用 HTTPS，检查证书链是否被系统 / WebView 信任。</li><li>检查反向代理、WebSocket、Origin / CORS 设置。</li><li>先在同一设备浏览器打开相同地址，确认网络路径一致。</li></ol>
        <h2>登录失败</h2><p>先确认服务端时间正确、账号密码正确、服务端没有持续重启；管理员可以检查安全设置、2FA 和服务日志。首次部署仍使用默认密码时，应尽快修改。</p>
        <h2>图片或附件加载失败</h2><p>先区分“上传失败”还是“读取失败”。检查文件是否真实存在、签名 URL / 对象存储配置、浏览器网络请求状态和服务端日志。清理孤儿附件前先备份。</p>
        <h2>出现冲突或重复副本</h2><p>不要立刻批量删除。先确认哪一份包含最新内容，检查多端是否同时离线编辑、网络是否频繁中断，再合并有效内容。重要笔记先导出或保留版本。</p>
        <h2>页面慢或首屏久</h2><p>先检查服务器 CPU / 内存 / 磁盘、数据库体量、附件缩略图、网络延迟和浏览器控制台。不要只通过“刷新页面”判断根因。</p>
        <h2>仍然无法解决</h2><p>到 <a href="https://github.com/cropflre/nowen-note/issues" target="_blank" rel="noopener">GitHub Issues</a> 提交问题时，请尽量提供版本、平台、复现步骤、预期结果、实际结果、相关日志和截图，并注意隐藏密码、Token、内网地址等敏感信息。</p>
      `
    },
    {
      slug: 'mcp-api', group: 'support', title: 'MCP、API 与自动化',
      summary: '让 Claude Code、Cursor、VS Code 或自己的程序安全访问 Nowen Note。',
      keywords: 'MCP API OpenAPI SDK CLI Webhook token claude cursor vscode 自动化', updated: '2026-08-20',
      body: `
        <p>Nowen Note 不只是给人使用的 UI，也提供面向自动化和 AI 客户端的开放能力，包括 OpenAPI、TypeScript SDK、CLI、Webhook、Personal API Token 和 MCP Server。</p>
        <h2>MCP 适合什么场景</h2><p>让 Claude Code、Cursor、VS Code 等支持 MCP 的客户端，在授权范围内搜索、读取、创建和更新笔记。例如让 AI 把会议纪要写入指定目录，或者在你的知识库里查资料。</p>
        <h2>权限原则</h2><div class="warning"><strong>始终使用最小权限</strong>为自动化创建 restricted Personal API Token，并限制必要的权限范围和笔记本资源范围。不要把管理员 Token 或真实 API Token 写进公开仓库、截图和聊天记录。</div>
        <h2>MCP 当前使用路径</h2><p>正式教程以仓库 <a href="https://github.com/cropflre/nowen-note/blob/main/docs/tutorials/mcp.md" target="_blank" rel="noopener">MCP Server 安装文档</a> 为准。通常需要 Node.js 20+，构建 nowen-mcp 包，创建受限 Token，再把启动脚本绝对路径配置到客户端。</p>
        <h2>API / SDK / CLI</h2><p>如果是程序化集成而不是 AI 客户端，优先使用 OpenAPI / SDK；一次性或运维脚本可以考虑 CLI；需要监听事件变化时使用 Webhook。</p>
      `
    }
  ];

  const bySlug = Object.fromEntries(ARTICLES.map(a => [a.slug, a]));
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('nowen-help-theme', theme);
    const btn = $('#themeToggle');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
  }

  function initTheme() {
    const saved = localStorage.getItem('nowen-help-theme');
    const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (systemDark ? 'dark' : 'light'));
    $('#themeToggle')?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  }

  function route() {
    const raw = location.hash.replace(/^#\/?/, '');
    if (!raw) return { type: 'home' };
    const parts = raw.split('/').filter(Boolean);
    if (parts[0] === 'note') return parts[1] ? { type: 'article', slug: parts[1] } : { type: 'product' };
    if (['reader','video','bookmarks'].includes(parts[0])) return { type: 'coming', product: parts[0] };
    return { type: 'home' };
  }

  function renderSidebar(activeSlug = '') {
    const nav = $('#sidebarNav');
    if (!nav) return;
    nav.innerHTML = GROUPS.map(group => {
      const links = ARTICLES.filter(a => a.group === group.id).map(a => `<a class="sidebar-link ${a.slug === activeSlug ? 'active' : ''}" href="#/note/${a.slug}">${a.title}</a>`).join('');
      return `<section class="nav-group"><h3 class="nav-group-title">${group.title}</h3>${links}</section>`;
    }).join('');
  }

  function renderProductOverview() {
    $('#articleContainer').innerHTML = `
      <div class="product-overview">
        <div class="product-hero">
          <div class="product-icon">📓</div>
          <div class="article-kicker">NOWEN NOTE · 弄文笔记</div>
          <h1>Nowen Note 使用教程</h1>
          <p>从第一次部署、写下第一篇笔记，到知识管理、AI、任务、多端访问和数据安全。按你的目标选择下面的教程，不需要从头读到尾。</p>
          <div class="article-meta-row" style="margin:18px 0 0"><span class="badge ready">教程已上线</span><span class="badge">以 main 当前能力为准</span></div>
        </div>
        <div class="category-grid">
          ${GROUPS.map(group => `<section class="category-card"><h3>${group.title}</h3>${ARTICLES.filter(a => a.group === group.id).map(a => `<a href="#/note/${a.slug}">→ ${a.title}</a>`).join('')}</section>`).join('')}
        </div>
      </div>`;
    $('#toc').innerHTML = '';
    document.title = 'Nowen Note 使用教程 · Nowen 帮助中心';
  }

  function slugify(text, index) {
    const cleaned = text.trim().toLowerCase().replace(/[\s\/]+/g,'-').replace(/[^\w\u4e00-\u9fa5-]/g,'').replace(/-+/g,'-');
    return cleaned || `section-${index + 1}`;
  }

  function buildToc() {
    const prose = $('#articleBody');
    const toc = $('#toc');
    if (!prose || !toc) return;
    const heads = $$('h2,h3', prose);
    if (heads.length < 2) { toc.innerHTML = ''; return; }
    const seen = new Set();
    heads.forEach((h, i) => {
      let id = slugify(h.textContent, i);
      let n = 2;
      while (seen.has(id)) id = `${id}-${n++}`;
      seen.add(id); h.id = id;
    });
    toc.innerHTML = `<h4>本页目录</h4>${heads.map(h => `<a class="level-${h.tagName === 'H3' ? '3' : '2'}" href="#${h.id}" data-toc-link>${h.textContent}</a>`).join('')}`;
    $$('[data-toc-link]', toc).forEach(link => link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute('href').slice(1));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `${location.hash.split('#')[0]}${location.hash}`);
    }));
  }

  function pager(slug) {
    const idx = ARTICLES.findIndex(a => a.slug === slug);
    const prev = ARTICLES[idx - 1];
    const next = ARTICLES[idx + 1];
    return `<div class="article-pager">
      ${prev ? `<a class="pager-card" href="#/note/${prev.slug}"><small>← 上一篇</small><strong>${prev.title}</strong></a>` : '<div></div>'}
      ${next ? `<a class="pager-card next" href="#/note/${next.slug}"><small>下一篇 →</small><strong>${next.title}</strong></a>` : '<div></div>'}
    </div>`;
  }

  function renderArticle(slug) {
    const article = bySlug[slug] || ARTICLES[0];
    const group = GROUPS.find(g => g.id === article.group);
    $('#articleContainer').innerHTML = `
      <article class="article-wrap">
        <nav class="breadcrumbs"><a href="#/">帮助中心</a><span>/</span><a href="#/note">Nowen Note</a><span>/</span><span>${group.title}</span></nav>
        <div class="article-kicker">${group.title}</div>
        <h1 class="article-title">${article.title}</h1>
        <p class="article-lead">${article.summary}</p>
        <div class="article-meta-row"><span class="badge">更新于 ${article.updated}</span><a class="badge" href="https://github.com/cropflre/nowen-note/tree/main/docs/tutorials" target="_blank" rel="noopener">查看仓库教程 ↗</a></div>
        <div class="prose" id="articleBody">${article.body}</div>
        <footer class="article-footer">
          <div class="article-helpful"><span>这篇教程没有解决你的问题？可以到 GitHub Issues 反馈，并附上版本、平台和复现步骤。</span><a class="badge" href="https://github.com/cropflre/nowen-note/issues" target="_blank" rel="noopener">反馈问题 ↗</a></div>
          ${pager(article.slug)}
        </footer>
      </article>`;
    buildToc();
    renderSidebar(article.slug);
    document.title = `${article.title} · Nowen Note 帮助中心`;
  }

  const COMING = {
    reader: { icon: '📖', title: 'Nowen Reader', desc: '漫画与小说阅读平台教程正在整理。后续会覆盖部署、书库、阅读器、AI、OPDS 和多端客户端。' },
    video: { icon: '🎬', title: 'Nowen Video', desc: '私人家庭影音中心教程正在整理。后续会覆盖媒体库、刮削、播放、字幕、客户端、转码和运维。' },
    bookmarks: { icon: '🔖', title: 'NOWEN 书签', desc: '书签与星云门户教程正在规划。后续会覆盖书签管理、搜索、分类、导入导出与系统监控。' }
  };

  function renderComing(product) {
    const p = COMING[product];
    $('#articleContainer').innerHTML = `<div class="product-overview"><div class="product-hero"><div class="product-icon">${p.icon}</div><div class="article-kicker">COMING SOON</div><h1>${p.title}</h1><p>${p.desc}</p><div class="article-meta-row" style="margin:18px 0 0"><span class="badge">结构已预留</span><a class="badge" href="#/">返回产品中心</a></div></div></div>`;
    $('#toc').innerHTML = '';
    $('#sidebarNav').innerHTML = `<section class="nav-group"><h3 class="nav-group-title">教程状态</h3><a class="sidebar-link active" href="#/${product}">教程建设中</a><a class="sidebar-link" href="#/">返回帮助中心</a></section>`;
    document.title = `${p.title} · Nowen 帮助中心`;
  }

  function renderRoute() {
    const r = route();
    const landing = $('#landing');
    const docs = $('#docsView');
    if (r.type === 'home') {
      landing.hidden = false;
      docs.classList.remove('active');
      document.title = 'Nowen 帮助中心 · 使用教程与问题解答';
    } else {
      landing.hidden = true;
      docs.classList.add('active');
      renderSidebar(r.type === 'article' ? r.slug : '');
      if (r.type === 'article') renderArticle(r.slug);
      else if (r.type === 'product') renderProductOverview();
      else renderComing(r.product);
    }
    $('#docsSidebar')?.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function normalize(text) { return text.toLowerCase().replace(/\s+/g, ' ').trim(); }
  function search(query) {
    const q = normalize(query);
    if (!q) return [];
    const tokens = q.split(' ').filter(Boolean);
    return ARTICLES.map(a => {
      const title = normalize(a.title); const hay = normalize(`${a.title} ${a.summary} ${a.keywords}`);
      let score = 0;
      tokens.forEach(t => { if (title.includes(t)) score += 6; if (hay.includes(t)) score += 2; });
      return { article: a, score };
    }).filter(x => x.score > 0).sort((a,b) => b.score - a.score).slice(0,8).map(x => x.article);
  }

  function renderSearchResults(query) {
    const box = $('#searchResults');
    if (!box) return;
    const results = search(query);
    if (!query.trim()) { box.classList.remove('show'); box.innerHTML = ''; return; }
    box.innerHTML = results.length ? results.map(a => `<a class="search-result" href="#/note/${a.slug}"><strong>${a.title}</strong><span>${a.summary}</span></a>`).join('') : `<div class="search-empty">没有找到“${query.replace(/[<>]/g,'')}”相关教程</div>`;
    box.classList.add('show');
  }

  function initSearch() {
    const input = $('#globalSearch'); const box = $('#searchResults'); const hero = $('#heroSearch');
    input?.addEventListener('input', () => renderSearchResults(input.value));
    input?.addEventListener('focus', () => { if (input.value.trim()) renderSearchResults(input.value); });
    input?.addEventListener('keydown', e => {
      if (e.key === 'Escape') { box?.classList.remove('show'); input.blur(); }
      if (e.key === 'Enter') { const first = search(input.value)[0]; if (first) location.hash = `#/note/${first.slug}`; }
    });
    hero?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const first = search(hero.value)[0]; location.hash = first ? `#/note/${first.slug}` : '#/note'; }
    });
    document.addEventListener('click', e => { if (!e.target.closest('.header-search')) box?.classList.remove('show'); });
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input?.focus(); input?.select(); }
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName || '')) { e.preventDefault(); input?.focus(); }
    });
  }

  function initMobile() {
    $('#mobileMenu')?.addEventListener('click', () => $('#docsSidebar')?.classList.toggle('open'));
    $('#docsSidebar')?.addEventListener('click', e => { if (e.target.closest('a')) $('#docsSidebar').classList.remove('open'); });
  }

  function initProductSwitcher() {
    $('#productSwitcher')?.addEventListener('click', () => { location.hash = '#/'; });
  }

  initTheme();
  initSearch();
  initMobile();
  initProductSwitcher();
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
})();

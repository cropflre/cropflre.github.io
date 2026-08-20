(() => {
  'use strict';

  const data = window.NOWEN_HELP;
  if (!data?.note) return;

  data.version = '2026.08.20-v4-note';

  const note = data.note;
  const bySlug = Object.fromEntries(note.articles.map(article => [article.slug, article]));

  // 将 Note 从“功能总览”继续拆成可直接检索的专题文档。
  note.groups = [
    { id: 'start', title: '快速上手', icon: '✨' },
    { id: 'write', title: '笔记、编辑器与知识管理', icon: '📝' },
    { id: 'productivity', title: '效率与 AI', icon: '⚡' },
    { id: 'collab', title: '协作、权限与发布', icon: '🤝' },
    { id: 'clients', title: '多端、部署与离线', icon: '🖥️' },
    { id: 'dataops', title: '数据、安全与恢复', icon: '🛡️' },
    { id: 'support', title: '迁移、排障与开放能力', icon: '🛠️' }
  ];

  if (bySlug.sharing) {
    bySlug.sharing.group = 'collab';
    bySlug.sharing.title = '协作、权限与分享总览';
    bySlug.sharing.summary = '先理解工作区、目录权限、外部分享与公开知识空间之间的关系。';
    bySlug.sharing.body = `
      <p>团队使用 Nowen Note 时，建议把权限理解成四层：<strong>工作区成员 → 目录级权限 → 实时协作 → 外部分享 / 公开知识空间</strong>。不要只依赖一个“成员角色”解决所有访问控制。</p>
      <div class="feature-grid">
        <div class="feature-card"><b>工作区</b><span>用于隔离团队内容、成员和功能范围。</span></div>
        <div class="feature-card"><b>目录级 ACL</b><span>通过继承、显式允许 / 拒绝和 Restricted 模式控制更细粒度范围。</span></div>
        <div class="feature-card"><b>实时协作</b><span>多人同时编辑时由协作层同步内容与状态。</span></div>
        <div class="feature-card"><b>分享与发布</b><span>面向工作区外部提供密码、有效期、评论或公开知识空间。</span></div>
      </div>
      <h2>推荐阅读顺序</h2>
      <ol class="steps">
        <li><b>先建立成员边界</b><span>阅读“工作区、成员与协作边界”。</span></li>
        <li><b>再配置目录权限</b><span>阅读“目录级 ACL、Restricted 与权限继承”。</span></li>
        <li><b>最后决定怎么对外发布</b><span>阅读“分享链接、评论与公开知识空间”。</span></li>
      </ol>
    `;
  }

  if (bySlug['backup-upgrade']) bySlug['backup-upgrade'].group = 'dataops';
  if (bySlug.security) bySlug.security.group = 'dataops';

  const additions = [
    {
      slug: 'offline-workspace', group: 'clients', title: '离线工作区与断网编辑',
      summary: '缓存完整工作区、正文与附件，断网继续工作，并理解恢复联网后的同步边界。',
      keywords: '离线 工作区 IndexedDB 断网 草稿 同步 冲突 附件 offline workspace', updated: '2026-08-20', time: '9 分钟',
      body: `
        <p>Nowen Note 的离线能力不是简单浏览器缓存。当前实现会围绕<strong>工作区、正文、草稿和附件</strong>保存本地副本，让你在网络中断时继续阅读和编辑，恢复网络后再继续增量同步。</p>
        <h2>离线前建议先做什么</h2>
        <ol class="steps"><li><b>让目标工作区完整加载一次</b><span>需要离线使用的笔记和附件应先在在线状态完成缓存。</span></li><li><b>确认当前保存状态</b><span>切换网络前不要让重要笔记停留在未确认保存状态。</span></li><li><b>重要附件先打开验证</b><span>离线附件依赖本地副本，未缓存的远程文件断网后无法临时下载。</span></li></ol>
        <h2>断网后可以做什么</h2>
        <ul><li>阅读已经缓存的工作区与笔记正文。</li><li>继续编辑并保留本地草稿 / 待同步修改。</li><li>在已缓存附件范围内继续查看内容。</li><li>网络恢复后继续处理增量同步。</li></ul>
        <h2>两台设备同时离线编辑同一篇怎么办？</h2>
        <p>这类场景存在真实冲突风险。恢复联网后不要急着删除“看起来重复”的内容；先核对两端正文和更新时间。系统会尽量避免误冲突与重复副本，但跨设备长期离线修改仍建议保留重要内容副本再处理。</p>
        <div class="callout danger"><strong>离线不是备份</strong><span>IndexedDB / 客户端缓存解决的是“暂时没网仍能工作”，不能替代完整 ZIP、NAS 快照或 WebDAV 等独立备份。</span></div>
      `
    },
    {
      slug: 'desktop-folder-sync', group: 'clients', title: '桌面端本地文件夹单向同步',
      summary: '把本地目录、NAS 挂载目录或同步盘单向导入 Nowen，并正确处理冲突、重命名与删除。',
      keywords: '桌面端 文件夹 同步 Electron NAS 挂载 单向 sync conflict nowenignore md txt html pdf docx', updated: '2026-08-20', time: '13 分钟',
      body: `
        <div class="callout info"><strong>先看方向</strong><span>同步始终是“本地文件夹 → Nowen”。Nowen 不会反向修改、删除或重命名你的本地源文件。</span></div>
        <h2>支持范围</h2>
        <table><thead><tr><th>类型</th><th>当前范围</th></tr></thead><tbody><tr><td>平台</td><td>Electron 桌面端</td></tr><tr><td>文本</td><td><code>.md</code>、<code>.markdown</code>、<code>.txt</code>、<code>.html</code>、<code>.htm</code></td></tr><tr><td>附件</td><td><code>.pdf</code>、<code>.docx</code></td></tr><tr><td>来源</td><td>本地目录、NAS 挂载目录、同步盘目录</td></tr></tbody></table>
        <h2>第一次配置</h2>
        <ol class="steps"><li><b>设置 → 本地文件夹同步</b><span>添加一个安全的同步根目录。</span></li><li><b>选择目标空间和笔记本</b><span>个人空间或你有写入权限的工作区。</span></li><li><b>配置文件类型和排除规则</b><span>支持 <code>*</code>、<code>**</code>、<code>?</code>，也可在根目录使用 <code>.nowenignore</code>。</span></li><li><b>选择冲突与删除策略</b><span>先用默认的“停止覆盖并提示”最安全。</span></li><li><b>先手动扫描</b><span>检查新增、变化、重命名、删除、冲突和错误后，再开启定时同步。</span></li></ol>
        <h2>Nowen 内已经手动改过同步笔记怎么办？</h2>
        <p>当前提供四类处理思路：停止覆盖并提示；保留 Nowen 副本后更新；始终由源文件覆盖；或保留 Nowen 编辑并停止跟踪。默认策略不会静默覆盖你在 Nowen 内的修改。</p>
        <h2>安全边界</h2>
        <ul><li>拒绝磁盘根目录、系统根目录和用户主目录作为同步根。</li><li>拒绝符号链接、目录联接和路径穿越。</li><li>默认单文件上限 50 MB，文本正文读取上限 2 MB。</li><li>单轮候选文件默认最多 10,000 个，重新读取总量默认 1 GB。</li></ul>
        <div class="callout tip"><strong>重命名通常不会生成重复笔记</strong><span>扫描会结合相对路径、SHA-256、大小等信息识别重命名，并继承原有映射。</span></div>
      `
    },
    {
      slug: 'workspace-members', group: 'collab', title: '工作区、成员与协作边界',
      summary: '创建团队空间、邀请成员，并理解个人空间与工作区的数据隔离。',
      keywords: '工作区 团队 邀请 成员 角色 workspace invite 个人空间 隔离', updated: '2026-08-20', time: '7 分钟',
      body: `
        <p>工作区是团队共享内容的边界，个人空间则属于用户自己的内容范围。切换工作区后，目录、笔记和相关协作能力会进入对应空间，不应该把个人空间和团队空间当成同一个数据池。</p>
        <h2>推荐的建立顺序</h2>
        <ol class="steps"><li><b>先创建工作区</b><span>名称应体现团队或项目边界。</span></li><li><b>建立一级目录</b><span>先确定公共资料、项目资料、受限资料等稳定结构。</span></li><li><b>再邀请成员</b><span>邀请前先想清楚默认访问范围，不要先全开放再逐个收权限。</span></li><li><b>最后配置目录级例外</b><span>敏感目录通过 ACL / Restricted 单独收紧。</span></li></ol>
        <h2>什么时候应该新建另一个工作区？</h2>
        <p>当成员范围、数据所有权或长期权限边界明显不同，例如“家庭”和“公司项目”，新工作区通常比在一个巨大空间里堆大量例外权限更容易维护。</p>
      `
    },
    {
      slug: 'acl-restricted', group: 'collab', title: '目录级 ACL、Restricted 与权限继承',
      summary: '用继承、显式允许 / 拒绝和受限模式控制团队目录访问。',
      keywords: 'ACL Restricted 权限继承 显式允许 拒绝 目录权限 工作区 permission deny allow', updated: '2026-08-20', time: '10 分钟',
      body: `
        <p>Nowen Note 当前权限体系支持工作区角色之外的<strong>目录级 ACL</strong>，并包含 Restricted 受限模式、显式允许 / 拒绝、权限继承和所有权转移等能力。</p>
        <h2>权限设计优先级</h2>
        <ol class="steps"><li><b>先确定默认边界</b><span>多数普通内容尽量依赖上级目录继承。</span></li><li><b>敏感目录再切 Restricted</b><span>把“默认可见”改成“只有明确允许的人可访问”。</span></li><li><b>少量例外用显式规则</b><span>避免每篇笔记都单独配置，长期很难审计。</span></li><li><b>定期从普通成员视角复查</b><span>管理员能看到不代表普通成员也能看到。</span></li></ol>
        <div class="callout danger"><strong>拒绝规则要谨慎</strong><span>复杂层级里显式拒绝容易造成“管理员以为继承开放，但成员实际无法访问”。修改后应使用目标账号真实验证。</span></div>
      `
    },
    {
      slug: 'public-knowledge-space', group: 'collab', title: '分享链接、访客评论与公开知识空间',
      summary: '把单篇内容或知识目录安全地发布给工作区外部用户。',
      keywords: '公开知识空间 分享链接 密码 有效期 评论 访客 PUBLIC_WEB_ORIGIN publish', updated: '2026-08-20', time: '9 分钟',
      body: `
        <p>对外发布有两种常见需求：临时分享一篇内容，或把一组目录长期作为公开知识空间。前者强调链接权限和有效期，后者更强调目录结构、公开来源和长期维护。</p>
        <h2>临时分享</h2>
        <ul><li>敏感内容建议设置访问密码。</li><li>临时协作建议设置有效期，到期自动失效。</li><li>只需要反馈时优先使用评论权限，不要直接给编辑权限。</li><li>不再需要时主动取消分享，而不是只依赖“别人应该不会再打开”。</li></ul>
        <h2>公开知识空间</h2>
        <p>公开发布前应专门整理目录，避免把团队内部说明、附件或受限子目录一起暴露。部署时还要确保公开访问来源配置正确，例如 <code>PUBLIC_WEB_ORIGIN</code> 与实际外部域名一致。</p>
        <div class="callout tip"><strong>发布前用无痕窗口验收</strong><span>不要只用管理员登录态检查公开页面；用未登录浏览器确认真正的访客可见范围。</span></div>
      `
    },
    {
      slug: 'object-storage', group: 'dataops', title: '附件对象存储：S3、R2 与 MinIO',
      summary: '把附件放到 S3 兼容对象存储，并理解配置、迁移和故障边界。',
      keywords: '对象存储 S3 Cloudflare R2 MinIO Bucket Endpoint Access Key Secret Key 附件', updated: '2026-08-20', time: '10 分钟',
      body: `
        <p>当 NAS 本地磁盘空间有限、附件规模较大，或需要独立对象存储时，可以把附件接入 AWS S3、Cloudflare R2、MinIO 或其他 S3 兼容服务。</p>
        <h2>配置前准备</h2>
        <ul><li>创建专用 Bucket，不要和其他应用混用同一个根目录策略。</li><li>创建只具备所需对象读写权限的专用凭据。</li><li>记录 Endpoint、Bucket、Region、Access Key、Secret Key。</li></ul>
        <h2>配置流程</h2>
        <ol class="steps"><li><b>进入对象存储设置</b><span>填写 Endpoint、Bucket、密钥和 Region。</span></li><li><b>先测试连接</b><span>不要在连接失败时直接迁移已有附件。</span></li><li><b>上传一个测试图片</b><span>确认编辑器、预览、下载链路都正常。</span></li><li><b>再考虑迁移旧附件</b><span>迁移前保留完整备份，并抽查历史笔记。</span></li></ol>
        <h2>Cloudflare R2</h2>
        <p>R2 使用 S3 兼容 API，Endpoint 常见形式为 <code>https://&lt;account-id&gt;.r2.cloudflarestorage.com</code>。凭据应使用专用 Object Read &amp; Write Token，而不是账号级高权限密钥。</p>
      `
    },
    {
      slug: 'version-trash-recovery', group: 'dataops', title: '自动保存、版本历史与回收站恢复',
      summary: '误改、误删或快速切换笔记后，按正确顺序找回内容。',
      keywords: '自动保存 版本历史 回收站 恢复 误删 误改 Yjs 草稿 restore version history', updated: '2026-08-20', time: '8 分钟',
      body: `
        <p>Nowen Note 的数据保护不是单一“自动保存”。当前保存链路还包含持久化确认、草稿恢复、版本历史与回收站等多层保护。</p>
        <h2>误改内容</h2>
        <ol class="steps"><li><b>先停止继续编辑</b><span>避免新的自动保存继续覆盖更多上下文。</span></li><li><b>查看版本历史</b><span>先对比旧版本，确认目标内容。</span></li><li><b>恢复或手工复制需要的段落</b><span>重要恢复操作后再确认保存状态。</span></li></ol>
        <h2>误删笔记</h2>
        <p>优先进入回收站恢复。只有确认无用后才执行永久删除；回收站不适合作为长期归档目录。</p>
        <h2>客户端崩溃或突然断网</h2>
        <p>重新打开时先检查当前笔记、草稿恢复和同步状态，不要第一时间创建同名新笔记，以免人为制造重复内容。</p>
      `
    },
    {
      slug: 'backup-restore-drill', group: 'dataops', title: '完整备份、恢复与恢复演练',
      summary: '不仅“生成一个 ZIP”，还要验证数据库、附件和远程备份真的能够恢复。',
      keywords: '完整备份 ZIP 恢复 演练 WebDAV 邮件 SMTP BACKUP_DIR 数据库 附件 restore drill', updated: '2026-08-20', time: '11 分钟',
      body: `
        <p>Nowen Note 当前支持本地自动备份、后台完整 ZIP、流式归档与校验、邮件备份和凭据加密的 WebDAV 远程备份。真正可靠的备份必须经过恢复验证。</p>
        <h2>备份至少包含什么</h2>
        <ul><li>数据库与账号 / 权限数据。</li><li>本地附件和必要运行数据。</li><li>如果使用对象存储，明确对象数据是否有独立备份策略。</li><li>部署配置中那些无法从数据库重新推导的关键参数。</li></ul>
        <h2>推荐恢复演练</h2>
        <ol class="steps"><li><b>创建最新完整备份</b><span>记录生成时间和文件大小。</span></li><li><b>在非生产环境恢复</b><span>不要拿唯一生产实例做第一次恢复实验。</span></li><li><b>抽查不同类型数据</b><span>笔记正文、图片、视频、普通附件、工作区和权限。</span></li><li><b>记录恢复耗时和失败点</b><span>大数据量用户尤其要验证流式恢复和磁盘空间。</span></li></ol>
        <div class="callout danger"><strong>只备份数据库不完整</strong><span>如果附件在本地文件系统，只保存数据库无法恢复图片和普通附件。</span></div>
      `
    },
    {
      slug: 'attachment-diagnostics', group: 'dataops', title: '图片、视频与附件加载失败排查',
      summary: '从文件是否存在、签名地址、对象存储、权限与客户端网络逐层排查。',
      keywords: '图片加载失败 视频加载失败 附件 裂图 签名地址 S3 R2 权限 403 404 diagnostics', updated: '2026-08-20', time: '10 分钟',
      body: `
        <h2>第一步：确认是“文件丢了”还是“访问不到”</h2>
        <ul><li>同一附件在 Web 与桌面端都失败：优先查服务端文件 / 对象存储。</li><li>Web 正常、客户端失败：优先查客户端服务器地址、证书、缓存和签名请求。</li><li>只有某个用户失败：优先查工作区 / 附件权限。</li><li>旧图片失败、新上传正常：重点查历史附件路径或迁移问题。</li></ul>
        <h2>第二步：看请求结果</h2>
        <table><thead><tr><th>现象</th><th>优先方向</th></tr></thead><tbody><tr><td>404</td><td>文件路径、迁移、历史附件是否仍存在</td></tr><tr><td>401 / 403</td><td>登录态、工作区权限、分享权限、签名地址</td></tr><tr><td>超时</td><td>对象存储、NAS 网络、反向代理</td></tr><tr><td>浏览器正常但 App 异常</td><td>客户端缓存、证书、WebView 网络环境</td></tr></tbody></table>
        <div class="callout danger"><strong>问题未定位前不要清理孤儿附件</strong><span>如果引用识别或历史数据存在异常，清理会把“暂时无法识别引用”变成真正的数据删除。</span></div>
      `
    },
    {
      slug: 'siyuan-obsidian-migration', group: 'support', title: '从思源 / Obsidian 迁移：先小样本再全量',
      summary: '用代表性样本验证目录、图片、脚注、嵌入与附件，再执行大规模迁移。',
      keywords: '思源 SiYuan Obsidian 迁移 导入 Markdown ZIP 附件 图片 脚注 嵌入 migration', updated: '2026-08-20', time: '10 分钟',
      body: `
        <p>复杂知识库迁移的目标不是“任务显示成功”，而是迁移后目录、正文、图片、附件和扩展语法都可长期使用。</p>
        <h2>先做 10～20 篇代表性样本</h2>
        <ul><li>纯文本短笔记。</li><li>含多层目录和中文文件名的笔记。</li><li>含本地图片、远程图片和普通附件的笔记。</li><li>含表格、代码块、脚注、公式、Mermaid 的技术笔记。</li><li>含双链、嵌入块或来源工具特有语法的复杂笔记。</li></ul>
        <h2>验收顺序</h2>
        <ol class="steps"><li><b>先看目录结构</b><span>父子层级和标题是否正确。</span></li><li><b>再看正文</b><span>重点抽查复杂格式和长文。</span></li><li><b>再看媒体</b><span>确认图片已本地化或引用仍可访问。</span></li><li><b>最后看导出</b><span>用 Markdown / ZIP 再导出一篇，确认迁入后仍具备可迁移性。</span></li></ol>
        <div class="callout tip"><strong>保留原始库一段时间</strong><span>完成全量迁移后不要立即删除原始思源 / Obsidian 数据，至少等抽查和日常使用稳定后再归档。</span></div>
      `
    },
    {
      slug: 'batch-organize', group: 'write', title: '批量管理、移动与 AI 辅助整理',
      summary: '多选笔记后批量移动、删除或辅助分类，减少逐篇整理成本。',
      keywords: '批量管理 多选 移动 删除 AI 批量标签 归类 batch organize', updated: '2026-08-20', time: '6 分钟',
      body: `
        <p>当你已经积累大量笔记时，逐篇移动和打标签的成本会很高。批量管理适合做一次性整理，但越是批量操作越要保留可恢复空间。</p>
        <h2>推荐工作流</h2>
        <ol class="steps"><li><b>先用搜索 / 目录缩小范围</b><span>避免在“所有笔记”直接大范围误选。</span></li><li><b>多选并先移动</b><span>结构调整通常比直接删除更安全。</span></li><li><b>需要时用 AI 建议标签 / 归类</b><span>AI 结果先抽查，再应用到大量内容。</span></li><li><b>批量删除后检查回收站</b><span>确认没有误选再考虑永久清理。</span></li></ol>
      `
    },
    {
      slug: 'advanced-content-blocks', group: 'write', title: '表格、代码、KaTeX、Mermaid 与高级内容块',
      summary: '复杂技术文档的高级内容块使用与导出检查清单。',
      keywords: '高级内容块 表格 代码块 KaTeX Mermaid 脚注 Callout 数学公式 导出', updated: '2026-08-20', time: '8 分钟',
      body: `
        <p>富文本与 Markdown 都可以承载复杂技术内容，但高级块在跨格式转换、图片导出和外部迁移时更值得单独检查。</p>
        <h2>常见高级块</h2>
        <table><thead><tr><th>内容</th><th>使用建议</th></tr></thead><tbody><tr><td>表格</td><td>避免把超宽表格当数据库使用，移动端阅读前检查横向布局。</td></tr><tr><td>代码块</td><td>明确语言类型，长代码优先引用仓库而非把整个文件粘进笔记。</td></tr><tr><td>KaTeX</td><td>复杂公式在导出前做一次预览。</td></tr><tr><td>Mermaid</td><td>图片导出前确认图表已完成渲染。</td></tr><tr><td>脚注 / Callout</td><td>跨 Markdown 工具迁移时抽查语法兼容。</td></tr></tbody></table>
      `
    },
    {
      slug: 'sync-troubleshooting', group: 'support', title: '多端同步、冲突副本与客户端异常排查',
      summary: '把“同步不对”拆成服务器、账号、工作区、离线队列和客户端五层检查。',
      keywords: '同步 冲突副本 客户端 切换笔记 离线队列 WebSocket workspace sync conflict desktop android', updated: '2026-08-20', time: '11 分钟',
      body: `
        <h2>先确认是不是连到了同一套数据</h2>
        <ol class="steps"><li><b>服务器地址</b><span>Web、桌面、Android 是否指向同一个 Nowen Note 实例。</span></li><li><b>账号</b><span>是否登录了同一个用户。</span></li><li><b>工作区</b><span>当前是否位于同一个个人空间 / 团队工作区。</span></li><li><b>网络</b><span>是否有一端长时间离线，存在待同步修改。</span></li></ol>
        <h2>出现冲突副本怎么办？</h2>
        <p>先比较两份内容，不要直接凭标题或更新时间判断哪份应该删除。把独有段落合并到目标笔记，确认所有设备重新同步正常后，再处理多余副本。</p>
        <h2>浏览器正常、桌面或手机异常</h2>
        <p>优先检查客户端缓存、WebView / Electron 网络环境、HTTPS 证书和完整服务器 URL。客户端日志与服务端日志应结合看，不要只在 UI 上反复重试登录。</p>
      `
    }
  ];

  additions.forEach(article => {
    if (!bySlug[article.slug]) {
      note.articles.push(article);
      bySlug[article.slug] = article;
    }
  });

  note.popular = [
    'quick-start', 'first-note', 'offline-workspace', 'desktop-folder-sync',
    'acl-restricted', 'object-storage', 'backup-restore-drill', 'attachment-diagnostics'
  ];
})();

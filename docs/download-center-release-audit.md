# 官网下载中心 · 正式发布与开发状态审计

核对日期：2026-10-15。网站源仓库 cropflre/cropflre.github.io 的 master 为 GitHub Pages 正式部署分支。应用 cropflre/nowen-note 的 release/v1.5.2 是开发分支，不是正式下载数据源。

## 最新正式发布

GitHub Releases API 核验结果：**v1.5.1**，2026-10-08T16:17:56Z，非 draft、非 prerelease。逐项大小与官方下载 URL 写入 assets/data/nowen-note-stable.json，禁止按版本拼造 URL。

| 平台 | 核实的附件类型 | 状态与展示 |
| --- | --- | --- |
| Windows | setup.exe、portable.exe | 已正式发布；推荐安装版 |
| macOS | arm64.dmg、x64.dmg | 已正式发布；必须让用户自行选芯片 |
| Linux | x86_64.AppImage、amd64.deb | 已正式发布；类型分列 |
| Linux Lite | Lite 的 AppImage 和 DEB | 已正式发布；在其他选项中单列 |
| Android | Nowen-Note-1.5.1.apk | 已正式发布；不使用 QA / debug 包 |
| 浏览器扩展 | nowen-clipper-0.5.0.zip | 正式 GitHub ZIP 0.5.0；Chrome Web Store 的当前版本另查 |
| 飞牛 fnOS | nowen-note-1.5.1.fpk | 已正式发布；主要适配 x86-64 |
| 绿联 UGOS | 没有 .upk 正式附件 | 安装包暂未提供；展示 Docker 部署 |
| Docker 与其他 NAS | cropflre/nowen-note 镜像 + 官方 Compose | 已有部署方式；不是 Release 附件 |
| iOS / HarmonyOS | 没有正式安装附件 | 项目工程存在，不代表可下载安装 |

自动排除 blockmap、latest*.yml 和其他更新元数据。GitHub API 失败时读取已经核对的本地快照并给出提示，不能把请求失败误写成平台不支持。

## 分支功能状态核对

| 功能 | 源码 / 验收资料 | 官网状态 |
| --- | --- | --- |
| Markdown、富文本、知识树、AI 辅助写作 | README、docs/tutorials/editor-markdown.md、docs/screenshots/desktop-ai-writing.png | v1.5.1 已发布；配真实截图 |
| 桌面本地模式、Android、Docker 自托管 | README、docker-compose.yml、.github/workflows/release.yml | 有正式发行渠道，但各平台边界需说明 |
| 离线工作区、多端同步 | README、docs/qa/v1.5.2/android-acceptance-matrix.md | 正式版存在相关功能；不承诺三端实时无冲突 |
| AI 智能生成任务 | backend/src/routes/ai-task-plan.ts、backend/src/services/task-composer.ts、docs/qa/ai-task-composer-p0.md | v1.5.2 开发候选，不能标已发布 |
| 每日任务完成汇总、任务归档、任务转笔记 | backend/src/routes/task-digest.ts、任务生命周期代码与相关开发记录 | 需逐项对照代码、回归及正式包；暂只作为开发中方向 |
| 文件管理、附件分类、标签筛选 | docs/tutorials/file-manager.md、backend/tests/file-manager-organization.test.ts | 基础能力可介绍；新的交互增强仍需验收 |
| TXT 笔记、循环删除修复 | docs/tutorials/editor-plaintext.md、docs/qa/artifacts/task-recurrence-deletion | 分支材料不足以确认所有平台正式可用；不提前宣传 |
| 数据保护、备份恢复、NAS HTTPS | README、docker-compose.yml、docker-compose.https.yml | 正式版有基础能力，必须提示先备份再升级 |
| Android v1.5.2 完整验收 | docs/qa/v1.5.2/stage3/android-status.md | **PARTIAL / NOT_EXECUTED**，不可标全部 PASS |

v1.5.2 阶段三 Android 确有独立 QA APK 的 Native/API Bridge 真机证据，但不是完整生产 APK 的 GUI、多端联动、WAN、附件、升级矩阵。不能把“代码合并”“测试通过”“安装成功”三者混同。

## 风险、事实基线和维护

- 发布状态由正式 Releases API 决定。动态下载列表同一版本内取附件；新版本如果缺某平台包，不跨版本借旧链接。
- 回退清单经人工核对后维护。正式发布新版本后更新 assets/data/nowen-note-stable.json；商店版号与 GitHub ZIP 可能不同，不能混写。
- Docker 示例来自应用仓库 Compose：官方镜像 cropflre/nowen-note，内部端口 3001，持久化根目录 /app/data。首次安装需改默认密码，公网需 HTTPS，升级需备份数据库与附件。
- 旧 tutorials 文档可能带旧版本尾注。安装命令优先以 README、实际 Compose 和正式 tag 核对。
- 官网 master 部署工作流不变。PR 需通过自动化，之后仍须人工验证 Edge、Android 和 iPhone Safari 的真实下载与安装行为，以及 Lighthouse。

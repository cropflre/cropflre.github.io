# 官网下载中心 · v1.5.2 正式版审计

核对日期：2026-10-16。Nowen Note 的 GitHub Release [v1.5.2](https://github.com/cropflre/nowen-note/releases/tag/v1.5.2) 已公开发布（`draft=false`、`prerelease=false`），发布时间 `2026-10-16T15:05:51Z`。官网由 `cropflre/cropflre.github.io` 的 `master` 分支部署。

## 已验证正式附件

| 平台 | v1.5.2 实际附件 | 下载中心 |
| --- | --- | --- |
| Windows | `Nowen-Note-1.5.2-setup.exe` / `portable.exe` | 安装版优先；便携版折叠 |
| macOS | `Nowen-Note-1.5.2-arm64.dmg` / `x64.dmg`（另有 ZIP） | 按芯片分开，不凭 UA 猜架构 |
| Linux | `amd64.deb` / `x86_64.AppImage` | 正式版与 Lite 分开 |
| Android | `Nowen-Note-1.5.2.apk` | 仅正式 APK |
| 浏览器插件 | `nowen-clipper-0.5.0.zip` | 商店版版本以商店为准，不写成 1.5.2 |
| 飞牛 fnOS | `nowen-note-1.5.2.fpk` | 按设备兼容性安装 |
| 绿联 UGOS | 无 `.upk` | 不伪造安装链接，提供 Docker |
| Docker/NAS | 镜像、Docker Compose | 不属于 Release 附件；强调持久化、备份和 HTTPS |
| iOS / HarmonyOS | 无正式直接下载的安装包 | 仅说明工程状态 |

下载回退快照来自 GitHub Release 的真实附件名称、字节数和下载 URL：`assets/data/nowen-note-stable.json`。动态下载使用 `assets/js/note-release-v1.js` 验证 GitHub 最新正式 Release，过滤 blockmap、更新 YAML 等元数据。API 不可用时回退到核实的本地清单；不能跨版本混用附件。旧缓存若比新正式回退清单更旧，应优先使用新清单。

## v1.5.2 官网宣传边界

- **文件中心**：导航、标签、智能文件夹、文件回收站、个人文件夹同步、AI 基于元数据的整理和语义搜索。AI 整理需用户确认，不把文件字节或笔记正文宣称为输入。
- **MCP**：Personal API Token 范围内操作知识树、个人任务与文件；高风险操作要明确授权、预览确认、版本校验。HTTP 接入仅可选本机回环，要求认证。
- **任务**：AI 任务创建需确认，支持今日完成清单、任务归档、详情存笔记和 Excel / Markdown 导出。
- **编辑与同步**：单篇同步回执、离线目录保护、纯文本笔记、中文排版、Mermaid 和 Markdown 修复。不承诺任何 Android、NAS 或网络组合都不存在冲突。
- **发布渠道**：GitHub EXE 可能未签名；macOS 首次打开受系统安全检查限制；Microsoft Store 打包适配不意味着已经上架。
- **升级安全**：升级前备份 SQLite、附件、部署配置；回滚应用 / Docker 镜像不会回滚持久化数据库。

产品截图使用 v1.5.2 标签下存在的 `docs/screenshots/` 文件；没有经过核实的新功能截图时使用中性占位，不伪称截图。官网首页、产品、功能、版本和静态 SEO 页面都统一按 v1.5.2 正式版描述。

## 维护说明

- 新的正式 Release 发布后，从 GitHub API 重新生成并核对离线清单，不手拼 URL。
- CI 浏览器测试用于官网体验回归，不代表所有 Android 真机或 NAS 多端同步验收完成。
- `.github/workflows/pages.yml` 不变；发布后复核旧教程路由、响应式、下载状态及站点缓存。

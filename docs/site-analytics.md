# NOWEN 官网自建访问统计部署指南

只统计 nowen.cn 官网，与 Nowen Note 用户账号、笔记和 NAS 数据无关。生产网站仍通过 master 的 GitHub Pages 部署。**Worker 未部署并实测前，不要合并本 PR。**

## 数据与统计口径

- PV：页面初次打开和站内 #/ 路由切换；相同浏览器同一路径 30 秒内刷新去重。
- UV：累计独立浏览器标识，不等同真实自然人数。前端 localStorage 创建随机 128-bit 标识；D1 只保存 SHA-256 散列。清缓存/换设备会视为新访客。
- D1 存聚合 PV/UV、访客标识的 SHA-256、首次/最近计数时间和最近页面路由；不保存原始 IP、UA、笔记内容和 URL 查询参数。Cloudflare 可能另有基础设施日志。
- 不蒜子历史数字不会自动迁移。新计数从零起，不伪造统计。
- API 未配置或不可用时，隐藏统计区域；不影响官网和备案号。
- CORS/Origin 校验不是抗伪造机制，流量异常时另外在 Cloudflare 配 WAF / Rate Limiting。

## 部署 Workers + D1

在仓库根目录进入 workers/site-stats，准备 Node.js 22+ 和 Cloudflare 账号。

1. cd workers/site-stats
2. npx wrangler login
3. npx wrangler d1 create nowen-site-stats
4. 把输出的真实 database_id 填入 wrangler.jsonc，替换 REPLACE_WITH_D1_DATABASE_ID。
5. npx wrangler d1 migrations apply nowen-site-stats --remote
6. npx wrangler deploy
7. 打开部署返回的 HTTPS workers.dev 地址加 /api/stats，检查返回真实 JSON，如 {"pv":0,"uv":0}。
8. 将官网 assets/js/site-visits-config.js 的 apiBaseUrl 设置为上述 Worker HTTPS **根地址**（不附加 /api/stats）。
9. 在 nowen.cn 打开开发者工具 Network，确认 OPTIONS /api/visit 状态 204、POST 为 200，页脚展示 PV/UV。导航 #/note 和 #/reader 测试页面切换。

注意：生产环境不应使用假的 visitorId 调用 POST，以免污染数据。部署密钥和 Cloudflare API Token 不可提交到 GitHub。apiBaseUrl 和 Web Analytics site beacon token 是公开前端配置，不是私密令牌。

## 可选 Cloudflare Web Analytics 后台

在 Cloudflare Dashboard → Web Analytics → Add a site 添加 nowen.cn，复制 Manage site 提供的 32 位 Beacon Token。
当 Cloudflare 没有对 nowen.cn 自动注入 Beacon 时，把此 token 填入 assets/js/site-visits-config.js 的 cloudflareWebAnalyticsToken。前端以 spa:true 模式加载 Cloudflare Beacon。
如域名已通过 Cloudflare 自动注入，请将该配置留空，避免重复加载。Dashboard 统计与 D1 计数口径不保证一致，Web Analytics 不直接驱动页脚。

## 验收、回滚和维护

- node --check assets/js/site-visits.js
- node --check workers/site-stats/src/index.mjs
- node --test tests/site-visits.test.cjs tests/site-stats-worker.test.mjs tests/icp-footer.test.cjs
- 检查主站、/note/、/download/、/privacy/ 和 /privacy/en/ 的深链接、移动端、断网和网络失败场景。
- 回滚只需清空配置文件的 apiBaseUrl 与 cloudflareWebAnalyticsToken 并重新发布官网；D1 数据不会被删除。
- 定期使用 Wrangler D1 export 备份数据，**禁止将真实访客数据提交到公开仓库**。
- 站点隐私披露位于 /site-analytics/；/privacy/ 只适用于 Windows 桌面应用。

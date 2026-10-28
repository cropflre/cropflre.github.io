# 使用 GitHub Actions 云端部署 NOWEN Worker

适用问题：Mac 上 `npx wrangler deploy` 反复报 `fetch failed` / TLS 连接断开。

## 为何需要单独工作流 PR？

GitHub 要求 `workflow_dispatch` 的工作流文件先存在于默认分支 `master`，Actions 才能显示 `Run workflow`。
因此请先独立审核并合并只包含本工作流与文档的 PR；不会自动部署 Worker，不会将留言板 PR #19 发布到官网。

## 1. 在 Cloudflare 创建专用 API Token

- Cloudflare Dashboard → Profile → API Tokens → Create Token，选择 **Edit Cloudflare Workers** 模板；限制在你的 NOWEN 账号，不授予无关账号。
- 若运行时 D1 预检查无权访问，还需要添加 **Account → D1 → Edit**（或适当的 D1 权限）。若 Token 模板无法覆盖对应 D1，创建具有 Workers Scripts/Edit 和 D1/Edit 权限的自定义 Token。
- 只在 GitHub 仓库的 **Settings → Secrets and variables → Actions → New repository secret** 添加：
  - `CLOUDFLARE_API_TOKEN`：新生成的 Cloudflare API Token。
  - `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Dashboard 中 NOWEN 所在账号的 Account ID。

绝不能提交 API Token 到 GitHub 文件、Issues、PR 评论，或发给聊天助手。**不要在这两个 GitHub Secrets 中填入 Turnstile Secret 或留言板管理员 Token**：后两者已通过 Wrangler Secret 保存到 Cloudflare Worker 上。

## 2. 先核对 D1

打开 Cloudflare D1 → `nowen-site-stats` → Console，执行：

    SELECT name FROM sqlite_master WHERE type='table' AND name='guestbook_messages';

若为空，先执行 `workers/site-stats/migrations/0002_guestbook.sql` 中两个幂等 CREATE 语句，**不要重置原有 `site_counters`/`site_visitors`**。部署工作流会先检查两个表是否存在；未建表则自动停止，不上传新 Worker。

## 3. 从 GitHub 手动部署

1. 合并只包含工作流和文档的独立 PR（不合并留言板 PR #19）。
2. 打开仓库 `cropflre/cropflre.github.io` → Actions → `Deploy NOWEN Worker (manual)` → `Run workflow`。
3. Branch 选择 `master`，`source_ref` 选择 `feat/nowen-guestbook-v1`，`confirmation` 输入 `DEPLOY`。
4. 运行将从**指定的功能分支**检出代码，测试、检查远程数据库表，更新既有 `nowen-site-stats` Worker。
5. 同一工作流最终只读检查 `/api/stats` 和 `/api/guestbook/messages`。成功后不需要一直开着 Mac。

## 安全边界

- 这是手动工作流，只响应 `workflow_dispatch`，不会在 push/PR 自动部署生产 Worker。
- 代码来源限定 `feat/nowen-guestbook-v1` 或 `master` 两个可见选项，防止误选其它仓库或任意 ref。
- Cloudflare Worker Secrets（`TURNSTILE_SECRET_KEY`、`GUESTBOOK_ADMIN_TOKEN`）需先在 Cloudflare 控制台正确配置；`wrangler deploy` 不会删除现存的 Secret。
- 自动部署只更新 Worker 代码与已有 D1 绑定；**不会自动执行数据库迁移**，并会在 D1 表不存在时阻止部署。
- 不在成功前合并 PR #19，以免官网过早开放尚不可用的留言入口。

## 如果部署失败

- Credentials check 失败：检查两个 GitHub Actions Repository Secrets 的**名称**，不要把 Token 放进变量名。
- D1 preflight 失败：检查 D1 迁移、数据库 ID，或 Cloudflare Token 是否拥有 D1 Edit 权限。
- Wrangler deploy 失败：查看 GitHub Actions 日志，检查 API Token 是否有 Workers Scripts Edit 权限。
- 成功部署但 `/api/guestbook/messages` 404：检查 Workflow 的 `source_ref` 是否选了 `feat/nowen-guestbook-v1`。
- Worker 更新前 Cloudflare 控制台提示配置不同：本仓库 wrangler.jsonc 仍是 D1 绑定来源，不能从控制台删库；Deploy 前检查代码 diff 与 Secret 是否正确。

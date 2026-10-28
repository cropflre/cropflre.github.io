# NOWEN 官网留言板部署指南

原有 GitHub Pages / Cloudflare Workers / D1 不迁移。本功能上线前必须配置 Turnstile、两个 Worker Secrets 并执行 D1 迁移；否则留言提交默认关闭。请勿把密钥放进仓库或聊天。

## 功能及安全边界

- 独立页面 /guestbook/；昵称选填、留言 3–500 字，无账号提交；所有留言默认 pending，只有 approved 才公开。
- /guestbook/admin/ 可在管理员验证后审核、回复、拒绝、永久删除；Token 只保存在浏览器当前页面内存。
- 必须后端 Siteverify 校验 Turnstile Token、hostname（nowen.cn 或 www.nowen.cn）、action=guestbook_submit。
- Workers 原生 Rate Limiting（5 次/60 秒/IP，按节点近似限流），外加蜜罐、Origin、请求体/长度校验。恶意流量可能仍需 WAF。
- D1 仅存留言 ID、昵称、正文、状态、公开回复和时间；不保存原始 IP 或邮箱。管理员密钥放 Wrangler Secret，不存浏览器 storage。

## A. 在 Cloudflare 创建 Turnstile

Dashboard → Turnstile → Add widget；名称 nowen-guestbook，允许 Hostnames: nowen.cn，按需加入 www.nowen.cn。

获得 Site Key（公开）和 Secret Key（私密）。Site Key 填到 assets/js/guestbook-config.js 的 turnstileSiteKey。**`wrangler secret put` 后面是变量名 `TURNSTILE_SECRET_KEY`，不能直接填写以 `0x` 开头的 Key。只有出现 `Enter a secret value` 时才粘贴私密 Secret Key**：

    cd cropflre.github.io/workers/site-stats
    npx wrangler secret put TURNSTILE_SECRET_KEY

另在本地终端生成独立的强随机管理员密钥，自己存进密码管理器，粘贴到 Wrangler 的 Secret 输入：

    openssl rand -hex 32
    npx wrangler secret put GUESTBOOK_ADMIN_TOKEN

**不要把 Turnstile Secret Key / 管理员 Token 粘贴到 ChatGPT、GitHub、网页配置或日志。**

## B. D1 迁移和 Worker 部署

    cd cropflre.github.io
    git fetch origin
    git switch feat/nowen-guestbook-v1
    cd workers/site-stats
    npx wrangler d1 migrations apply nowen-site-stats --remote
    npx wrangler deploy

新增 migrations/0002_guestbook.sql，创建独立 guestbook_messages 表，不修改计数表。旧 0001 的 IF NOT EXISTS / INSERT OR IGNORE 不会清空 PV/UV。
如果 Wrangler 报 `fetch failed` 或 `Client network socket disconnected before secure TLS connection was established`，不要删除 D1 或重建已有的 PV/UV 计数表。可在 Cloudflare Dashboard → D1 → `nowen-site-stats` → 控制台，只执行 `migrations/0002_guestbook.sql` 的两个 `CREATE ... IF NOT EXISTS` 语句。再运行 `SELECT name FROM sqlite_master WHERE type='table' AND name='guestbook_messages';` 核验。手工执行不会自动登记到 Wrangler 的 `d1_migrations` 表，之后重试幂等迁移时需再次核对状态。

如误执行 `wrangler secret put 0x4AAAA...`，只会创建错误命名的 Worker Secret，不会绑定到 `env.TURNSTILE_SECRET_KEY`。先在 `npx wrangler secret list` 核对，再到 Cloudflare Worker → Settings → Variables and Secrets 删除错误变量，随后用正确名称上传 Secret。如果私密 Key 已公开在聊天、日志或仓库中，请在 Turnstile Widget → Settings → Rotate Secret Key 轮换；Cloudflare 默认轮换存在约两小时的旧密钥有效期。

验证现有 /api/stats 仍返回 PV/UV，新的 GET /api/guestbook/messages 返回包含 items 的 JSON。

## C. 验收

1. 先部署 Worker、配置 Site Key，再审核合并官网 PR，不可省略云端实际验证。
2. 进入 nowen.cn/guestbook/ 完成 Turnstile 并提交一条测试留言；公开列表不能立即展示。
3. 用私密管理员密钥进入 nowen.cn/guestbook/admin/，核对待审核队列、通过留言并回复。
4. 回访公开留言页确认官方回复；删除测试留言，再确认不出现。
5. 验证深浅色/移动端/键盘、无验证码拒绝提交、限流 429、未授权 401、原 PV/UV 仍工作。

## 回滚与故障

- not_configured 503：检查 Secret、Rate Limiter、D1 表和绑定是否存在。
- verification_failed 403：核对 Site Key / Secret 是否配对、Hostname、action、Token 是否失效。
- rate_limited 429：流量超过 Worker 配置阈值；无须关闭安全校验。
- unauthorized 401：管理员密钥无效或未配置，使用 Wrangler secret put 轮换。
- 暂停提交：将公开 turnstileSiteKey 置空，并考虑移除 TURNSTILE_SECRET_KEY 阻止直接 POST。
- 现有计数和留言分别存储，不要清空或删 D1 数据库。

## 本地验证

    node --check workers/site-stats/src/guestbook.mjs
    node --test tests/guestbook-worker.test.mjs tests/guestbook-static.test.cjs

网站默认不在 localhost 使用生产 Turnstile；CI 模拟验证不等于 Cloudflare 线上验收。留言及相关隐私说明见 /guestbook/privacy/。

# 旧官网留言板已迁移至弄文社区（2026-10-29）

**现行反馈地址： https://community.nowen.cn/**

- 顶部导航移除「留言板」；旧 `/guestbook/` 页面跳转到弄文社区，停止展示原来的公开留言表单。
- 旧 D1 `guestbook_messages` 表、历史回复与 PV/UV 访问统计均保留，未执行任何数据删除。
- 旧 `/guestbook/admin/` 管理页保留，以便处理历史留言、删除请求。
- 旧 `/guestbook/privacy/` 保留原数据隐私说明及删除申请途径。
- Cloudflare `nowen-site-stats` Worker 的历史 Guestbook API 暂未停用。本次仅修改官网静态页面，不等于旧 POST 接口关闭。要彻底禁用 API 写入，需单独审计和部署 Worker，不能影响 PV/UV 统计。

## 验证

```bash
node --test tests/community-entry.test.cjs tests/guestbook-static.test.cjs
node --test --test-concurrency=1 tests/guestbook-browser.test.cjs
```

其他历史部署说明可通过 Git 提交历史查看。

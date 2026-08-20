# Nowen 帮助中心

> Nowen 系列产品统一使用教程、部署指南与问题排查入口。

[![GitHub Pages](https://img.shields.io/badge/Live-cropflre.github.io-6658f5?style=flat-square&logo=github)](https://cropflre.github.io/)

当前已接入：

- 📓 **Nowen Note（弄文笔记）** — 40 篇教程，覆盖知识管理、离线、桌面文件夹同步、协作权限、对象存储、备份恢复、迁移、排障与官方社区
- 📖 **Nowen Reader** — 15 篇漫画 / 小说、书库、阅读器、AI、OPDS、Flutter 与 NAS 教程
- 🎬 **Nowen Video** — 已预留产品入口
- 🔖 **NOWEN 书签** — 已预留产品入口

## 帮助中心能力

- 多产品教程路由与统一导航
- 跨产品全文搜索，支持标题 / 关键词 / 正文
- 搜索关键词高亮与键盘 ↑ / ↓ / Enter 导航
- `Ctrl/Cmd + K`、`/` 快捷聚焦搜索
- 最近浏览记录
- 相关文章 / “你可能还需要”推荐
- 左侧分组目录 + 右侧页内目录
- 可折叠 FAQ
- 教程图片灯箱预览
- Nowen Note 微信公众号与 QQ 群社区入口
- QQ 群号一键复制、公众号二维码弹窗
- 深色 / 浅色模式
- 桌面端、平板和手机响应式布局
- GitHub Issues 反馈与仓库文档跳转

## 项目结构

```text
cropflre.github.io/
├── index.html
├── assets/
│   ├── css/
│   │   ├── help-v2.css                 # 帮助中心基础 Design System
│   │   ├── help-v3.css                 # 搜索、最近浏览、FAQ、灯箱等增强样式
│   │   └── help-community-v5.css       # 公众号 / QQ 群社区模块
│   ├── js/
│   │   ├── help-data-v2.js             # Nowen Note 基础教程数据
│   │   ├── help-reader-v3.js           # Nowen Reader 教程数据 + 通用产品元数据
│   │   ├── help-note-v4.js             # Nowen Note 深度专题与分类扩展
│   │   ├── help-community-v5.js        # Nowen Note 官方社区数据与社区教程
│   │   ├── help-app-v3.js              # 通用多产品路由、搜索与渲染引擎
│   │   └── help-community-ui-v5.js     # 首页 / 产品页 / 文章底部社区 UI
│   └── help/
│       └── note/                        # Nowen Note 教程示意图资源
├── posts/                               # 历史项目介绍文章，继续保留
├── 404.html
└── .nojekyll
```

## Nowen Note 文档结构

V4 将 Note 从宽泛功能总览继续拆成 7 个可直接检索的文档分类：

```text
快速上手
笔记、编辑器与知识管理
效率与 AI
协作、权限与发布
多端、部署与离线
数据、安全与恢复
迁移、排障与开放能力
```

`help-data-v2.js` 保留首批稳定教程；`help-note-v4.js` 负责深度专题与分类重组；`help-community-v5.js` 负责官方公众号、QQ 群及社区反馈专题。这样后续继续补充 Note 内容时，不需要重写历史数据文件。

## 官方社区信息

Nowen Note 社区信息以真实产品仓库为依据：

- 微信公众号：**Nowen 实验室**
- 官方二维码：`cropflre/nowen-note` 的 `release/v1.5.0` → `frontend/src/assets/community/nowen-lab-wechat.jpg`
- QQ 群：**1093473044**

帮助中心首页、Nowen Note 产品页、Note 教程底部和 `#/note/community` 都会展示社区入口。二维码直接引用正式分支资源，不另外生成或伪造二维码。

## 内容维护原则

### 1. 以真实主分支为事实基线

教程不根据旧截图、旧版本说明或记忆编写。修改教程前先检查对应产品主分支：

- Nowen Note：`cropflre/nowen-note` → `main`；版本专项能力可检查对应 `release/*` 分支
- Nowen Reader：`cropflre/nowen-reader` → `main`
- Nowen Video：`cropflre/nowen-video` → 当前正式主分支

教程中的版本、端口、路径、权限和配置必须能在真实代码或当前文档中找到依据。

部分 `nowen-note/docs/tutorials` 历史文章仍带旧版本尾注，只能作为操作线索；涉及当前权限、离线、同步、客户端和存储能力时，以当前 `main` README、当前专题文档和真实代码为准。

### 2. 用户教程优先解决问题

帮助中心不是源码 README 的镜像。推荐结构：

```text
用户目标
↓
操作步骤
↓
注意事项
↓
失败时怎么排查
↓
相关教程
```

技术实现细节只在能帮助用户理解操作边界时出现。

### 3. 截图与二维码必须说明来源

优先使用当前正式界面的真实截图。没有可用截图时可以使用“操作示意图”，但不能把示意图伪装成产品真实截图。

Nowen Reader 当前直接引用仓库 `main/docs/` 中维护的真实截图；Nowen Note 公众号二维码直接引用 `release/v1.5.0` 中的正式社区资源。后续可以将稳定版本截图复制到本仓库 `assets/help/<product>/`，降低跨仓库资源依赖。

## 新增一篇教程

在对应产品的 `articles` 中增加：

```js
{
  slug: 'example',
  group: 'start',
  title: '教程标题',
  summary: '一句话说明用户能解决什么问题。',
  keywords: '搜索关键词 关键词2',
  updated: '2026-08-20',
  time: '6 分钟',
  body: `...`
}
```

Nowen Note 新的深度专题优先加入 `assets/js/help-note-v4.js`；社区联系方式相关内容维护在 `assets/js/help-community-v5.js`。

可选真实截图：

```js
figure: {
  src: 'assets/help/product/example.webp',
  alt: '无障碍替代文本',
  caption: '截图说明'
}
```

## 新增一个 Nowen 产品

1. 在 `window.NOWEN_HELP.products` 增加产品信息。
2. 新建产品数据文件，例如 `assets/js/help-video.js`。
3. 提供 `meta`、`groups`、`popular`、`articles` 四组数据。
4. 在 `index.html` 中确保数据文件在 `help-app-v3.js` 之前加载。
5. 通用引擎会自动接管首页产品卡、产品总览、侧边栏、搜索、相关文章和路由。

无需为每个产品重新开发一套页面组件。

## 本地预览

```bash
git clone https://github.com/cropflre/cropflre.github.io.git
cd cropflre.github.io

python -m http.server 3000
# 或
npx serve .
```

访问：

```text
http://localhost:3000/
```

常用深链接示例：

```text
#/note/quick-start
#/note/offline-workspace
#/note/desktop-folder-sync
#/note/acl-restricted
#/note/object-storage
#/note/backup-restore-drill
#/note/community
#/note/mcp
#/reader/quick-start
#/reader/opds
```

## 发布

正式站点由 `master` 分支承载，并通过 `.github/workflows/pages.yml` 使用 GitHub Actions 发布。

合并前至少检查：

- 首页能正常渲染
- Note / Reader 产品页可进入
- Note 显示 40 篇教程且 7 个分类完整
- V4 / V5 深链接可以打开
- 深链接刷新后仍可使用
- 搜索能同时命中 Note 与 Reader
- 搜索可命中“离线工作区”“本地文件夹同步”“ACL”“对象存储”“公众号”“QQ群”“1093473044”
- 首页、Note 产品页和 Note 文章底部显示社区入口
- QQ 群复制按钮正常
- 微信公众号二维码能显示并打开弹窗
- 深浅色正常
- 手机端目录可打开 / 关闭
- FAQ 可展开
- 图片可放大并用 Esc 关闭

## License

MIT © cropflre

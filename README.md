# 🌿 cropflre.github.io

> 极客终端风格的开发者个人博客 — 纯原生实现，零依赖

[![GitHub Pages](https://img.shields.io/badge/Live-cropflre.github.io-7ee787?style=flat-square&logo=github)](https://cropflre.github.io)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

## ✨ 特性

- 🌗 暗色/亮色双主题（自动保存偏好）
- ⌨️ 终端打字机动画
- ✨ 鼠标追踪卡片聚光效果
- 📋 代码块一键复制
- 🎬 滚动渐入动画（IntersectionObserver）
- 📱 完全响应式，适配所有设备
- 🚀 零框架依赖，极致性能
- 🎨 CSS Custom Properties 驱动的主题系统

## 📂 项目结构

```
cropflre.github.io/
├── index.html           # 博客首页
├── posts/
│   └── welcome.html     # 项目介绍文章
├── assets/
│   ├── css/
│   │   └── style.css    # 设计系统 & 全部样式
│   └── js/
│       └── main.js      # 交互逻辑
├── 404.html             # 终端风 404 页面
├── .nojekyll            # 绕过 Jekyll 处理
└── README.md
```

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/cropflre/cropflre.github.io.git
cd cropflre.github.io

# 本地预览
npx serve .
# 或 python -m http.server 3000

# 部署（推送到 master 分支即可）
git push origin master
```

## 🎨 自定义

编辑 `assets/css/style.css` 顶部的 `:root` 变量：

```css
:root {
  --accent: #7ee787;      /* 主强调色 */
  --accent-2: #79c0ff;    /* 链接色 */
  --font-mono: "JetBrains Mono", monospace;
  --radius: 10px;         /* 全局圆角 */
}
```

## 📝 新增文章

1. 在 `posts/` 目录新建 `.html` 文件
2. 复制 `posts/welcome.html` 作为模板
3. 修改文章内容
4. 在 `index.html` 文章列表中添加链接

## 📄 License

MIT © cropflre

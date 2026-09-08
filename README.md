# 尹禹皓个人博客

面向AI产品经理、实施工程师、项目管理、售前工程师及产品协同岗位的个人博客。网站使用 Astro 静态生成，通过 GitHub Pages 发布。

## 本地环境

- Node.js 22.12.0 或更高的偶数版本
- pnpm 10

## 本地运行

```powershell
pnpm install
pnpm dev
```

浏览器访问 `http://localhost:4321`。

## 新建文章

在 `src/content/blog/` 创建 Markdown 文件，并填写：

```yaml
---
title: 文章标题
description: 至少二十个字符的文章摘要
publishedAt: 2026-08-03
category: 项目复盘
tags: [项目管理, 售前协同]
draft: false
featured: false
---
```

`category` 只能是 `项目复盘`、`AI 工具实践` 或 `行业观察`。

## 发布前检查

```powershell
pnpm quality
pnpm test:e2e
pnpm lighthouse
```

## GitHub Pages

仓库 Settings → Pages → Source 选择 GitHub Actions。推送到 `main` 后，`pages.yml` 自动识别用户站点和项目站点路径并部署。

## 隐私

网页不展示手机号。`public/resume/yin-yuhao-resume.pdf` 必须通过 `pnpm resume:verify` 后才能提交。

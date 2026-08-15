# Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a Moonshot-inspired, recruitment-oriented personal blog that positions 尹禹皓 for project assistant, implementation engineer, project management, pre-sales engineer, and product-collaboration roles.

**Architecture:** Astro 6 generates a fully static site from validated Markdown content collections and typed profile data. Shared Astro components implement the dark “月影编辑部” visual system, while small isolated TypeScript modules provide filtering and motion enhancement; GitHub Actions verifies and deploys the resulting `dist/` directory to GitHub Pages.

**Tech Stack:** Node.js 22.12+, pnpm 10, Astro 6, TypeScript, Markdown, native CSS, Vitest, Playwright, Prettier, Linkinator, Lighthouse CI, GitHub Actions, GitHub Pages.

## Global Constraints

- Visible first-release navigation is exactly `首页`, `博客`, `关于`; the guestbook route and navigation item are not shipped.
- Career positioning must include project assistant, implementation engineer, project management, pre-sales engineer, AI project delivery, and product collaboration without presenting the author as a pure software developer.
- Blog categories are exactly `项目复盘`, `AI 工具实践`, and `行业观察`.
- Visual direction is A “月影编辑部”; homepage hierarchy is A1 “编辑式平衡”.
- The site uses original visual assets and copy; it must not reproduce Moonshot AI logos, proprietary media, or brand copy.
- Output is fully static; no database, authentication, CMS, comments, analytics, subscription, or server adapter is included.
- Node.js must be `>=22.12.0` and an even-numbered release, matching current Astro prerequisites.
- Content must remain readable when JavaScript fails and when `prefers-reduced-motion: reduce` is active.
- Web pages expose the public recruitment email but do not render the phone number; the public resume PDF is prepared with the phone redacted.
- Every task ends with an independently testable deliverable and a focused Git commit.

---

## File Structure

```text
.
├── .github/workflows/
│   ├── ci.yml                         # pull-request and branch quality gate
│   └── pages.yml                      # GitHub Pages build and deploy
├── docs/superpowers/                  # approved specification and this plan
├── public/
│   ├── favicon.svg                    # original lunar monogram
│   └── resume/yin-yuhao-resume.pdf    # phone-redacted public resume
├── scripts/
│   └── verify-public-resume.mjs       # fails if public PDF still contains phone
├── src/
│   ├── assets/profile.webp            # portrait extracted from the supplied resume
│   ├── components/
│   │   ├── AboutStrip.astro
│   │   ├── AboutTimeline.astro
│   │   ├── ArticleCard.astro
│   │   ├── ArticleLayout.astro
│   │   ├── BlogIndex.astro
│   │   ├── FeaturedEssay.astro
│   │   ├── LatestJournal.astro
│   │   ├── MoonHero.astro
│   │   ├── ProjectProof.astro
│   │   ├── RelatedPosts.astro
│   │   ├── ResumeDownload.astro
│   │   ├── SEOHead.astro
│   │   ├── SiteFooter.astro
│   │   ├── SiteHeader.astro
│   │   └── TableOfContents.astro
│   ├── content/blog/                  # Markdown posts
│   ├── content.config.ts              # loader and schema validation
│   ├── data/site.ts                   # profile, projects, timeline, contact
│   ├── layouts/BaseLayout.astro       # document shell and global accessibility
│   ├── lib/posts.ts                   # collection queries and related-post rules
│   ├── lib/search.ts                  # pure blog filtering logic
│   ├── lib/url.ts                     # GitHub Pages base-path-safe URLs
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── blog/[...id].astro
│   │   ├── blog/index.astro
│   │   ├── index.astro
│   │   └── robots.txt.ts              # base-path-safe crawler policy
│   ├── scripts/blog-filter.ts         # progressive blog filtering UI
│   └── styles/global.css              # tokens, typography, layout, motion fallback
├── tests/
│   ├── e2e/
│   │   ├── about.spec.ts
│   │   ├── article.spec.ts
│   │   ├── blog.spec.ts
│   │   ├── home.spec.ts
│   │   └── shell.spec.ts
│   └── unit/
│       ├── posts.test.ts
│       ├── search.test.ts
│       └── url.test.ts
├── astro.config.mjs
├── lighthouserc.cjs
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Reference Documentation

- [Astro installation and Node.js requirement](https://docs.astro.build/en/install-and-setup/)
- [Astro content loader API](https://docs.astro.build/en/reference/content-loader-reference/)
- [Astro testing guide](https://docs.astro.build/en/guides/testing/)
- [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/)

---

### Task 1: Establish the Astro toolchain and static-site shell

**Files:**

- Create: `package.json`
- Create: `pnpm-lock.yaml`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.prettierrc.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/lib/url.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro`
- Create: `src/styles/global.css`
- Create: `tests/unit/url.test.ts`
- Create: `tests/e2e/shell.spec.ts`

**Interfaces:**

- Consumes: approved site specification only.
- Produces: `withBase(path: string, base?: string): string`, a buildable Astro application, and shared `BaseLayout` props `{ title: string; description: string; image?: string }`.

- [ ] **Step 1: Create the package manifest and install locked dependencies**

Create `package.json` with this complete script and engine contract:

```json
{
  "name": "yin-yuhao-personal-blog",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "links": "linkinator dist --recurse --skip mailto:",
    "resume:verify": "node scripts/verify-public-resume.mjs",
    "lighthouse": "lhci autorun"
  }
}
```

Run:

```powershell
pnpm add astro@^6.0.0 @astrojs/check@latest @astrojs/sitemap@latest pdf-parse@1.1.1
pnpm add -D typescript@latest vitest@latest @playwright/test@latest prettier@latest prettier-plugin-astro@latest linkinator@latest @lhci/cli@latest
```

Expected: `package.json` contains resolved dependency ranges and `pnpm-lock.yaml` is created. Commit the lockfile; the official Astro Pages action uses it to detect pnpm.

- [ ] **Step 2: Add Astro, TypeScript, formatting, and test configuration**

Create `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const site = process.env.SITE_URL ?? "http://localhost:4321";
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Create `.prettierrc.json`:

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [
    {
      "files": "*.astro",
      "options": { "parser": "astro" }
    }
  ]
}
```

Create `vitest.config.ts`:

```ts
/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
  },
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  webServer: {
    command: "pnpm preview",
    url: "http://127.0.0.1:4321/",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://127.0.0.1:4321/",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
});
```

- [ ] **Step 3: Write failing URL and shell tests**

Create `tests/unit/url.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { withBase } from "../../src/lib/url";

describe("withBase", () => {
  it("keeps root deployment paths clean", () => {
    expect(withBase("/blog/", "/")).toBe("/blog/");
  });

  it("prefixes project-page deployments once", () => {
    expect(withBase("/blog/", "/personal-blog/")).toBe("/personal-blog/blog/");
  });
});
```

Create `tests/e2e/shell.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("renders the Chinese document shell", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/尹禹皓/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("main")).toBeVisible();
});
```

Run:

```powershell
pnpm test:unit
```

Expected: FAIL because `src/lib/url.ts` does not exist.

- [ ] **Step 4: Implement base-path-safe URLs and the minimal shell**

Create `src/lib/url.ts`:

```ts
export function withBase(
  path: string,
  base = import.meta.env.BASE_URL,
): string {
  const normalizedBase =
    base === "/" ? "" : `/${base.replace(/^\/+|\/+$/g, "")}`;
  const normalizedPath = `/${path.replace(/^\/+/, "")}`;
  return `${normalizedBase}${normalizedPath}`.replace(/\/+/g, "/");
}
```

Create `src/styles/global.css`:

```css
:root {
  color-scheme: dark;
  --bg: #050505;
  --surface: #0d0d0d;
  --text: #f2f2ee;
  --muted: #858580;
  --border: #292929;
  --content: 72rem;
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}
html {
  background: var(--bg);
  color: var(--text);
  scroll-behavior: smooth;
}
body {
  margin: 0;
  min-width: 20rem;
  background: var(--bg);
}
a {
  color: inherit;
}
img {
  display: block;
  max-width: 100%;
}
main {
  min-height: 70vh;
}
.shell {
  width: min(calc(100% - 2rem), var(--content));
  margin-inline: auto;
}
.skip-link {
  position: fixed;
  left: 1rem;
  top: -5rem;
  z-index: 100;
  padding: 0.75rem 1rem;
  background: white;
  color: black;
}
.skip-link:focus {
  top: 1rem;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Create `src/layouts/BaseLayout.astro`:

```astro
---
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const { title, description, image = "/favicon.svg" } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" href={image} />
    <title>{title}</title>
  </head>
  <body>
    <a class="skip-link" href="#main-content">跳到正文</a>
    <main id="main-content">
      <slot />
    </main>
  </body>
</html>
```

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout
  title="尹禹皓 · 个人博客"
  description="AI 项目实施、售前协同与项目管理个人博客"
>
  <div class="shell"><h1>尹禹皓</h1></div>
</BaseLayout>
```

- [ ] **Step 5: Verify the foundation and commit**

Run:

```powershell
pnpm test:unit
pnpm check
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Expected: all commands exit 0; Astro reports generated `/index.html`; both Playwright projects pass.

Commit:

```powershell
git add package.json pnpm-lock.yaml astro.config.mjs tsconfig.json .prettierrc.json vitest.config.ts playwright.config.ts src tests
git commit -m "chore: establish Astro site foundation"
```

---

### Task 2: Define the content schema, typed profile data, and post queries

**Files:**

- Create: `src/content.config.ts`
- Create: `src/data/site.ts`
- Create: `src/lib/posts.ts`
- Create: `tests/unit/posts.test.ts`
- Create: `src/content/blog/1500-works-delivery.md`
- Create: `src/content/blog/codex-project-breakdown.md`
- Create: `src/content/blog/ai-implementation-role.md`

**Interfaces:**

- Consumes: Astro content collections from Task 1.
- Produces: `getPublishedPosts()`, `getFeaturedPost()`, `getRelatedPosts(current, posts, limit)`, `siteProfile`, `projectProofs`, and `timeline`.

- [ ] **Step 1: Write failing post-query tests**

Create `tests/unit/posts.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { CollectionEntry } from "astro:content";
import {
  getFeaturedPost,
  getRelatedPosts,
  sortPosts,
} from "../../src/lib/posts";

type Post = CollectionEntry<"blog">;
const post = (
  id: string,
  date: string,
  category: Post["data"]["category"],
  featured = false,
) =>
  ({
    id,
    data: {
      title: id,
      description: `${id} description`,
      publishedAt: new Date(date),
      category,
      tags: [],
      draft: false,
      featured,
    },
  }) as Post;

describe("post queries", () => {
  const posts = [
    post("old", "2026-01-01", "项目复盘"),
    post("featured", "2026-02-01", "项目复盘", true),
    post("new", "2026-03-01", "行业观察"),
  ];

  it("sorts newest first", () => {
    expect(sortPosts(posts).map(({ id }) => id)).toEqual([
      "new",
      "featured",
      "old",
    ]);
  });

  it("selects the newest featured entry", () => {
    expect(getFeaturedPost(posts)?.id).toBe("featured");
  });

  it("prefers same-category related entries", () => {
    expect(getRelatedPosts(posts[0], posts, 1)[0].id).toBe("featured");
  });
});
```

Run:

```powershell
pnpm test:unit -- tests/unit/posts.test.ts
```

Expected: FAIL because `src/lib/posts.ts` does not exist.

- [ ] **Step 2: Implement the collection schema**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(4),
    description: z.string().min(20),
    publishedAt: z.coerce.date(),
    category: z.enum(["项目复盘", "AI 工具实践", "行业观察"]),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 3: Implement typed site data and post queries**

Create `src/data/site.ts`:

```ts
export const siteProfile = {
  name: "尹禹皓",
  eyebrow: "AI DELIVERY · PRE-SALES · PROJECT MANAGEMENT",
  headline: "让复杂工作，成为可交付、可复用的系统。",
  summary:
    "关注 AI 项目实施、售前协同、项目管理与产品协作，记录需求如何被理解、方案如何被表达、项目如何被推进并完成交付。",
  email: "kkz2799020912@gmail.com",
} as const;

export const projectProofs = [
  {
    value: "1500+",
    label: "发明作品批量交付",
    detail: "交付周期从 30 天压缩至 7 天",
  },
  {
    value: "76%",
    label: "交付周期缩短",
    detail: "串联数据、配图、展板与报告流程",
  },
  { value: "50+", label: "AI 产品概念", detail: "设计周期缩短 50%" },
] as const;

export const timeline = [
  {
    period: "2026.06—2026.07",
    title: "科创夏令营成长积分与奖励管理系统",
    role: "项目负责人",
  },
  {
    period: "2026.03—2026.05",
    title: "全球发明大赛批量交付系统",
    role: "自动化系统搭建",
  },
  {
    period: "2025.11—2026.03",
    title: "智能硬件 AI 视觉生成与产品提案",
    role: "AI 内容设计与产品支持",
  },
  { period: "2024.03—2026.05", title: "校园网络中心", role: "副部长" },
] as const;
```

Create `src/lib/posts.ts`:

```ts
import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return sortPosts(posts);
}

export function getFeaturedPost(posts: BlogPost[]): BlogPost | undefined {
  return sortPosts(posts.filter(({ data }) => data.featured))[0];
}

export function getRelatedPosts(
  current: BlogPost,
  posts: BlogPost[],
  limit = 2,
): BlogPost[] {
  return sortPosts(posts.filter(({ id }) => id !== current.id))
    .sort(
      (a, b) =>
        Number(b.data.category === current.data.category) -
        Number(a.data.category === current.data.category),
    )
    .slice(0, limit);
}
```

- [ ] **Step 4: Add three complete launch articles**

Create `src/content/blog/1500-works-delivery.md`:

```markdown
---
title: 我如何把 1500+ 份作品交付流程压缩到 7 天
description: 从数据导入、AI 配图到展板和报告生成，复盘一次大规模作品交付流程的拆解、校验和协同方法。
publishedAt: 2026-08-01
category: 项目复盘
tags: [项目交付, AI 自动化, 流程设计]
featured: true
---

## 问题不是“做得快一点”

面对 1500 多份发明作品，逐份复制、配图和排版会让任何局部提速都很快失效。真正需要解决的是交付链路：数据从哪里来，经过哪些规则，在哪些节点必须被校验，最终由谁确认。

## 把交付拆成可检查的阶段

我把流程拆成数据导入、图片理解、素材生成、模板渲染和成品校验。每一步都有明确输入与输出，失败时只重跑当前阶段，不让错误扩散到整批文件。

## AI 负责生成，规则负责验收

视觉模型用于理解作品图片并辅助配图，动态模板保证 PDF 报告结构一致。自动化并没有取消人工判断，而是把人工时间集中到异常项和最终验收上。

## 结果与反思

交付周期从 30 天缩短到 7 天，人工校对工作量减少约 90%。这次项目让我确认：项目实施的价值不只在工具使用，更在于把业务要求转换成稳定、可追踪的流程。
```

Create `src/content/blog/codex-project-breakdown.md`:

```markdown
---
title: 我如何使用 Codex 协助完成项目拆解与问题排查
description: 记录在项目实施中如何让 Codex 协助澄清需求、拆分任务、检查结果，同时保留业务判断和人工验收。
publishedAt: 2026-07-26
category: AI 工具实践
tags: [Codex, 项目拆解, 人机协作]
---

## 先提供业务上下文

工具不知道项目真正的优先级。开始前，我会明确用户角色、关键流程、完成标准和不能被破坏的约束，再让 Codex 协助形成任务清单。

## 用小任务降低返工

我把一次大改动拆成可独立验证的小步骤，每一步都要求说明影响范围、验证方式和失败后的回退路径。这种方式让问题更容易定位，也方便和项目成员同步进度。

## 把结果当作待验收交付物

生成结果需要经过功能检查、边界测试和业务复核。Codex 提升了执行速度，但是否满足真实需求仍由项目负责人判断。

## 我的使用原则

AI 工具适合承担重复分析、初稿生成和排查辅助；项目人员必须负责目标、取舍、沟通和验收。
```

Create `src/content/blog/ai-implementation-role.md`:

```markdown
---
title: 我理解的 AI 实施工程师：连接需求、方案与交付
description: 从项目管理和售前协同视角，讨论 AI 实施岗位为什么既需要理解工具，也需要表达方案、管理过程和推动验收。
publishedAt: 2026-07-18
category: 行业观察
tags: [实施工程师, 售前工程师, 项目管理]
---

## 实施不是最后一步

实施人员应在需求澄清阶段就参与，帮助客户把模糊期待转换成范围、流程和验收条件。越晚发现理解偏差，修正成本越高。

## 售前表达决定预期

方案需要讲清业务价值、适用边界、资源投入和风险。好的售前协同不是承诺所有需求，而是建立双方都能执行的预期。

## 项目管理保证持续推进

计划、责任人、依赖项、风险和里程碑需要被持续维护。技术工具可以提供信息，但推动决策和协调资源仍然依赖人。

## 我希望承担的角色

我希望站在业务与技术之间，理解客户问题、组织解决方案、推进项目过程，并用清晰的交付结果证明价值。
```

- [ ] **Step 5: Run schema and unit verification**

Run:

```powershell
pnpm test:unit -- tests/unit/posts.test.ts
pnpm check
pnpm build
```

Expected: all tests pass; Astro validates all three articles and generates without schema errors.

- [ ] **Step 6: Commit the content foundation**

```powershell
git add src/content.config.ts src/content src/data/site.ts src/lib/posts.ts tests/unit/posts.test.ts
git commit -m "feat: add validated blog content foundation"
```

---

### Task 3: Build the shared “月影编辑部” visual shell

**Files:**

- Create: `src/components/SEOHead.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/e2e/shell.spec.ts`

**Interfaces:**

- Consumes: `withBase()` and `siteProfile`.
- Produces: a shared header/footer/SEO shell and CSS utility classes used by all later page components.

- [ ] **Step 1: Extend the shell test before implementation**

Replace `tests/e2e/shell.spec.ts` with:

```ts
import { expect, test } from "@playwright/test";

test("renders the accessible three-item navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/尹禹皓/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  const navigation = page.getByRole("navigation", { name: "主导航" });
  await expect(navigation.getByRole("link")).toHaveCount(3);
  await expect(navigation.getByRole("link", { name: "首页" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "博客" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "关于" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "留言" })).toHaveCount(0);
});

test("keeps a keyboard-visible skip link", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "跳到正文" })).toBeFocused();
});
```

Run `pnpm build` and then `pnpm test:e2e -- tests/e2e/shell.spec.ts`.

Expected: FAIL because the header and footer are not implemented.

- [ ] **Step 2: Create the SEO, header, and footer components**

Create `src/components/SEOHead.astro`:

```astro
---
import { withBase } from "../lib/url";
interface Props {
  title: string;
  description: string;
  image?: string;
}
const { title, description, image = "/favicon.svg" } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const socialImage = new URL(withBase(image), Astro.site);
---

<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={socialImage} />
<meta name="twitter:card" content="summary_large_image" />
<title>{title}</title>
```

Create `src/components/SiteHeader.astro`:

```astro
---
import { withBase } from "../lib/url";
const items = [
  { href: "/", label: "首页" },
  { href: "/blog/", label: "博客" },
  { href: "/about/", label: "关于" },
];
---

<header class="site-header">
  <div class="shell header-inner">
    <a class="wordmark" href={withBase("/")} aria-label="尹禹皓首页"
      >YIN · YUHAO</a
    >
    <nav aria-label="主导航">
      {
        items.map((item) => (
          <a
            href={withBase(item.href)}
            aria-current={
              Astro.url.pathname.endsWith(item.href) ? "page" : undefined
            }
          >
            {item.label}
          </a>
        ))
      }
    </nav>
  </div>
</header>
```

Create `src/components/SiteFooter.astro`:

```astro
---
import { siteProfile } from "../data/site";
---

<footer class="site-footer">
  <div class="shell footer-inner">
    <p>把业务需求转化为可交付方案。</p>
    <a href={`mailto:${siteProfile.email}`}>{siteProfile.email}</a>
    <small>© {new Date().getFullYear()} 尹禹皓</small>
  </div>
</footer>
```

- [ ] **Step 3: Compose the complete base layout**

Replace `src/layouts/BaseLayout.astro` with:

```astro
---
import "../styles/global.css";
import SEOHead from "../components/SEOHead.astro";
import SiteFooter from "../components/SiteFooter.astro";
import SiteHeader from "../components/SiteHeader.astro";
import { withBase } from "../lib/url";

interface Props {
  title: string;
  description: string;
  image?: string;
}
const { title, description, image } = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <SEOHead title={title} description={description} image={image} />
    <link rel="icon" href={withBase("/favicon.svg")} />
  </head>
  <body>
    <a class="skip-link" href="#main-content">跳到正文</a>
    <SiteHeader />
    <main id="main-content"><slot /></main>
    <SiteFooter />
  </body>
</html>
```

- [ ] **Step 4: Extend the visual system**

Append these rules to `src/styles/global.css`:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at 75% 8%,
    rgba(255, 255, 255, 0.055),
    transparent 28rem
  );
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(5, 5, 5, 0.78);
  backdrop-filter: blur(18px);
}
.header-inner,
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4.5rem;
  gap: 1rem;
}
.wordmark {
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}
nav {
  display: flex;
  gap: clamp(1rem, 4vw, 2.25rem);
}
nav a {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.9rem;
}
nav a:hover,
nav a[aria-current="page"] {
  color: var(--text);
}
.site-footer {
  margin-top: 7rem;
  border-top: 1px solid var(--border);
  color: var(--muted);
}
.footer-inner {
  min-height: 8rem;
  flex-wrap: wrap;
}
.footer-inner p,
.footer-inner small {
  margin: 0;
}
.section {
  padding-block: clamp(4rem, 9vw, 8rem);
  border-top: 1px solid var(--border);
}
.eyebrow {
  color: var(--muted);
  font:
    0.72rem/1.4 ui-monospace,
    monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.section-title {
  margin: 0.75rem 0 2rem;
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.04em;
}
.pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0 1rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  text-decoration: none;
}
.card {
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: var(--surface);
}
:focus-visible {
  outline: 2px solid white;
  outline-offset: 4px;
}
```

- [ ] **Step 5: Verify responsive shell behavior and commit**

Run:

```powershell
pnpm format
pnpm check
pnpm build
pnpm test:e2e -- tests/e2e/shell.spec.ts
```

Expected: both desktop and mobile projects pass; no `留言` link appears.

Commit:

```powershell
git add src/components src/layouts/BaseLayout.astro src/styles/global.css tests/e2e/shell.spec.ts
git commit -m "feat: add moonlit editorial site shell"
```

---

### Task 4: Implement the A1 editorial homepage

**Files:**

- Create: `src/components/MoonHero.astro`
- Create: `src/components/FeaturedEssay.astro`
- Create: `src/components/ProjectProof.astro`
- Create: `src/components/LatestJournal.astro`
- Create: `src/components/AboutStrip.astro`
- Modify: `src/pages/index.astro`
- Create: `tests/e2e/home.spec.ts`

**Interfaces:**

- Consumes: `siteProfile`, `projectProofs`, `getPublishedPosts()`, `getFeaturedPost()`, `withBase()`.
- Produces: the approved homepage sequence: identity, featured essay, project proof, latest journal, about summary, action links.

- [ ] **Step 1: Write the failing homepage hierarchy test**

Create `tests/e2e/home.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("renders the approved A1 hierarchy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "让复杂工作",
  );
  await expect(page.getByRole("heading", { name: "本期精选" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "代表项目" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "最近文章" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "关于我" })).toBeVisible();
  await expect(page.getByText("项目管理")).toBeVisible();
  await expect(page.getByText("售前协同")).toBeVisible();
});
```

Run `pnpm build` and `pnpm test:e2e -- tests/e2e/home.spec.ts`.

Expected: FAIL because the homepage sections do not exist.

- [ ] **Step 2: Implement the hero and featured essay**

Create `src/components/MoonHero.astro`:

```astro
---
import { siteProfile } from "../data/site";
import { withBase } from "../lib/url";
---

<section class="moon-hero shell">
  <div class="moon-orbit" aria-hidden="true"><span></span></div>
  <p class="eyebrow">{siteProfile.eyebrow}</p>
  <h1>{siteProfile.headline}</h1>
  <p class="hero-summary">{siteProfile.summary}</p>
  <div class="hero-actions">
    <a class="pill" href={withBase("/blog/")}>阅读博客</a>
    <a class="pill" href={withBase("/about/")}>了解我</a>
  </div>
</section>
<style>
  .moon-hero {
    position: relative;
    min-height: min(46rem, 86vh);
    display: grid;
    align-content: center;
    overflow: hidden;
  }
  h1 {
    position: relative;
    z-index: 2;
    max-width: 13ch;
    margin: 1.2rem 0;
    font-size: clamp(3rem, 8vw, 6.8rem);
    font-weight: 500;
    line-height: 0.98;
    letter-spacing: -0.065em;
  }
  .hero-summary {
    position: relative;
    z-index: 2;
    max-width: 40rem;
    color: var(--muted);
    font-size: clamp(1rem, 2vw, 1.22rem);
    line-height: 1.8;
  }
  .hero-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 2rem;
  }
  .moon-orbit {
    position: absolute;
    right: -8rem;
    top: 4rem;
    width: min(42vw, 30rem);
    aspect-ratio: 1;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  .moon-orbit span {
    position: absolute;
    inset: 12%;
    border-radius: 50%;
    background: radial-gradient(
      circle at 35% 35%,
      #292929 0 3%,
      #0b0b0b 40%,
      #000 68%
    );
    box-shadow: -1rem 0 2.5rem rgba(255, 255, 255, 0.34);
    animation: moon-drift 18s ease-in-out infinite alternate;
  }
  @keyframes moon-drift {
    from {
      transform: translate3d(-1%, -1%, 0) scale(0.99);
    }
    to {
      transform: translate3d(1.5%, 1%, 0) scale(1.02);
    }
  }
  @media (max-width: 42rem) {
    .moon-orbit {
      opacity: 0.55;
      right: -10rem;
      width: 24rem;
    }
  }
</style>
```

Create `src/components/FeaturedEssay.astro`:

```astro
---
import type { BlogPost } from "../lib/posts";
import { withBase } from "../lib/url";
interface Props {
  post: BlogPost;
}
const { post } = Astro.props;
---

<section class="section shell" aria-labelledby="featured-title">
  <p class="eyebrow">FEATURED ESSAY</p>
  <h2 class="section-title" id="featured-title">本期精选</h2>
  <a class="featured card" href={withBase(`/blog/${post.id}/`)}>
    <div>
      <small>{post.data.category}</small><h3>{post.data.title}</h3><p>
        {post.data.description}
      </p>
    </div>
    <div class="featured-moon" aria-hidden="true"></div>
  </a>
</section>
<style>
  .featured {
    display: grid;
    grid-template-columns: 1.35fr 0.65fr;
    min-height: 18rem;
    overflow: hidden;
    color: inherit;
    text-decoration: none;
  }
  .featured > div:first-child {
    padding: clamp(1.5rem, 5vw, 3rem);
  }
  h3 {
    max-width: 20ch;
    margin: 1rem 0;
    font-size: clamp(1.6rem, 4vw, 3rem);
    font-weight: 500;
  }
  p,
  small {
    color: var(--muted);
    line-height: 1.7;
  }
  .featured-moon {
    background:
      radial-gradient(circle at 48% 48%, #aaa 0 1%, #292929 18%, #070707 54%),
      #090909;
  }
  @media (max-width: 42rem) {
    .featured {
      grid-template-columns: 1fr;
    }
    .featured-moon {
      min-height: 10rem;
    }
  }
</style>
```

- [ ] **Step 3: Implement project proof, latest journal, and about strip**

Create `src/components/ProjectProof.astro`:

```astro
---
import { projectProofs } from "../data/site";
---

<section class="section shell" aria-labelledby="projects-title">
  <p class="eyebrow">SELECTED PROOF</p><h2
    class="section-title"
    id="projects-title"
  >
    代表项目
  </h2>
  <div class="proof-grid">
    {
      projectProofs.map((project) => (
        <article class="card proof">
          <>
            <strong>{project.value}</strong>
            <h3>{project.label}</h3>
            <p>{project.detail}</p>
          </>
        </article>
      ))
    }
  </div>
</section>
<style>
  .proof-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .proof {
    padding: 1.5rem;
  }
  strong {
    font-size: clamp(2rem, 5vw, 4.5rem);
    font-weight: 500;
  }
  h3 {
    font-size: 1rem;
  }
  p {
    color: var(--muted);
    line-height: 1.6;
  }
  @media (max-width: 48rem) {
    .proof-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

Create `src/components/LatestJournal.astro`:

```astro
---
import type { BlogPost } from "../lib/posts";
import { withBase } from "../lib/url";
interface Props {
  posts: BlogPost[];
}
const { posts } = Astro.props;
---

<section class="section shell" aria-labelledby="latest-title">
  <p class="eyebrow">LATEST JOURNAL</p><h2
    class="section-title"
    id="latest-title"
  >
    最近文章
  </h2>
  <div class="journal-list">
    {
      posts.map((post) => (
        <a href={withBase(`/blog/${post.id}/`)}>
          <>
            <span>{post.data.category}</span>
            <strong>{post.data.title}</strong>
            <time datetime={post.data.publishedAt.toISOString()}>
              {post.data.publishedAt.toLocaleDateString("zh-CN")}
            </time>
          </>
        </a>
      ))
    }
  </div>
</section>
<style>
  .journal-list {
    border-top: 1px solid var(--border);
  }
  a {
    display: grid;
    grid-template-columns: 8rem 1fr auto;
    gap: 1rem;
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
  }
  span,
  time {
    color: var(--muted);
    font-size: 0.85rem;
  }
  @media (max-width: 42rem) {
    a {
      grid-template-columns: 1fr;
      gap: 0.35rem;
    }
  }
</style>
```

Create `src/components/AboutStrip.astro`:

```astro
---
import { withBase } from "../lib/url";
---

<section class="section shell" aria-labelledby="about-strip-title">
  <p class="eyebrow">ABOUT</p><h2 class="section-title" id="about-strip-title">
    关于我
  </h2>
  <div class="about-strip">
    <p>
      我希望站在客户、业务与技术之间，参与需求澄清、售前方案、项目管理、实施推进和交付复盘。
    </p><a class="pill" href={withBase("/about/")}>查看经历与简历</a>
  </div>
</section>
<style>
  .about-strip {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 2rem;
  }
  .about-strip p {
    max-width: 36rem;
    color: var(--muted);
    font-size: clamp(1.2rem, 3vw, 2rem);
    line-height: 1.55;
  }
  @media (max-width: 42rem) {
    .about-strip {
      align-items: start;
      flex-direction: column;
    }
  }
</style>
```

- [ ] **Step 4: Compose the homepage**

Replace `src/pages/index.astro` with:

```astro
---
import AboutStrip from "../components/AboutStrip.astro";
import FeaturedEssay from "../components/FeaturedEssay.astro";
import LatestJournal from "../components/LatestJournal.astro";
import MoonHero from "../components/MoonHero.astro";
import ProjectProof from "../components/ProjectProof.astro";
import BaseLayout from "../layouts/BaseLayout.astro";
import { getFeaturedPost, getPublishedPosts } from "../lib/posts";

const posts = await getPublishedPosts();
const featured = getFeaturedPost(posts) ?? posts[0];
---

<BaseLayout
  title="尹禹皓 · AI 项目实施、售前协同与项目管理"
  description="记录 AI 项目实施、售前协同、项目管理、产品协作与业务交付。"
>
  <MoonHero />
  {featured && <FeaturedEssay post={featured} />}
  <ProjectProof />
  <LatestJournal posts={posts.slice(0, 3)} />
  <AboutStrip />
</BaseLayout>
```

- [ ] **Step 5: Verify homepage hierarchy and commit**

Run:

```powershell
pnpm format
pnpm check
pnpm build
pnpm test:e2e -- tests/e2e/home.spec.ts
```

Expected: all checks pass in desktop and mobile projects; headings appear in A1 order.

Commit:

```powershell
git add src/components src/pages/index.astro tests/e2e/home.spec.ts
git commit -m "feat: build editorial recruitment homepage"
```

---

### Task 5: Build the blog index, categories, tags, archive, and client search

**Files:**

- Create: `src/lib/search.ts`
- Create: `src/scripts/blog-filter.ts`
- Create: `src/components/ArticleCard.astro`
- Create: `src/components/BlogIndex.astro`
- Create: `src/pages/blog/index.astro`
- Create: `tests/unit/search.test.ts`
- Create: `tests/e2e/blog.spec.ts`

**Interfaces:**

- Consumes: `BlogPost[]`, `getPublishedPosts()`, and `withBase()`.
- Produces: `matchesPost(post, query, category)`, progressively enhanced filter controls, and a fully readable no-JavaScript article index.

- [ ] **Step 1: Write failing search and blog-page tests**

Create `tests/unit/search.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { matchesPost } from "../../src/lib/search";

const item = {
  title: "AI 项目实施",
  description: "需求与交付",
  category: "行业观察",
  tags: ["售前工程师"],
};

describe("matchesPost", () => {
  it("matches title, description, and tags case-insensitively", () => {
    expect(matchesPost(item, "售前", "全部")).toBe(true);
    expect(matchesPost(item, "交付", "全部")).toBe(true);
  });

  it("honors the selected category", () => {
    expect(matchesPost(item, "", "行业观察")).toBe(true);
    expect(matchesPost(item, "", "项目复盘")).toBe(false);
  });
});
```

Create `tests/e2e/blog.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("filters blog posts without navigation", async ({ page }) => {
  await page.goto("/blog/");
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(
    page.getByRole("complementary", { name: "文章归档" }),
  ).toContainText("2026 · 3 篇");
  await page.getByRole("button", { name: "行业观察" }).click();
  await expect(page.getByRole("article")).toHaveCount(1);
  await page.getByRole("searchbox", { name: "搜索文章" }).fill("Codex");
  await expect(page.getByRole("article")).toHaveCount(0);
  await page.getByRole("button", { name: "#售前工程师" }).click();
  await expect(page.getByRole("article")).toHaveCount(1);
});
```

Run `pnpm test:unit -- tests/unit/search.test.ts`.

Expected: FAIL because `src/lib/search.ts` does not exist.

- [ ] **Step 2: Implement pure search matching**

Create `src/lib/search.ts`:

```ts
export interface SearchablePost {
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export function matchesPost(
  post: SearchablePost,
  query: string,
  category: string,
): boolean {
  const categoryMatches = category === "全部" || post.category === category;
  const normalized = query.trim().toLocaleLowerCase("zh-CN");
  const haystack = [post.title, post.description, ...post.tags]
    .join(" ")
    .toLocaleLowerCase("zh-CN");
  return categoryMatches && (!normalized || haystack.includes(normalized));
}
```

- [ ] **Step 3: Create article cards and the progressively enhanced index**

Create `src/components/ArticleCard.astro`:

```astro
---
import type { BlogPost } from "../lib/posts";
import { withBase } from "../lib/url";
interface Props {
  post: BlogPost;
}
const { post } = Astro.props;
const search = [post.data.title, post.data.description, ...post.data.tags]
  .join(" ")
  .toLocaleLowerCase("zh-CN");
---

<article
  class="article-card card"
  data-post
  data-category={post.data.category}
  data-search={search}
>
  <p>
    <span>{post.data.category}</span><time
      datetime={post.data.publishedAt.toISOString()}
      >{post.data.publishedAt.toLocaleDateString("zh-CN")}</time
    >
  </p>
  <h2><a href={withBase(`/blog/${post.id}/`)}>{post.data.title}</a></h2>
  <p>{post.data.description}</p>
  <ul aria-label="标签">{post.data.tags.map((tag) => <li>{tag}</li>)}</ul>
</article>
<style>
  .article-card {
    padding: clamp(1.25rem, 4vw, 2rem);
  }
  .article-card > p:first-child {
    display: flex;
    justify-content: space-between;
    color: var(--muted);
  }
  h2 {
    font-size: clamp(1.35rem, 3vw, 2rem);
    font-weight: 500;
  }
  h2 a {
    text-decoration: none;
  }
  .article-card > p {
    color: var(--muted);
    line-height: 1.7;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
  }
  li {
    padding: 0.3rem 0.65rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--muted);
    font-size: 0.75rem;
  }
</style>
```

Create `src/components/BlogIndex.astro`:

```astro
---
import type { BlogPost } from "../lib/posts";
import ArticleCard from "./ArticleCard.astro";
interface Props {
  posts: BlogPost[];
}
const { posts } = Astro.props;
const categories = ["全部", "项目复盘", "AI 工具实践", "行业观察"];
const tags = [...new Set(posts.flatMap((post) => post.data.tags))].sort();
const archive = Object.entries(
  posts.reduce<Record<string, number>>((years, post) => {
    const year = String(post.data.publishedAt.getFullYear());
    years[year] = (years[year] ?? 0) + 1;
    return years;
  }, {}),
).sort(([a], [b]) => Number(b) - Number(a));
---

<div class="blog-tools" data-blog-tools>
  <label
    >搜索文章<input
      type="search"
      aria-label="搜索文章"
      data-blog-search
    /></label
  >
  <div role="group" aria-label="文章分类">
    {
      categories.map((category) => (
        <button
          type="button"
          data-category-button={category}
          aria-pressed={category === "全部"}
        >
          {category}
        </button>
      ))
    }
  </div>
  <div role="group" aria-label="文章标签">
    {
      tags.map((tag) => (
        <button type="button" data-tag-button={tag}>
          #{tag}
        </button>
      ))
    }
  </div>
</div>
<aside class="archive" aria-label="文章归档">
  <strong>归档</strong>{
    archive.map(([year, count]) => (
      <span>
        {year} · {count} 篇
      </span>
    ))
  }
</aside>
<p class="empty" data-empty hidden>没有找到匹配的文章。</p>
<div class="blog-grid" data-blog-grid>
  {posts.map((post) => <ArticleCard post={post} />)}
</div>
<script>
  import { initBlogFilter } from "../scripts/blog-filter";
  initBlogFilter(document);
</script>
<style>
  .blog-tools {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  label {
    display: grid;
    gap: 0.5rem;
    color: var(--muted);
  }
  input {
    width: 100%;
    min-height: 3rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0 1rem;
    background: #0b0b0b;
    color: var(--text);
  }
  [role="group"] {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  button {
    min-height: 2.5rem;
    padding: 0 1rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: transparent;
    color: var(--muted);
  }
  button[aria-pressed="true"] {
    color: #050505;
    background: var(--text);
  }
  .blog-grid {
    display: grid;
    gap: 1rem;
  }
  .archive {
    display: flex;
    gap: 1rem;
    margin: 0 0 2rem;
    color: var(--muted);
    font-size: 0.85rem;
  }
  .empty {
    color: var(--muted);
  }
</style>
```

Create `src/scripts/blog-filter.ts`:

```ts
export function initBlogFilter(root: Document): void {
  const search = root.querySelector<HTMLInputElement>("[data-blog-search]");
  const buttons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-category-button]"),
  ];
  const tagButtons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-tag-button]"),
  ];
  const posts = [...root.querySelectorAll<HTMLElement>("[data-post]")];
  const empty = root.querySelector<HTMLElement>("[data-empty]");
  if (!search || !buttons.length || !posts.length || !empty) return;

  let category = "全部";
  const render = () => {
    let visible = 0;
    const query = search.value.trim().toLocaleLowerCase("zh-CN");
    for (const post of posts) {
      const show =
        (category === "全部" || post.dataset.category === category) &&
        (!query || post.dataset.search?.includes(query));
      post.hidden = !show;
      if (show) visible += 1;
    }
    empty.hidden = visible !== 0;
  };

  search.addEventListener("input", render);
  for (const button of tagButtons)
    button.addEventListener("click", () => {
      search.value = button.dataset.tagButton ?? "";
      render();
    });
  for (const button of buttons)
    button.addEventListener("click", () => {
      category = button.dataset.categoryButton ?? "全部";
      for (const item of buttons)
        item.setAttribute("aria-pressed", String(item === button));
      render();
    });
}
```

- [ ] **Step 4: Create the blog page**

Create `src/pages/blog/index.astro`:

```astro
---
import BlogIndex from "../../components/BlogIndex.astro";
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getPublishedPosts } from "../../lib/posts";
const posts = await getPublishedPosts();
---

<BaseLayout
  title="博客 · 尹禹皓"
  description="项目复盘、AI 工具实践与行业观察。"
>
  <header class="shell page-intro">
    <p class="eyebrow">JOURNAL</p><h1>博客</h1><p>
      记录项目如何发生、工具如何进入流程，以及我对行业的持续判断。
    </p>
  </header>
  <section class="shell section"><BlogIndex posts={posts} /></section>
</BaseLayout>
<style>
  .page-intro {
    padding-block: clamp(5rem, 12vw, 10rem);
  }
  h1 {
    font-size: clamp(3rem, 9vw, 7rem);
    margin: 0.75rem 0;
    letter-spacing: -0.06em;
  }
  .page-intro > p:last-child {
    max-width: 38rem;
    color: var(--muted);
    line-height: 1.8;
  }
</style>
```

- [ ] **Step 5: Verify filtering, no-JavaScript readability, and commit**

Run:

```powershell
pnpm test:unit -- tests/unit/search.test.ts
pnpm check
pnpm build
pnpm test:e2e -- tests/e2e/blog.spec.ts
```

Expected: unit and e2e tests pass; disabling JavaScript still leaves all three article cards and their links in the HTML.

Commit:

```powershell
git add src/lib/search.ts src/scripts/blog-filter.ts src/components/ArticleCard.astro src/components/BlogIndex.astro src/pages/blog/index.astro tests
git commit -m "feat: add searchable blog index"
```

---

### Task 6: Render article pages, contents, and related posts

**Files:**

- Create: `src/components/TableOfContents.astro`
- Create: `src/components/RelatedPosts.astro`
- Create: `src/components/ArticleLayout.astro`
- Create: `src/pages/blog/[...id].astro`
- Create: `tests/e2e/article.spec.ts`

**Interfaces:**

- Consumes: `BlogPost`, Astro `MarkdownHeading[]`, `getPublishedPosts()`, `getRelatedPosts()`.
- Produces: one static route per article ID, an accessible article layout, heading navigation, and related-post links.

- [ ] **Step 1: Write the failing article-page test**

Create `tests/e2e/article.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("renders article metadata, contents, and related reading", async ({
  page,
}) => {
  await page.goto("/blog/1500-works-delivery/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("1500+");
  await expect(
    page.getByRole("navigation", { name: "文章目录" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "相关阅读" })).toBeVisible();
  await expect(page.getByText("项目复盘").first()).toBeVisible();
});
```

Run `pnpm build`.

Expected: the tested route is absent because dynamic article generation is not implemented.

- [ ] **Step 2: Implement the table of contents and related posts**

Create `src/components/TableOfContents.astro`:

```astro
---
import type { MarkdownHeading } from "astro";
interface Props {
  headings: MarkdownHeading[];
}
const { headings } = Astro.props;
const visible = headings.filter(({ depth }) => depth === 2 || depth === 3);
---

{
  visible.length > 0 && (
    <nav class="toc" aria-label="文章目录">
      <>
        <strong>目录</strong>
        <ol>
          {visible.map((heading) => (
            <li class={`depth-${heading.depth}`}>
              <a href={`#${heading.slug}`}>{heading.text}</a>
            </li>
          ))}
        </ol>
      </>
    </nav>
  )
}
<style>
  .toc {
    position: sticky;
    top: 6rem;
    border-left: 1px solid var(--border);
    padding-left: 1rem;
  }
  .toc ol {
    list-style: none;
    padding: 0;
  }
  .toc li {
    margin: 0.65rem 0;
  }
  .toc .depth-3 {
    padding-left: 1rem;
  }
  .toc a {
    color: var(--muted);
    font-size: 0.85rem;
    text-decoration: none;
  }
</style>
```

Create `src/components/RelatedPosts.astro`:

```astro
---
import type { BlogPost } from "../lib/posts";
import { withBase } from "../lib/url";
interface Props {
  posts: BlogPost[];
}
const { posts } = Astro.props;
---

{
  posts.length > 0 && (
    <section class="related" aria-labelledby="related-title">
      <h2 id="related-title">相关阅读</h2>
      {posts.map((post) => (
        <a class="card" href={withBase(`/blog/${post.id}/`)}>
          <span>{post.data.category}</span>
          <strong>{post.data.title}</strong>
        </a>
      ))}
    </section>
  )
}
<style>
  .related {
    margin-top: 5rem;
    padding-top: 3rem;
    border-top: 1px solid var(--border);
  }
  .related > a {
    display: grid;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 1.25rem;
    text-decoration: none;
  }
  .related span {
    color: var(--muted);
    font-size: 0.8rem;
  }
</style>
```

- [ ] **Step 3: Implement the article layout and static route**

Create `src/components/ArticleLayout.astro`:

```astro
---
import type { MarkdownHeading } from "astro";
import type { BlogPost } from "../lib/posts";
import TableOfContents from "./TableOfContents.astro";
import RelatedPosts from "./RelatedPosts.astro";
interface Props {
  post: BlogPost;
  headings: MarkdownHeading[];
  related: BlogPost[];
}
const { post, headings, related } = Astro.props;
---

<article class="shell article">
  <header>
    <p class="eyebrow">{post.data.category}</p><h1>{post.data.title}</h1><p>
      {post.data.description}
    </p><time datetime={post.data.publishedAt.toISOString()}
      >{post.data.publishedAt.toLocaleDateString("zh-CN")}</time
    >
  </header>
  <div class="article-grid">
    <div class="prose"><slot /><RelatedPosts posts={related} /></div><aside>
      <TableOfContents headings={headings} />
    </aside>
  </div>
</article>
<style>
  .article {
    padding-block: clamp(5rem, 10vw, 9rem);
  }
  header {
    max-width: 52rem;
    margin-bottom: 4rem;
  }
  h1 {
    font-size: clamp(2.5rem, 7vw, 5.6rem);
    line-height: 1.05;
    letter-spacing: -0.055em;
  }
  header > p:not(.eyebrow),
  time {
    color: var(--muted);
    line-height: 1.8;
  }
  .article-grid {
    display: grid;
    grid-template-columns: minmax(0, 46rem) 13rem;
    justify-content: space-between;
    gap: 3rem;
  }
  .prose {
    font-size: 1.05rem;
    line-height: 1.9;
  }
  .prose :global(h2) {
    margin-top: 3.5rem;
    font-size: 2rem;
  }
  .prose :global(p) {
    color: #d0d0cb;
  }
  .prose :global(a) {
    text-underline-offset: 0.2em;
  }
  @media (max-width: 58rem) {
    .article-grid {
      grid-template-columns: 1fr;
    }
    .article-grid aside {
      display: none;
    }
  }
</style>
```

Create `src/pages/blog/[...id].astro`:

```astro
---
import { render, type CollectionEntry } from "astro:content";
import ArticleLayout from "../../components/ArticleLayout.astro";
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getPublishedPosts, getRelatedPosts } from "../../lib/posts";

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}

interface Props {
  post: CollectionEntry<"blog">;
}
const { post } = Astro.props;
const posts = await getPublishedPosts();
const related = getRelatedPosts(post, posts);
const { Content, headings } = await render(post);
---

<BaseLayout
  title={`${post.data.title} · 尹禹皓`}
  description={post.data.description}
>
  <ArticleLayout post={post} headings={headings} related={related}
    ><Content /></ArticleLayout
  >
</BaseLayout>
```

- [ ] **Step 4: Verify all static article routes and commit**

Run:

```powershell
pnpm check
pnpm build
pnpm test:e2e -- tests/e2e/article.spec.ts
```

Expected: build output contains three article directories; desktop and mobile article tests pass.

Commit:

```powershell
git add src/components/ArticleLayout.astro src/components/TableOfContents.astro src/components/RelatedPosts.astro src/pages/blog tests/e2e/article.spec.ts
git commit -m "feat: render article reading experience"
```

---

### Task 7: Build the About page and privacy-safe resume assets

**Files:**

- Create: `src/assets/profile.webp`
- Create: `public/resume/yin-yuhao-resume.pdf`
- Create: `scripts/verify-public-resume.mjs`
- Create: `src/components/AboutTimeline.astro`
- Create: `src/components/ResumeDownload.astro`
- Create: `src/pages/about.astro`
- Create: `tests/e2e/about.spec.ts`

**Interfaces:**

- Consumes: optimized resume at `C:\Users\LENOVO\Downloads\尹禹皓.pdf`, `timeline`, `siteProfile`, and `withBase()`.
- Produces: optimized portrait asset, phone-redacted public resume, `AboutTimeline`, and a complete About page.

- [ ] **Step 1: Write the failing About-page and privacy tests**

Create `tests/e2e/about.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("presents career positioning and a downloadable resume", async ({
  page,
}) => {
  await page.goto("/about/");
  await expect(
    page.getByRole("heading", { level: 1, name: "关于我" }),
  ).toBeVisible();
  await expect(page.getByText("售前工程师")).toBeVisible();
  await expect(page.getByText("项目管理")).toBeVisible();
  const resume = page.getByRole("link", { name: "下载公开版简历" });
  await expect(resume).toHaveAttribute("href", /yin-yuhao-resume\.pdf$/);
  await expect(page.locator("body")).not.toContainText(/1[3-9]\d{9}/);
});
```

Run `pnpm build`.

Expected: `/about/` and the public resume do not exist.

- [ ] **Step 2: Prepare the portrait and phone-redacted resume using the PDF workflow**

Use the PDF skill to inspect the complete supplied PDF, export the professional portrait without altering the face, and create `src/assets/profile.webp` at 800px on the long edge.

Create a public resume copy at `public/resume/yin-yuhao-resume.pdf` with any mainland-China mobile number redacted while keeping the public email. Render the resulting PDF and inspect the complete page for layout damage before continuing.

Create `scripts/verify-public-resume.mjs`:

```js
import fs from "node:fs/promises";
import pdf from "pdf-parse";

const resumePath = new URL(
  "../public/resume/yin-yuhao-resume.pdf",
  import.meta.url,
);
const buffer = await fs.readFile(resumePath);
const { text } = await pdf(buffer);

if (/1[3-9]\d{9}/.test(text)) {
  throw new Error("Public resume still contains the private phone number");
}
if (!text.includes("kkz2799020912@gmail.com")) {
  throw new Error("Public resume must retain the recruitment email");
}
console.log("Public resume privacy check passed");
```

Run:

```powershell
pnpm resume:verify
```

Expected: `Public resume privacy check passed`.

- [ ] **Step 3: Implement timeline and resume components**

Create `src/components/AboutTimeline.astro`:

```astro
---
import { timeline } from "../data/site";
---

<ol class="timeline">
  {
    timeline.map((item) => (
      <li>
        <>
          <time>{item.period}</time>
          <div>
            <>
              <h2>{item.title}</h2>
              <p>{item.role}</p>
            </>
          </div>
        </>
      </li>
    ))
  }
</ol>
<style>
  .timeline {
    list-style: none;
    padding: 0;
    border-top: 1px solid var(--border);
  }
  li {
    display: grid;
    grid-template-columns: 10rem 1fr;
    gap: 2rem;
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--border);
  }
  time,
  p {
    color: var(--muted);
  }
  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
  @media (max-width: 42rem) {
    li {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
  }
</style>
```

Create `src/components/ResumeDownload.astro`:

```astro
---
import fs from "node:fs";
import { withBase } from "../lib/url";

const resumePath = new URL(
  "../../public/resume/yin-yuhao-resume.pdf",
  import.meta.url,
);
const resumeExists = fs.existsSync(resumePath);
---

{
  resumeExists && (
    <a class="pill" href={withBase("/resume/yin-yuhao-resume.pdf")} download>
      下载公开版简历
    </a>
  )
}
```

- [ ] **Step 4: Implement the About page**

Create `src/pages/about.astro`:

```astro
---
import profileImage from "../assets/profile.webp";
import AboutTimeline from "../components/AboutTimeline.astro";
import ResumeDownload from "../components/ResumeDownload.astro";
import { siteProfile } from "../data/site";
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout
  title="关于 · 尹禹皓"
  description="尹禹皓的项目管理、售前协同、实施交付、产品协同经历与公开简历。"
>
  <section class="shell about-hero">
    <div>
      <p class="eyebrow">ABOUT</p><h1>关于我</h1><p>{siteProfile.summary}</p><p>
        目标岗位：项目助理、实施工程师、项目管理、售前工程师。
      </p><ResumeDownload />
    </div>
    <img
      src={profileImage.src}
      width={profileImage.width}
      height={profileImage.height}
      alt="尹禹皓职业照片"
    />
  </section>
  <section class="shell section">
    <p class="eyebrow">EXPERIENCE</p><h2 class="section-title">
      经历与项目
    </h2><AboutTimeline />
  </section>
  <section class="shell section">
    <p class="eyebrow">HOW I WORK</p><h2 class="section-title">
      我的工作方式
    </h2><div class="work-grid">
      <article class="card">
        <h3>澄清需求</h3><p>把模糊期待转换成范围、流程和验收条件。</p>
      </article><article class="card">
        <h3>表达方案</h3><p>讲清业务价值、适用边界、资源投入和风险。</p>
      </article><article class="card">
        <h3>推进交付</h3><p>维护责任人、依赖、里程碑和问题闭环。</p>
      </article>
    </div>
  </section>
</BaseLayout>
<style>
  .about-hero {
    display: grid;
    grid-template-columns: 1.4fr 0.6fr;
    gap: clamp(2rem, 8vw, 7rem);
    align-items: center;
    padding-block: clamp(5rem, 12vw, 10rem);
  }
  h1 {
    font-size: clamp(3rem, 9vw, 7rem);
    margin: 0.75rem 0;
    letter-spacing: -0.06em;
  }
  .about-hero p {
    max-width: 42rem;
    color: var(--muted);
    line-height: 1.8;
  }
  .about-hero img {
    border-radius: 1rem;
    filter: grayscale(1);
    border: 1px solid var(--border);
  }
  .work-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .work-grid article {
    padding: 1.5rem;
  }
  .work-grid p {
    color: var(--muted);
    line-height: 1.7;
  }
  @media (max-width: 48rem) {
    .about-hero,
    .work-grid {
      grid-template-columns: 1fr;
    }
    .about-hero img {
      max-width: 18rem;
      order: -1;
    }
  }
</style>
```

- [ ] **Step 5: Verify the About page, PDF privacy, and commit**

Run:

```powershell
pnpm resume:verify
pnpm check
pnpm build
pnpm test:e2e -- tests/e2e/about.spec.ts
```

Expected: all checks pass; rendered page contains no phone number; PDF verification confirms the number is absent.

Commit:

```powershell
git add src/assets/profile.webp public/resume scripts/verify-public-resume.mjs src/components/AboutTimeline.astro src/components/ResumeDownload.astro src/pages/about.astro tests/e2e/about.spec.ts
git commit -m "feat: add privacy-safe about and resume experience"
```

---

### Task 8: Add branded fallbacks, crawler assets, and whole-site quality checks

**Files:**

- Create: `src/pages/404.astro`
- Create: `public/favicon.svg`
- Create: `src/pages/robots.txt.ts`
- Create: `lighthouserc.cjs`
- Modify: `package.json`
- Modify: `tests/e2e/shell.spec.ts`

**Interfaces:**

- Consumes: `BaseLayout`, `withBase()`, and built static output.
- Produces: branded 404, original favicon, crawler policy, automated link and Lighthouse budgets.

- [ ] **Step 1: Add failing fallback and reduced-motion tests**

Append to `tests/e2e/shell.spec.ts`:

```ts
test("renders a branded 404 with recovery links", async ({ page }) => {
  await page.goto("/404.html");
  await expect(
    page.getByRole("heading", { name: "页面进入了暗面" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "返回首页" })).toBeVisible();
  await expect(page.getByRole("link", { name: "阅读博客" })).toBeVisible();
});

test("removes continuous motion when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const duration = await page
    .locator(".moon-orbit span")
    .evaluate((node) => getComputedStyle(node).animationDuration);
  expect(duration).toBe("0.01ms");
});
```

Run `pnpm build` and `pnpm test:e2e -- tests/e2e/shell.spec.ts`.

Expected: FAIL because `/404.html` does not exist.

- [ ] **Step 2: Implement 404, favicon, and robots policy**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { withBase } from "../lib/url";
---

<BaseLayout title="页面未找到 · 尹禹皓" description="请求的页面不存在。">
  <section class="shell not-found">
    <div class="dark-moon" aria-hidden="true"></div><p class="eyebrow">
      404
    </p><h1>页面进入了暗面</h1><p>链接可能已经变化，也可能从未存在。</p><div>
      <a class="pill" href={withBase("/")}>返回首页</a><a
        class="pill"
        href={withBase("/blog/")}>阅读博客</a
      >
    </div>
  </section>
</BaseLayout>
<style>
  .not-found {
    min-height: 70vh;
    display: grid;
    place-content: center;
    justify-items: start;
    position: relative;
  }
  .not-found h1 {
    font-size: clamp(3rem, 9vw, 7rem);
    margin: 1rem 0;
  }
  .not-found > p {
    color: var(--muted);
  }
  .not-found > div:last-child {
    display: flex;
    gap: 0.75rem;
  }
  .dark-moon {
    position: absolute;
    right: 5%;
    width: min(35vw, 22rem);
    aspect-ratio: 1;
    border-radius: 50%;
    background: #090909;
    box-shadow: -1rem 0 2rem rgba(255, 255, 255, 0.18);
    z-index: -1;
  }
</style>
```

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Y 月影标志">
  <rect width="64" height="64" rx="14" fill="#050505"/>
  <circle cx="34" cy="32" r="20" fill="#f2f2ee"/>
  <circle cx="42" cy="27" r="20" fill="#050505"/>
  <path d="M18 18l8 14v14h5V32l8-14h-6l-4.5 8.5L24 18z" fill="#f2f2ee"/>
</svg>
```

Create `src/pages/robots.txt.ts`:

```ts
import type { APIContext } from "astro";

export const prerender = true;

export function GET({ site }: APIContext): Response {
  const baseSite = site ?? new URL("http://localhost:4321");
  const sitemap = new URL(
    `${import.meta.env.BASE_URL}sitemap-index.xml`,
    baseSite,
  );
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

- [ ] **Step 3: Add automated performance and link budgets**

Create `lighthouserc.cjs`:

```js
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: [
        "http://localhost/",
        "http://localhost/blog/",
        "http://localhost/about/",
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
  },
};
```

Add this script to `package.json`:

```json
"quality": "pnpm format:check && pnpm check && pnpm test:unit && pnpm build && pnpm links && pnpm resume:verify"
```

- [ ] **Step 4: Run the complete local quality gate**

Run:

```powershell
pnpm quality
pnpm test:e2e
pnpm lighthouse
```

Expected: formatting, Astro checks, unit tests, build, links, PDF privacy, desktop/mobile e2e, and Lighthouse thresholds all pass.

- [ ] **Step 5: Commit fallbacks and quality checks**

```powershell
git add src/pages/404.astro src/pages/robots.txt.ts public/favicon.svg lighthouserc.cjs package.json pnpm-lock.yaml tests/e2e/shell.spec.ts
git commit -m "test: enforce site quality and fallbacks"
```

---

### Task 9: Configure CI, GitHub Pages deployment, and maintainer documentation

**Files:**

- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/pages.yml`
- Create: `README.md`
- Modify: `.gitignore`

**Interfaces:**

- Consumes: all verification scripts and static build from Tasks 1–8.
- Produces: pull-request validation, main-branch deployment, dynamic user-site/project-site base configuration, and exact authoring instructions.

- [ ] **Step 1: Add the CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22.12.0
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm quality
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
```

- [ ] **Step 2: Add a base-path-safe GitHub Pages workflow**

Create `.github/workflows/pages.yml`:

```yaml
name: Deploy GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22.12.0
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm quality
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e

  build:
    needs: quality
    runs-on: ubuntu-latest
    env:
      SITE_URL: https://${{ github.repository_owner }}.github.io
      BASE_PATH: ${{ github.event.repository.name == format('{0}.github.io', github.repository_owner) && '/' || format('/{0}/', github.event.repository.name) }}
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Write exact maintainer documentation**

Create `README.md`:

````markdown
# 尹禹皓个人博客

面向项目助理、实施工程师、项目管理、售前工程师及产品协同岗位的个人博客。网站使用 Astro 静态生成，通过 GitHub Pages 发布。

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
````

Ensure `.gitignore` contains:

```gitignore
node_modules/
dist/
.astro/
.superpowers/
tmp/
playwright-report/
test-results/
.lighthouseci/
```

- [ ] **Step 4: Rename the local default branch and validate workflow files**

Run:

```powershell
git branch -m main
pnpm exec prettier --check .github README.md
pnpm quality
pnpm test:e2e
```

Expected: branch name is `main`; workflows format successfully; the full quality gate remains green.

- [ ] **Step 5: Commit deployment and documentation**

```powershell
git add .github README.md .gitignore
git commit -m "ci: deploy verified Astro site to GitHub Pages"
```

---

### Task 10: Perform final visual, accessibility, and deployment-readiness verification

**Files:**

- Modify only files that fail a check from Tasks 1–9.
- Verify: `dist/`, all production pages, the public resume, and Git history.

**Interfaces:**

- Consumes: complete site and CI configuration.
- Produces: a clean, tested `main` branch ready to connect to a GitHub repository.

- [ ] **Step 1: Run the complete deterministic verification suite**

Run each command separately:

```powershell
pnpm format:check
pnpm check
pnpm test:unit
pnpm build
pnpm links
pnpm resume:verify
pnpm test:e2e
pnpm lighthouse
```

Expected: every command exits 0; no schema, type, link, privacy, accessibility, or performance failure remains.

- [ ] **Step 2: Inspect required pages at desktop and mobile widths**

Start `pnpm preview`, then inspect `/`, `/blog/`, all three `/blog/<id>/` routes, `/about/`, and `/404.html` at 1440×900 and 390×844.

Confirm all of the following:

- Header contains only 首页、博客、关于.
- Homepage section order matches A1.
- Project management and pre-sales positioning is visible without scrolling past the About section.
- Lunar visuals are original, restrained, and do not reduce text contrast.
- Mobile layouts have no horizontal overflow.
- Reduced-motion mode removes continuous and parallax motion.
- Every image has useful alternative text; decorative lunar elements are hidden from assistive technology.
- Resume download succeeds and the downloaded PDF contains no phone number.

- [ ] **Step 3: Review the final Git diff and history**

Run:

```powershell
git status --short
git log --oneline --decorate -12
git diff HEAD~9..HEAD --check
```

Expected: working tree is clean; each implementation task has one focused commit; diff check reports no whitespace errors.

- [ ] **Step 4: Record any verification-only corrections**

If Step 1–3 expose defects, add only the affected files, rerun the exact failing command and the full `pnpm quality` gate, then commit with:

```powershell
git commit -m "fix: resolve final site verification findings"
```

If no defects are found, do not create an empty commit.

- [ ] **Step 5: Prepare the GitHub handoff**

Report:

- final commit hash;
- verification command results;
- public routes;
- whether the GitHub remote has been configured;
- the remaining user action: create or select the GitHub repository, push `main`, and choose GitHub Actions under Settings → Pages.

Do not push, create a remote repository, or publish the site without explicit user authorization.

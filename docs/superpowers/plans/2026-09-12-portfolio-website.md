# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static personal portfolio site for Nguyen Le Hoang Trung — hub landing with a vCard-style profile card, HTML résumé (EN/VI), case studies, publications, blog, and gallery — deployed to both Cloudflare Pages and GitHub Pages.

**Architecture:** Astro static site. Content lives in typed Content Collections (Markdown/MDX for prose, YAML for résumé data) so a malformed entry fails the build instead of reaching production. Styling is plain CSS custom properties with Astro scoped styles — no utility framework. Client JavaScript is limited to three isolated behaviours: theme toggle, tag filtering, gallery lightbox.

**Tech Stack:** Astro 7.3.x, `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, `astro:assets`, TypeScript (strict), Node 24, GitHub Actions, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-09-12-portfolio-website-design.md`

## Global Constraints

- Accent colour is `#4f46e5` in light mode and `#a5b4fc` in dark mode. Never hardcode either value in a component — always use `var(--accent)`.
- Every colour, radius and spacing value comes from a CSS custom property defined in `src/styles/global.css`. A raw hex in a component file is a defect.
- No CSS framework, no UI component library, no CSS-in-JS. Plain CSS and Astro scoped `<style>` blocks only.
- Client-side JavaScript is permitted in exactly four places: the theme toggle, the résumé language switch, the tag/category filter, and the gallery lightbox. Every other page ships zero JS.
- Site language is English. Only `/resume` carries Vietnamese content.
- `site` in `astro.config.mjs` is `https://htrung1105.github.io`. Do **not** set `base` — the repository is named `htrung1105.github.io`, so the base path is `/` on both hosts.
- Every `<Image />` and `<Picture />` requires a non-empty, descriptive `alt`.
- Verification for every task is `npx astro check` reporting 0 errors and `npm run build` exiting 0. Both must pass before the commit step.
- Commit messages use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `style:`).
- Node 24, npm 11. Package manager is npm.
- Never commit `node_modules/`, `dist/`, `.astro/`, or `.superpowers/` — `.gitignore` already covers these.

## Personal data (use verbatim)

```
Name:      Nguyen Le Hoang Trung
Role:      AI Engineer · AI Researcher
Location:  Ho Chi Minh City, Vietnam
Email:     nguyenlehoangtrung1105@gmail.com
Phone:     +84 384 317 014
GitHub:    https://github.com/htrung1105
LinkedIn:  https://www.linkedin.com/in/nguy%E1%BB%85n-trung-398283144/
```

Résumé source of truth: `D:\Local Data\Resume\work\resume-full.html` (contains both EN and VI).

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (scaffolded, replaced in Task 5)
- Modify: `.gitignore` (verify it already lists `node_modules/`, `dist/`, `.astro/`, `.superpowers/`)

**Interfaces:**
- Consumes: nothing.
- Produces: a buildable Astro project rooted at the repository root, with `npm run dev`, `npm run build`, `npm run preview`, and an `astro check` that passes.

- [ ] **Step 1: Scaffold into the current directory**

Run from the repository root (`D:\Workspace\Portfolio`):

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --no-git --skip-houston
```

Answer "Y" if it warns the directory is not empty — `docs/`, `.gitignore` and `.git/` must survive. If the tool refuses to continue, scaffold into a temporary directory and copy `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/` and `public/` across manually.

- [ ] **Step 2: Verify the scaffold built something runnable**

Run: `npm run build`
Expected: exits 0, prints `Complete!`, and creates `dist/index.html`.

- [ ] **Step 3: Add the integrations**

```bash
npx astro add mdx sitemap --yes
npm install @astrojs/rss
```

- [ ] **Step 4: Write the final config**

Replace `astro.config.mjs` entirely:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://htrung1105.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
```

- [ ] **Step 5: Verify the config compiles and builds**

Run: `npx astro check && npm run build`
Expected: `0 errors`, build exits 0, and `dist/sitemap-index.xml` exists.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with mdx, sitemap, and rss"
```

---

### Task 2: Design tokens, global stylesheet, and the no-flash theme toggle

**Files:**
- Create: `src/styles/global.css`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: Task 1's project.
- Produces:
  - `BaseLayout.astro` with props `{ title: string; description: string; ogImage?: string }` and a default `<slot />`. Every page wraps itself in this.
  - CSS custom properties available globally: `--accent`, `--accent-soft`, `--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--radius-sm`, `--radius-md`, `--shadow`, `--space-1` … `--space-8`, `--maxw`.
  - `<ThemeToggle />`, self-contained, no props.

- [ ] **Step 1: Write the token stylesheet**

Create `src/styles/global.css`:

```css
:root {
  --accent: #4f46e5;
  --accent-soft: #eef2ff;
  --bg: #ffffff;
  --surface: #ffffff;
  --border: #ececf1;
  --text: #0f1115;
  --text-muted: #6b7280;
  --shadow: 0 1px 3px rgba(15, 17, 21, 0.06), 0 8px 24px rgba(15, 17, 21, 0.04);

  --radius-sm: 8px;
  --radius-md: 12px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  --maxw: 1100px;
  --sidebar: 300px;

  --font: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  color-scheme: light;
}

:root[data-theme='dark'] {
  --accent: #a5b4fc;
  --accent-soft: #1e2540;
  --bg: #0d1117;
  --surface: #151b23;
  --border: #1f2630;
  --text: #e6edf3;
  --text-muted: #8b98a5;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.4);

  color-scheme: dark;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--accent);
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

img {
  max-width: 100%;
  height: auto;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 3px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.container {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 var(--space-5);
}

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 var(--space-3);
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Write the theme toggle**

Create `src/components/ThemeToggle.astro`:

```astro
---
---
<button id="theme-toggle" type="button" aria-label="Toggle colour theme">
  <svg class="sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
  <svg class="moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
</button>

<style>
  button {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    padding: 0;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    cursor: pointer;
  }
  button:hover {
    color: var(--accent);
    border-color: var(--accent);
  }
  svg { grid-area: 1 / 1; }
  .moon { display: none; }
  :global(:root[data-theme='dark']) .sun { display: none; }
  :global(:root[data-theme='dark']) .moon { display: block; }
</style>

<script>
  const button = document.getElementById('theme-toggle');
  button?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
</script>
```

- [ ] **Step 3: Write the base layout**

Create `src/layouts/BaseLayout.astro`. The inline script in `<head>` runs before first paint — this is what prevents the white flash on a dark-mode reload:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
}

const { title, description, ogImage = '/og-default.png' } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImageUrl = new URL(ogImage, Astro.site);
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="canonical" href={canonical} />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImageUrl} />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <script is:inline>
      (() => {
        const stored = localStorage.getItem('theme');
        const theme = stored ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.dataset.theme = theme;
      })();
    </script>
  </head>
  <body>
    <a href="#main" class="visually-hidden">Skip to content</a>
    <slot />
  </body>
</html>
```

- [ ] **Step 4: Wire the scaffolded index page to the layout so the build exercises it**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
---
<BaseLayout title="Nguyen Le Hoang Trung" description="AI Engineer and AI Researcher.">
  <main id="main" class="container">
    <h1>Nguyen Le Hoang Trung</h1>
    <ThemeToggle />
  </main>
</BaseLayout>
```

- [ ] **Step 5: Verify the build and the toggle**

Run: `npx astro check && npm run build && npm run preview`
Expected: `0 errors`; build exits 0. Open the preview URL, click the toggle — background flips between `#ffffff` and `#0d1117`. Reload the page in dark mode: **no white flash**. Stop the preview server.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/components/ThemeToggle.astro src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: add design tokens, base layout, and no-flash theme toggle"
```

---

### Task 3: Site config and content collection schemas

**Files:**
- Create: `src/config/site.ts`
- Create: `src/content.config.ts`
- Create: `src/data/resume/en.yaml`
- Create: `src/data/resume/vi.yaml`

**Interfaces:**
- Consumes: Task 1's project.
- Produces:
  - `src/config/site.ts` exporting `site` — an object typed as:
    ```ts
    {
      name: string; role: string; location: string; email: string; phone: string;
      github: string; linkedin: string; tagline: string; blurb: string;
      stats: { value: string; label: string }[];
      url: string;
    }
    ```
  - Five collections queryable via `getCollection()`: `projects`, `publications`, `posts`, `gallery`, `resume`.

- [ ] **Step 1: Write the site config**

Create `src/config/site.ts`:

```ts
export const site = {
  name: 'Nguyen Le Hoang Trung',
  role: 'AI Engineer · AI Researcher',
  location: 'Ho Chi Minh City, Vietnam',
  email: 'nguyenlehoangtrung1105@gmail.com',
  phone: '+84 384 317 014',
  github: 'https://github.com/htrung1105',
  linkedin: 'https://www.linkedin.com/in/nguy%E1%BB%85n-trung-398283144/',
  url: 'https://htrung1105.github.io',
  tagline: 'builds retrieval systems.',
  blurb:
    'Third-year Artificial Intelligence undergraduate at VNU-HCM, working on multimodal retrieval, large language models, and OCR — from research prototype through to FastAPI deployment.',
  stats: [
    { value: '7.4M', label: 'legal articles indexed' },
    { value: '+30.2%', label: 'OCR H-mean gain' },
    { value: 'Top 12', label: 'AI Challenge HCMC' },
  ],
} as const;

export type Site = typeof site;
```

- [ ] **Step 2: Write the collection schemas**

Create `src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      role: z.string(),
      period: z.string(),
      summary: z.string(),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      tags: z.array(z.string()).default([]),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      featured: z.boolean().default(false),
      order: z.number().default(99),
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

const publications = defineCollection({
  loader: glob({ base: './src/content/publications', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    venue: z.string(),
    year: z.number(),
    authors: z.array(z.string()),
    award: z.string().optional(),
    abstract: z.string(),
    pdf: z.string().optional(),
    code: z.string().url().optional(),
    slides: z.string().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.enum(['project', 'paper', 'career']),
      tags: z.array(z.string()).default([]),
      excerpt: z.string(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

const gallery = defineCollection({
  loader: glob({ base: './src/content/gallery', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      alt: z.string(),
      caption: z.string(),
      date: z.coerce.date(),
      album: z.string(),
    }),
});

const resumeEntry = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  meta: z.string().optional(),
  date: z.string(),
  bullets: z.array(z.string()).default([]),
});

const resume = defineCollection({
  loader: glob({ base: './src/data/resume', pattern: '*.yaml' }),
  schema: z.object({
    lang: z.enum(['en', 'vi']),
    label: z.string(),
    headline: z.string(),
    summary: z.string(),
    pdf: z.string(),
    sections: z.array(
      z.object({
        heading: z.string(),
        kind: z.enum(['entries', 'list', 'skills']),
        entries: z.array(resumeEntry).default([]),
        list: z.array(z.string()).default([]),
        skills: z.array(z.object({ group: z.string(), items: z.string() })).default([]),
      }),
    ),
  }),
});

export const collections = { projects, publications, posts, gallery, resume };
```

- [ ] **Step 3: Write the English résumé data**

Create `src/data/resume/en.yaml`. Content is transcribed from `D:\Local Data\Resume\work\resume-full.html`:

```yaml
lang: en
label: English
headline: AI Engineer · AI Researcher
summary: >-
  Third-year Artificial Intelligence undergraduate and AI researcher specializing in
  multimodal retrieval, large language models, and OCR. Hands-on experience building
  end-to-end GraphRAG, agentic, and computer-vision systems from research to FastAPI
  deployment. Seeking an AI Research or AI Engineer internship to turn cutting-edge
  research into reliable, production-ready products.
pdf: /files/resume-en.pdf
sections:
  - heading: Education
    kind: entries
    entries:
      - title: University of Science, VNU-HCM
        subtitle: B.Sc. in Artificial Intelligence
        date: 2023 – 2027 (expected)
        meta: >-
          GPA 3.19 / 4.0 · Core coursework: Machine Learning, NLP, Operating Systems,
          Data Structures & Algorithms, OOP, Software Engineering for AI, DevOps,
          Computer Networks, Data Mining & Analysis, Databases, AI Foundation.
      - title: Quang Trung High School for the Gifted, Binh Phuoc
        date: 2020 – 2023
        meta: GPA 9.5 / 10 · Vallet Scholarship 2023 · Member of the National Informatics Olympiad team.
  - heading: Research & Publication
    kind: entries
    entries:
      - title: 'KPTER: K-Pointer for Temporal Event Retrieval'
        date: Jul 2024 – Nov 2025
        meta: Co-author · AI Researcher & Retrieval Engineer (Team WATLERE) — AI Challenge HCMC 2025 & SOICT 2025
        bullets:
          - Best Presentation Award at SOICT 2025; ranked Top 12 / 80+ at AI Challenge HCMC 2025.
          - Designed and implemented the K-Pointer sequential re-ranking algorithm together with a Weighted Reciprocal Rank Fusion (WRRF) strategy for temporal event retrieval.
          - Built the multimodal retrieval pipeline by integrating OCR, ASR, semantic embeddings, and open-vocabulary object detection into a zero-shot retrieval framework.
  - heading: Projects
    kind: entries
    entries:
      - title: Vietnamese Legal GraphRAG
        subtitle: AI / Full-stack Engineer (Group Project)
        date: Apr 2026 – Present
        meta: github.com/ductai05/VietLegalGraphRAG
        bullets:
          - Indexed over 7.4 million legal articles and 350K document chunks to support scalable legal retrieval.
          - Developed a GraphRAG pipeline that maps complex Vietnamese legal text into a knowledge graph; explains legal jargon via vietlegal-harrier embeddings and LLMs for role-adaptive QA.
          - Implemented an OCR-based contract analysis module using PaddleOCR for extracting and assessing legal risks from document images.
          - Deployed robust FastAPI microservices delivering real-time insights backed by transparent legal citations.
      - title: TradingClaw
        subtitle: AI / Backend Engineer (Group Project)
        date: Apr 2026 – Present
        meta: github.com/ductai05/TradingClaw
        bullets:
          - Built a multi-agent system using LangGraph for real-time web search and market behavioral analysis, leveraging XAI to turn black-box predictions into actionable trading insights.
          - Deployed scalable FastAPI microservices integrated with PostgreSQL to manage high-frequency data streams, user state, and API-cost metrics.
      - title: Sino-Nom / Chinese OCR
        subtitle: ML Engineer (Group Project)
        date: Nov 2025 – Dec 2025
        meta: github.com/ductai05/NLP-ChineseOCR
        bullets:
          - Built a concurrent Go-based crawling pipeline to collect and preprocess the CWKB historical dataset with over 3.4K Sino-Nom document images.
          - Fine-tuned PP-OCRv5 detection (PP-HGNetV2-B4 backbone, DB algorithm) on PaddlePaddle GPU; ran distributed training on 2× NVIDIA T4 with Cosine Annealing and an optimized DBLoss.
          - Improved H-mean by 30.2% (0.731 → 0.952) at 0.966 precision on the NomNaOCR benchmark, resolving detection failures on heavily degraded Sino-Nom characters.
  - heading: Skills
    kind: skills
    skills:
      - group: Languages
        items: Python, C/C++, SQL, TypeScript
      - group: AI & ML
        items: PyTorch, Hugging Face Transformers, PaddlePaddle, NumPy, Pandas, Scikit-learn
      - group: LLM & RAG
        items: LangChain, LangGraph, LightRAG, vLLM
      - group: Backend
        items: FastAPI, NestJS, REST API
      - group: DevOps & MLOps
        items: Docker, Kubernetes, GitHub Actions, Git, Linux
      - group: Databases
        items: PostgreSQL, Neo4j, Supabase, Elasticsearch
      - group: Research
        items: LLMs, Multimodal Retrieval, OCR, ASR, Object Detection
  - heading: Awards & Certifications
    kind: list
    list:
      - 2nd Prize — ICPC Southern Region 2024; contestant at the ICPC Vietnam National round 2024.
      - Consolation Prize — Vietnamese National Informatics Olympiad (VOI) 2023.
      - 'Certifications (DeepLearning.AI, 2026): Data Analytics Foundations · Agentic AI · Linear Algebra for Machine Learning and Data Science.'
```

- [ ] **Step 4: Write the Vietnamese résumé data**

Create `src/data/resume/vi.yaml`, transcribing the Vietnamese half of `resume-full.html` (lines 108–202) into the identical structure:

```yaml
lang: vi
label: Tiếng Việt
headline: Kỹ sư AI · Nghiên cứu viên AI
summary: >-
  Sinh viên năm ba ngành Trí tuệ Nhân tạo và nghiên cứu viên AI, chuyên sâu về truy hồi
  đa phương thức (multimodal retrieval), mô hình ngôn ngữ lớn và OCR. Có kinh nghiệm xây
  dựng hệ thống GraphRAG, agent và thị giác máy tính từ nghiên cứu đến triển khai FastAPI.
  Mong muốn tìm vị trí thực tập AI Research hoặc AI Engineer để hiện thực hóa ý tưởng
  nghiên cứu thành sản phẩm thực tế, đáng tin cậy.
pdf: /files/resume-vi.pdf
sections:
  - heading: Học vấn
    kind: entries
    entries:
      - title: Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM
        subtitle: Cử nhân Trí tuệ Nhân tạo
        date: 2023 – 2027 (dự kiến)
        meta: >-
          GPA 3.19 / 4.0 · Môn học cốt lõi: Máy học, NLP, Hệ điều hành, CTDL & giải thuật,
          OOP, CNPM cho AI, DevOps, Mạng máy tính, Khai thác & phân tích dữ liệu,
          Cơ sở dữ liệu, Cơ sở AI.
      - title: Trường THPT Chuyên Quang Trung, Bình Phước
        date: 2020 – 2023
        meta: Điểm TB 9.5 / 10 · Học bổng Vallet 2023 · Thành viên đội tuyển HSG Quốc gia môn Tin học.
  - heading: Nghiên cứu & Công bố
    kind: entries
    entries:
      - title: 'KPTER: K-Pointer for Temporal Event Retrieval'
        date: 07/2024 – 11/2025
        meta: Đồng tác giả · Nghiên cứu viên AI & Kỹ sư hệ thống (Team WATLERE) — AI Challenge HCMC 2025 & SOICT 2025
        bullets:
          - Giải Best Presentation tại SOICT 2025; xếp Top 12 / 80+ tại AI Challenge HCMC 2025.
          - Đề xuất và hiện thực thuật toán tái xếp hạng tuần tự "K-Pointer" cùng cơ chế WRRF nhằm căn chỉnh chính xác đoạn video theo thời gian.
          - Tích hợp semantic embeddings, OCR, ASR và nhận diện đối tượng open-vocabulary vào một khung truy hồi zero-shot hoàn chỉnh.
  - heading: Dự án
    kind: entries
    entries:
      - title: Vietnamese Legal GraphRAG
        subtitle: Kỹ sư AI / Full-stack
        date: 04/2026 – nay
        meta: github.com/ductai05/VietLegalGraphRAG
        bullets:
          - Đánh chỉ mục hơn 7.4 triệu văn bản pháp luật và 350K đoạn tài liệu để hỗ trợ truy hồi quy mô lớn, độ trễ thấp.
          - Xây dựng pipeline GraphRAG để ánh xạ văn bản pháp luật Việt Nam thành đồ thị tri thức; giải thích thuật ngữ pháp lý qua embeddings vietlegal-harrier và LLM cho hỏi-đáp thích ứng theo vai trò.
          - Hiện thực module phân tích hợp đồng dùng PaddleOCR để trích xuất và đánh giá rủi ro pháp lý từ ảnh tài liệu.
          - Triển khai microservices FastAPI cung cấp thông tin thời gian thực kèm trích dẫn pháp lý minh bạch.
      - title: TradingClaw
        subtitle: Kỹ sư AI / Backend
        date: 04/2026 – nay
        meta: github.com/ductai05/TradingClaw
        bullets:
          - Xây dựng hệ sinh thái điều khiển bởi LLM với các agent LangGraph chuyên biệt cho tìm kiếm web thời gian thực và phân tích hành vi cá nhân hóa; dùng XAI để diễn giải dự đoán hộp đen.
          - Triển khai microservices FastAPI mở rộng tích hợp PostgreSQL để quản lý luồng dữ liệu tần suất cao, trạng thái người dùng và chi phí API.
      - title: Sino-Nom / Chinese OCR
        subtitle: ML Engineer
        date: 11/2025 – 12/2025
        meta: github.com/ductai05/NLP-ChineseOCR
        bullets:
          - Xây dựng pipeline thu thập dữ liệu hiệu năng cao bằng Goroutines (Go) để crawl và tiền xử lý bộ dữ liệu lịch sử CWKB — hơn 3.4K ảnh tài liệu Hán–Nôm, kết hợp cùng NomNaOCR.
          - Fine-tune mô hình phát hiện chữ (text detection) PP-OCRv5 (backbone PP-HGNetV2-B4, thuật toán DB) trên PaddlePaddle GPU; huấn luyện phân tán trên 2× NVIDIA T4 với Cosine Annealing và DBLoss tối ưu.
          - Tăng H-mean 30.2% (0.731 → 0.952) với precision 0.966 trên tập kiểm thử NomNaOCR, khắc phục lỗi phát hiện với ký tự Hán-Nôm suy biến nặng.
  - heading: Kỹ năng
    kind: skills
    skills:
      - group: Ngôn ngữ
        items: Python, C/C++, SQL, TypeScript
      - group: AI & ML
        items: PyTorch, Hugging Face Transformers, PaddlePaddle, NumPy, Pandas, Scikit-learn
      - group: LLM & RAG
        items: LangChain, LangGraph, LightRAG, vLLM
      - group: Backend
        items: FastAPI, NestJS, REST API
      - group: DevOps & MLOps
        items: Docker, Kubernetes, GitHub Actions, Git, Linux
      - group: Cơ sở dữ liệu
        items: PostgreSQL, Neo4j, Supabase, Elasticsearch
      - group: Lĩnh vực NC
        items: LLMs, Multimodal Retrieval, OCR, ASR, Object Detection
  - heading: Giải thưởng & Chứng chỉ
    kind: list
    list:
      - Giải Nhì — ICPC khu vực miền Nam 2024; thí sinh vòng Quốc gia ICPC 2024.
      - Giải Khuyến khích — HSG Quốc gia môn Tin học (VOI) 2023.
      - 'Chứng chỉ (DeepLearning.AI, 2026): Data Analytics Foundations · Agentic AI · Linear Algebra for Machine Learning and Data Science.'
```

- [ ] **Step 5: Create the content directories so the glob loaders resolve**

```bash
mkdir -p src/content/projects src/content/publications src/content/posts src/content/gallery
touch src/content/projects/.gitkeep src/content/publications/.gitkeep src/content/posts/.gitkeep src/content/gallery/.gitkeep
```

- [ ] **Step 6: Prove the schema actually rejects bad data**

Temporarily break `src/data/resume/en.yaml` — change the first line to `lang: fr`.

Run: `npm run build`
Expected: build **FAILS** with a content collection error naming `en` and the invalid enum value.

Restore the line to `lang: en`.

- [ ] **Step 7: Verify a clean build**

Run: `npx astro check && npm run build`
Expected: `0 errors`, build exits 0.

- [ ] **Step 8: Commit**

```bash
git add src/config src/content.config.ts src/data src/content
git commit -m "feat: add site config and typed content collection schemas"
```

---

### Task 4: ProfileCard, Header, and the two-column shell

**Files:**
- Create: `src/components/ProfileCard.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/PageLayout.astro`
- Create: `public/favicon.svg`
- Add: `src/assets/portrait.jpg` (placeholder until the real photo arrives)

**Interfaces:**
- Consumes: `BaseLayout.astro` (Task 2), `site` from `src/config/site.ts` (Task 3).
- Produces: `PageLayout.astro` with props `{ title: string; description: string; sidebar?: boolean }`, defaulting `sidebar` to `true`. When `sidebar` is true it renders `<ProfileCard />` in the left column and the slot on the right; when false the slot takes the full content width. Every page from Task 5 onward uses `PageLayout`, never `BaseLayout` directly.

- [ ] **Step 1: Add a placeholder portrait and a favicon**

Create `src/assets/` and place any 800×800 JPEG at `src/assets/portrait.jpg`. A neutral placeholder is acceptable for now; the spec lists the real portrait as owner-supplied.

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#4f46e5"/>
  <text x="16" y="22" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#fff" text-anchor="middle">HT</text>
</svg>
```

- [ ] **Step 2: Write the ProfileCard**

Create `src/components/ProfileCard.astro`:

```astro
---
import { Image } from 'astro:assets';
import { site } from '../config/site';
import portrait from '../assets/portrait.jpg';
---
<aside class="card profile">
  <Image src={portrait} alt={`Portrait of ${site.name}`} width={96} height={96} class="portrait" />
  <h2 class="name">{site.name}</h2>
  <p class="role">{site.role}</p>

  <ul class="contacts">
    <li>
      <span class="ico" aria-hidden="true">@</span>
      <a href={`mailto:${site.email}`}>{site.email}</a>
    </li>
    <li>
      <span class="ico" aria-hidden="true">gh</span>
      <a href={site.github} rel="me">github.com/htrung1105</a>
    </li>
    <li>
      <span class="ico" aria-hidden="true">in</span>
      <a href={site.linkedin} rel="me">LinkedIn</a>
    </li>
    <li>
      <span class="ico" aria-hidden="true">◎</span>
      <span>{site.location}</span>
    </li>
  </ul>

  <a class="cta" href="/resume">View résumé</a>
</aside>

<style>
  .profile {
    padding: var(--space-5);
    position: sticky;
    top: var(--space-5);
  }
  .portrait {
    border-radius: var(--radius-md);
    object-fit: cover;
    margin-bottom: var(--space-4);
  }
  .name {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .role {
    display: inline-block;
    margin: var(--space-2) 0 0;
    padding: 3px 10px;
    font-size: 12px;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-soft);
    border-radius: 999px;
  }
  .contacts {
    list-style: none;
    margin: var(--space-4) 0 0;
    padding: var(--space-4) 0 0;
    border-top: 1px solid var(--border);
    font-size: 13px;
  }
  .contacts li {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    margin-bottom: var(--space-3);
    color: var(--text-muted);
    overflow-wrap: anywhere;
  }
  .ico {
    flex: none;
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    font-size: 10px;
    font-weight: 700;
    color: var(--accent);
    background: var(--accent-soft);
    border-radius: 6px;
  }
  .cta {
    display: block;
    margin-top: var(--space-4);
    padding: 9px;
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    background: var(--accent);
    border-radius: var(--radius-sm);
    text-decoration: none;
  }
  :global(:root[data-theme='dark']) .cta { color: #0d1117; }

  @media (max-width: 860px) {
    .profile { position: static; }
  }
</style>
```

- [ ] **Step 3: Write the Header**

Create `src/components/Header.astro`:

```astro
---
import ThemeToggle from './ThemeToggle.astro';

const links = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/publications', label: 'Publications' },
  { href: '/resume', label: 'Résumé' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

const path = Astro.url.pathname;
const isActive = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));
---
<header>
  <div class="container bar">
    <a class="brand" href="/">HT</a>
    <nav aria-label="Main">
      <ul>
        {links.map((link) => (
          <li>
            <a href={link.href} class={isActive(link.href) ? 'on' : ''} aria-current={isActive(link.href) ? 'page' : undefined}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
    <ThemeToggle />
  </div>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
  }
  .bar {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    height: 58px;
  }
  .brand {
    font-weight: 800;
    font-size: 15px;
    letter-spacing: -0.02em;
    text-decoration: none;
    color: var(--accent);
  }
  nav { flex: 1; overflow-x: auto; }
  ul {
    display: flex;
    gap: var(--space-1);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul a {
    display: block;
    padding: 6px 11px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    text-decoration: none;
    border-radius: 999px;
    white-space: nowrap;
  }
  ul a:hover { color: var(--text); }
  ul a.on {
    color: var(--accent);
    background: var(--accent-soft);
  }
</style>
```

- [ ] **Step 4: Write the Footer**

Create `src/components/Footer.astro`:

```astro
---
import { site } from '../config/site';
const year = new Date().getFullYear();
---
<footer>
  <div class="container row">
    <span>© {year} {site.name}</span>
    <span class="links">
      <a href={`mailto:${site.email}`}>Email</a>
      <a href={site.github}>GitHub</a>
      <a href={site.linkedin}>LinkedIn</a>
      <a href="/rss.xml">RSS</a>
    </span>
  </div>
</footer>

<style>
  footer {
    margin-top: var(--space-8);
    padding: var(--space-5) 0;
    border-top: 1px solid var(--border);
    font-size: 13px;
    color: var(--text-muted);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    justify-content: space-between;
  }
  .links { display: flex; gap: var(--space-4); }
</style>
```

- [ ] **Step 5: Write the page layout**

Create `src/layouts/PageLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import ProfileCard from '../components/ProfileCard.astro';

interface Props {
  title: string;
  description: string;
  sidebar?: boolean;
}

const { title, description, sidebar = true } = Astro.props;
---
<BaseLayout title={title} description={description}>
  <Header />
  <div class="container">
    <div class={sidebar ? 'shell with-sidebar' : 'shell'}>
      {sidebar && <ProfileCard />}
      <main id="main"><slot /></main>
    </div>
  </div>
  <Footer />
</BaseLayout>

<style>
  .shell { padding: var(--space-6) 0; }
  .with-sidebar {
    display: grid;
    grid-template-columns: var(--sidebar) minmax(0, 1fr);
    gap: var(--space-6);
    align-items: start;
  }
  main { min-width: 0; }

  @media (max-width: 860px) {
    .with-sidebar { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 6: Point the index page at the new layout**

Replace `src/pages/index.astro`:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import { site } from '../config/site';
---
<PageLayout title={site.name} description={site.blurb}>
  <h1>Placeholder — replaced in Task 5</h1>
</PageLayout>
```

- [ ] **Step 7: Verify**

Run: `npx astro check && npm run build && npm run preview`
Expected: `0 errors`, build exits 0. In the preview: the profile card sits left with the content right; at a 375px viewport the card stacks above the content; header nav scrolls horizontally rather than wrapping; the toggle still works. Stop the preview server.

- [ ] **Step 8: Commit**

```bash
git add src/components src/layouts/PageLayout.astro src/pages/index.astro src/assets public/favicon.svg
git commit -m "feat: add profile card, header, footer, and two-column page layout"
```

---

### Task 5: The hub landing page

**Files:**
- Create: `src/components/StatTile.astro`
- Create: `src/components/EntryTile.astro`
- Modify: `src/pages/index.astro` (full replacement)

**Interfaces:**
- Consumes: `PageLayout` (Task 4), `site` (Task 3), the `projects` and `posts` collections (Task 3 — both may be empty at this point and the page must still render).
- Produces: `<StatTile value label />` and `<EntryTile href title blurb />`.

- [ ] **Step 1: Write StatTile**

Create `src/components/StatTile.astro`:

```astro
---
interface Props { value: string; label: string; }
const { value, label } = Astro.props;
---
<div class="stat">
  <b>{value}</b>
  <span>{label}</span>
</div>

<style>
  .stat b {
    display: block;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--accent);
    line-height: 1.1;
  }
  .stat span {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text-muted);
  }
</style>
```

- [ ] **Step 2: Write EntryTile**

Create `src/components/EntryTile.astro`:

```astro
---
interface Props { href: string; title: string; blurb: string; }
const { href, title, blurb } = Astro.props;
---
<a class="card tile" href={href}>
  <b>{title}</b>
  <span>{blurb}</span>
  <i aria-hidden="true">→</i>
</a>

<style>
  .tile {
    display: block;
    padding: var(--space-4);
    text-decoration: none;
    color: inherit;
  }
  .tile:hover { border-color: var(--accent); }
  b { display: block; font-size: 15px; font-weight: 700; }
  span { display: block; margin-top: 2px; font-size: 13px; color: var(--text-muted); }
  i {
    display: block;
    margin-top: var(--space-3);
    font-style: normal;
    font-weight: 800;
    color: var(--accent);
  }
</style>
```

- [ ] **Step 3: Write the landing page**

Replace `src/pages/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../layouts/PageLayout.astro';
import StatTile from '../components/StatTile.astro';
import EntryTile from '../components/EntryTile.astro';
import { site } from '../config/site';

const featured = (await getCollection('projects', ({ data }) => data.featured)).sort(
  (a, b) => a.data.order - b.data.order,
);

const latest = (await getCollection('posts', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);

const fmt = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
---
<PageLayout title={`${site.name} — ${site.role}`} description={site.blurb}>
  <section class="hero">
    <h1>
      {site.name.split(' ').slice(-2).join(' ')}<br />
      <em>{site.tagline}</em>
    </h1>
    <p class="blurb">{site.blurb}</p>
    <div class="stats">
      {site.stats.map((s) => <StatTile value={s.value} label={s.label} />)}
    </div>
  </section>

  <section>
    <p class="eyebrow">Go to</p>
    <div class="tiles">
      <EntryTile href="/work" title="Work" blurb="Research & projects" />
      <EntryTile href="/resume" title="Résumé" blurb="EN / VI · PDF" />
      <EntryTile href="/blog" title="Blog" blurb="Notes & papers" />
    </div>
  </section>

  {featured.length > 0 && (
    <section>
      <p class="eyebrow">Featured</p>
      <div class="tiles two">
        {featured.map((p) => (
          <a class="card tile" href={`/work/${p.id}`}>
            <b>{p.data.title}</b>
            <span>{p.data.summary}</span>
          </a>
        ))}
      </div>
    </section>
  )}

  {latest.length > 0 && (
    <section>
      <p class="eyebrow">Latest writing</p>
      <ul class="posts">
        {latest.map((post) => (
          <li>
            <a href={`/blog/${post.id}`}>{post.data.title}</a>
            <time datetime={post.data.date.toISOString()}>{fmt(post.data.date)}</time>
          </li>
        ))}
      </ul>
    </section>
  )}
</PageLayout>

<style>
  section { margin-bottom: var(--space-7); }
  h1 {
    margin: 0;
    font-size: clamp(32px, 6vw, 46px);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.05;
  }
  h1 em { font-style: normal; color: var(--accent); }
  .blurb {
    max-width: 56ch;
    margin: var(--space-4) 0 0;
    color: var(--text-muted);
  }
  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
    margin-top: var(--space-5);
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3);
  }
  .tiles.two { grid-template-columns: repeat(2, 1fr); }
  .tile {
    display: block;
    padding: var(--space-4);
    text-decoration: none;
    color: inherit;
  }
  .tile:hover { border-color: var(--accent); }
  .tile b { display: block; font-size: 15px; font-weight: 700; }
  .tile span { display: block; margin-top: 2px; font-size: 13px; color: var(--text-muted); }
  .posts { list-style: none; margin: 0; padding: 0; }
  .posts li {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--border);
  }
  .posts a { font-weight: 600; text-decoration: none; color: var(--text); }
  .posts a:hover { color: var(--accent); }
  .posts time { flex: none; font-size: 13px; color: var(--text-muted); }

  @media (max-width: 640px) {
    .tiles, .tiles.two { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 4: Verify with empty collections**

Run: `npx astro check && npm run build`
Expected: `0 errors`, build exits 0, and `dist/index.html` renders the hero, stats and three tiles. The Featured and Latest sections are absent — correct, since both collections are still empty.

- [ ] **Step 5: Commit**

```bash
git add src/components/StatTile.astro src/components/EntryTile.astro src/pages/index.astro
git commit -m "feat: build hub landing page with stats and entry tiles"
```

---

### Task 6: The résumé page

**Files:**
- Create: `src/pages/resume.astro`
- Add: `public/files/resume-en.pdf`, `public/files/resume-vi.pdf`

**Interfaces:**
- Consumes: the `resume` collection (Task 3), `PageLayout` with `sidebar={false}` (Task 4).
- Produces: `/resume`, rendering both languages into the DOM with one hidden, switched by two buttons. Both language versions ship in the HTML so the switch needs no navigation and search engines index both.

- [ ] **Step 1: Copy the PDFs into place**

```bash
mkdir -p public/files
cp "D:/Local Data/Resume/work/resume-full.pdf" public/files/resume-en.pdf
cp "D:/Local Data/Resume/work/resume-full.pdf" public/files/resume-vi.pdf
```

Both point at the same bilingual PDF for now. Replace with separate exports when they exist.

- [ ] **Step 2: Write the résumé page**

Create `src/pages/resume.astro`:

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../layouts/PageLayout.astro';
import { site } from '../config/site';

const entries = await getCollection('resume');
const ordered = ['en', 'vi']
  .map((lang) => entries.find((e) => e.data.lang === lang))
  .filter((e): e is NonNullable<typeof e> => Boolean(e));
---
<PageLayout title={`Résumé — ${site.name}`} description={`Full résumé of ${site.name}, AI Engineer and AI Researcher.`} sidebar={false}>
  <div class="head">
    <h1>Résumé</h1>
    <div class="controls">
      <div class="langs" role="group" aria-label="Résumé language">
        {ordered.map((entry, i) => (
          <button type="button" class:list={['lang', { on: i === 0 }]} data-lang={entry.data.lang}>
            {entry.data.label}
          </button>
        ))}
      </div>
      {ordered.map((entry, i) => (
        <a class:list={['pdf', { hidden: i !== 0 }]} data-pdf={entry.data.lang} href={entry.data.pdf} download>
          Download PDF
        </a>
      ))}
    </div>
  </div>

  {ordered.map((entry, i) => (
    <article class:list={['sheet', { hidden: i !== 0 }]} data-sheet={entry.data.lang} lang={entry.data.lang}>
      <p class="headline">{entry.data.headline}</p>
      <p class="summary">{entry.data.summary}</p>

      {entry.data.sections.map((section) => (
        <section>
          <h2>{section.heading}</h2>

          {section.kind === 'entries' &&
            section.entries.map((item) => (
              <div class="item">
                <div class="row">
                  <h3>
                    {item.title}
                    {item.subtitle && <span class="sub"> — {item.subtitle}</span>}
                  </h3>
                  <span class="date">{item.date}</span>
                </div>
                {item.meta && <p class="meta">{item.meta}</p>}
                {item.bullets.length > 0 && (
                  <ul>{item.bullets.map((b) => <li>{b}</li>)}</ul>
                )}
              </div>
            ))}

          {section.kind === 'skills' && (
            <dl class="skills">
              {section.skills.map((s) => (
                <>
                  <dt>{s.group}</dt>
                  <dd>{s.items}</dd>
                </>
              ))}
            </dl>
          )}

          {section.kind === 'list' && (
            <ul>{section.list.map((l) => <li>{l}</li>)}</ul>
          )}
        </section>
      ))}
    </article>
  ))}
</PageLayout>

<style>
  .head {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-6);
  }
  h1 { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; }
  .controls { display: flex; gap: var(--space-3); align-items: center; }
  .langs { display: flex; gap: 4px; }
  .lang {
    padding: 6px 12px;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 999px;
    cursor: pointer;
  }
  .lang.on {
    color: #fff;
    background: var(--accent);
    border-color: var(--accent);
  }
  :global(:root[data-theme='dark']) .lang.on { color: #0d1117; }
  .pdf {
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
    background: var(--accent-soft);
    border-radius: 999px;
    text-decoration: none;
  }
  .hidden { display: none; }

  .headline { margin: 0; font-weight: 700; color: var(--accent); }
  .summary { max-width: 72ch; color: var(--text-muted); }
  section { margin-top: var(--space-6); }
  h2 {
    margin: 0 0 var(--space-4);
    padding-bottom: var(--space-2);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
  }
  .item { margin-bottom: var(--space-5); }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    justify-content: space-between;
    align-items: baseline;
  }
  h3 { margin: 0; font-size: 16px; font-weight: 700; }
  .sub { font-weight: 500; color: var(--text-muted); }
  .date { flex: none; font-size: 13px; color: var(--text-muted); }
  .meta { margin: 2px 0 var(--space-2); font-size: 14px; color: var(--text-muted); }
  ul { margin: var(--space-2) 0 0; padding-left: 1.1em; }
  li { margin-bottom: var(--space-2); }
  .skills {
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr);
    gap: var(--space-2) var(--space-4);
    margin: 0;
  }
  .skills dt { font-weight: 700; }
  .skills dd { margin: 0; color: var(--text-muted); }

  @media (max-width: 640px) {
    .skills { grid-template-columns: 1fr; gap: 0 0; }
    .skills dd { margin-bottom: var(--space-3); }
  }
</style>

<script>
  const buttons = document.querySelectorAll<HTMLButtonElement>('.lang');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;
      buttons.forEach((b) => b.classList.toggle('on', b === button));
      document.querySelectorAll<HTMLElement>('[data-sheet]').forEach((sheet) => {
        sheet.classList.toggle('hidden', sheet.dataset.sheet !== lang);
      });
      document.querySelectorAll<HTMLElement>('[data-pdf]').forEach((link) => {
        link.classList.toggle('hidden', link.dataset.pdf !== lang);
      });
    });
  });
</script>
```

- [ ] **Step 3: Verify**

Run: `npx astro check && npm run build && npm run preview`
Expected: `0 errors`, build exits 0. At `/resume`: English renders by default; clicking "Tiếng Việt" swaps every section and the PDF link; Vietnamese diacritics render correctly; the Download PDF link serves `/files/resume-en.pdf`. Stop the preview server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/resume.astro public/files
git commit -m "feat: add bilingual résumé page with PDF download"
```

---

### Task 7: Deploy to GitHub Pages and Cloudflare Pages

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

**Interfaces:**
- Consumes: everything through Task 6.
- Produces: a live site at `https://htrung1105.github.io` and a Cloudflare Pages project building from the same repository.

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

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
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Build site
        uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Write the README**

Create `README.md`:

```markdown
# htrung1105.github.io

Personal portfolio of Nguyen Le Hoang Trung — AI Engineer and AI Researcher.

Built with [Astro](https://astro.build). Content lives in typed collections under
`src/content/` and `src/data/`; a malformed entry fails the build.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built site
npx astro check  # types + content schemas
```

## Deploy

Pushing to `main` deploys to both hosts:

- **Cloudflare Pages** (primary) — builds from this repo.
- **GitHub Pages** (backup) — via `.github/workflows/deploy.yml`.

## Structure

| Path | Holds |
| --- | --- |
| `src/config/site.ts` | Name, contacts, headline stats |
| `src/data/resume/` | Résumé data, EN and VI |
| `src/content/projects/` | Case studies |
| `src/content/publications/` | Papers |
| `src/content/posts/` | Blog posts |
| `src/content/gallery/` | Photographs |
```

- [ ] **Step 3: Commit and push**

```bash
git add .github README.md
git commit -m "ci: deploy to GitHub Pages on push to main"
git branch -M main
git remote add origin https://github.com/htrung1105/htrung1105.github.io.git
git push -u origin main
```

If the repository does not exist yet, create it first at
`https://github.com/new` named exactly `htrung1105.github.io`, public, with no
README, `.gitignore`, or licence.

- [ ] **Step 4: Enable GitHub Pages**

In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
Then open the **Actions** tab and wait for the run to finish.

Expected: a green run, and `https://htrung1105.github.io` serves the landing page.

- [ ] **Step 5: Connect Cloudflare Pages**

At `dash.cloudflare.com` → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**,
select `htrung1105.github.io` and set:

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`

Expected: the build succeeds and a `*.pages.dev` URL serves the same site. A custom
domain is deliberately not attached yet.

- [ ] **Step 6: Verify both deployments**

Open both URLs. Expected on each: the landing page renders, `/resume` works, the
language switch works, and the theme toggle persists across a reload.

---

### Task 8: Work index and project content

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/TagFilter.astro`
- Create: `src/pages/work/index.astro`
- Create: `src/content/projects/vietlegal-graphrag.md`
- Create: `src/content/projects/tradingclaw.md`
- Create: `src/content/projects/sino-nom-ocr.md`

**Interfaces:**
- Consumes: the `projects` collection (Task 3), `PageLayout` (Task 4).
- Produces: `<ProjectCard project={entry} />` where `entry` is a `CollectionEntry<'projects'>`; `<TagFilter tags={string[]} />` which filters elements carrying `data-tags` within the same page.

- [ ] **Step 1: Write the three project entries**

Create `src/content/projects/vietlegal-graphrag.md`:

```markdown
---
title: Vietnamese Legal GraphRAG
role: AI / Full-stack Engineer
period: Apr 2026 – Present
summary: A GraphRAG system that maps Vietnamese legal text into a knowledge graph and answers questions with transparent citations.
repo: https://github.com/ductai05/VietLegalGraphRAG
tags: [GraphRAG, LLM, OCR, Neo4j, FastAPI]
metrics:
  - value: 7.4M
    label: legal articles indexed
  - value: 350K
    label: document chunks
featured: true
order: 1
---

## Problem

Vietnamese legal text is dense, cross-referential, and written for lawyers. A citizen
asking a plain question gets either an unusable wall of statute or a confident answer
with no provenance.

## Approach

The pipeline maps statutes into a knowledge graph, so retrieval follows the citation
structure rather than guessing from surface similarity. Domain jargon is resolved with
`vietlegal-harrier` embeddings, and an LLM adapts the register of the answer to the
reader's role.

A separate module handles scanned contracts: PaddleOCR extracts the text, and the same
retrieval stack assesses legal risk against it.

## Results

Over 7.4 million legal articles and 350K document chunks are indexed. Answers are served
through FastAPI microservices and carry citations back to the source statute.
```

Create `src/content/projects/tradingclaw.md`:

```markdown
---
title: TradingClaw
role: AI / Backend Engineer
period: Apr 2026 – Present
summary: A LangGraph multi-agent system that searches the live web, analyses market behaviour, and explains its predictions.
repo: https://github.com/ductai05/TradingClaw
tags: [LangGraph, Multi-agent, XAI, PostgreSQL, FastAPI]
metrics: []
featured: true
order: 2
---

## Problem

Trading models predict well and explain nothing. A number with no reasoning behind it is
not something anyone should act on.

## Approach

Specialised LangGraph agents split the work: one searches the live web, another analyses
market behaviour. XAI techniques turn the resulting black-box predictions into stated
reasons a person can weigh.

## Results

FastAPI microservices backed by PostgreSQL handle high-frequency data streams, user
state, and per-call API cost metrics.
```

Create `src/content/projects/sino-nom-ocr.md`:

```markdown
---
title: Sino-Nom / Chinese OCR
role: ML Engineer
period: Nov 2025 – Dec 2025
summary: Fine-tuned PP-OCRv5 text detection on degraded historical Sino-Nom documents, lifting H-mean by 30.2 points.
repo: https://github.com/ductai05/NLP-ChineseOCR
tags: [OCR, PaddlePaddle, Computer Vision, Go]
metrics:
  - value: +30.2%
    label: H-mean (0.731 → 0.952)
  - value: '0.966'
    label: precision
  - value: 3.4K
    label: document images
featured: true
order: 3
---

## Problem

Off-the-shelf detection fails on heavily degraded Sino-Nom characters. Historical scans
carry bleed-through, faded strokes, and irregular column layout that modern training
data never covers.

## Approach

A concurrent Go crawler collected and preprocessed the CWKB historical dataset — over
3.4K document images. PP-OCRv5 detection (PP-HGNetV2-B4 backbone, DB algorithm) was
fine-tuned on PaddlePaddle GPU, trained across 2× NVIDIA T4 with Cosine Annealing and an
optimised DBLoss.

## Results

H-mean improved by 30.2 points, from 0.731 to 0.952, at 0.966 precision on the NomNaOCR
benchmark.
```

- [ ] **Step 2: Write ProjectCard**

Create `src/components/ProjectCard.astro`:

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props { project: CollectionEntry<'projects'>; }
const { project } = Astro.props;
const { title, role, period, summary, tags, metrics } = project.data;
---
<article class="card project" data-tags={tags.join(',')}>
  <a href={`/work/${project.id}`} class="title">{title}</a>
  <p class="meta">{role} · {period}</p>
  <p class="summary">{summary}</p>

  {metrics.length > 0 && (
    <div class="metrics">
      {metrics.map((m) => (
        <div><b>{m.value}</b><span>{m.label}</span></div>
      ))}
    </div>
  )}

  <div class="tags">
    {tags.map((tag) => <span class="tag">{tag}</span>)}
  </div>
</article>

<style>
  .project { padding: var(--space-5); }
  .title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    text-decoration: none;
    color: var(--text);
  }
  .title:hover { color: var(--accent); }
  .meta { margin: 2px 0 var(--space-3); font-size: 13px; color: var(--text-muted); }
  .summary { margin: 0; color: var(--text-muted); }
  .metrics { display: flex; flex-wrap: wrap; gap: var(--space-5); margin: var(--space-4) 0; }
  .metrics b { display: block; font-size: 18px; font-weight: 800; color: var(--accent); }
  .metrics span { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
  .tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-3); }
  .tag {
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-soft);
    border-radius: 999px;
    padding: 3px 9px;
  }
</style>
```

- [ ] **Step 3: Write TagFilter**

Create `src/components/TagFilter.astro`. It filters any sibling element carrying a
`data-tags` attribute, so `/work` and `/blog` can both use it:

```astro
---
interface Props { tags: string[]; }
const { tags } = Astro.props;
---
<div class="filter" role="group" aria-label="Filter by tag">
  <button type="button" class="chip on" data-tag="all">All</button>
  {tags.map((tag) => <button type="button" class="chip" data-tag={tag}>{tag}</button>)}
</div>

<style>
  .filter { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-5); }
  .chip {
    padding: 5px 12px;
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 999px;
    cursor: pointer;
  }
  .chip:hover { color: var(--text); }
  .chip.on {
    color: #fff;
    background: var(--accent);
    border-color: var(--accent);
  }
  :global(:root[data-theme='dark']) .chip.on { color: #0d1117; }
</style>

<script>
  const chips = document.querySelectorAll<HTMLButtonElement>('.chip');
  const items = document.querySelectorAll<HTMLElement>('[data-tags]');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const tag = chip.dataset.tag;
      chips.forEach((c) => c.classList.toggle('on', c === chip));
      items.forEach((item) => {
        const list = (item.dataset.tags ?? '').split(',');
        item.hidden = tag !== 'all' && !list.includes(tag!);
      });
    });
  });
</script>
```

- [ ] **Step 4: Write the work index**

Create `src/pages/work/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../../layouts/PageLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import TagFilter from '../../components/TagFilter.astro';

const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
const tags = [...new Set(projects.flatMap((p) => p.data.tags))].sort();
---
<PageLayout title="Work — Nguyen Le Hoang Trung" description="Research and engineering projects in multimodal retrieval, LLMs, and OCR.">
  <h1>Work</h1>
  <p class="lede">Research and engineering projects, most recent first.</p>

  <TagFilter tags={tags} />

  <div class="grid">
    {projects.map((project) => <ProjectCard project={project} />)}
  </div>
</PageLayout>

<style>
  h1 { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; }
  .lede { margin: var(--space-2) 0 var(--space-5); color: var(--text-muted); }
  .grid { display: grid; gap: var(--space-4); }
</style>
```

- [ ] **Step 5: Verify**

Run: `npx astro check && npm run build && npm run preview`
Expected: `0 errors`, build exits 0. At `/work`: three project cards render, the tag chips filter them, "All" restores every card. At `/`: the Featured section now shows all three projects. Stop the preview server.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectCard.astro src/components/TagFilter.astro src/pages/work src/content/projects
git commit -m "feat: add work index with tag filtering and three project entries"
```

---

### Task 9: Case study pages and prose styling

**Files:**
- Create: `src/styles/prose.css`
- Create: `src/pages/work/[...slug].astro`

**Interfaces:**
- Consumes: the `projects` collection (Task 3), `PageLayout` with `sidebar={false}` (Task 4).
- Produces: a static route per project at `/work/<id>`, and a `.prose` class usable by Task 12's blog post route.

- [ ] **Step 1: Write the prose stylesheet**

Create `src/styles/prose.css`:

```css
.prose {
  max-width: 72ch;
  font-size: 17px;
  line-height: 1.7;
}
.prose > * + * { margin-top: var(--space-4); }
.prose h2 {
  margin-top: var(--space-7);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.prose h3 {
  margin-top: var(--space-6);
  font-size: 18px;
  font-weight: 700;
}
.prose ul,
.prose ol { padding-left: 1.2em; }
.prose li + li { margin-top: var(--space-2); }
.prose code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--accent-soft);
  border-radius: 4px;
  padding: 2px 5px;
}
.prose pre {
  overflow-x: auto;
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.prose pre code {
  background: none;
  padding: 0;
}
.prose blockquote {
  margin-left: 0;
  padding-left: var(--space-4);
  border-left: 3px solid var(--accent);
  color: var(--text-muted);
}
.prose img { border-radius: var(--radius-sm); }
.prose table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}
.prose th,
.prose td {
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border);
  text-align: left;
}
```

Shiki emits both light and dark themes (configured in Task 1). Add the theme switch
rule to the same file:

```css
:root[data-theme='dark'] .astro-code,
:root[data-theme='dark'] .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

- [ ] **Step 2: Write the case study route**

Create `src/pages/work/[...slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';
import PageLayout from '../../layouts/PageLayout.astro';
import '../../styles/prose.css';

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.id },
    props: { project },
  }));
};

const { project } = Astro.props;
const { Content } = await render(project);
const { title, role, period, summary, repo, demo, tags, metrics } = project.data;
---
<PageLayout title={`${title} — Nguyen Le Hoang Trung`} description={summary} sidebar={false}>
  <a class="back" href="/work">← Work</a>

  <header class="head">
    <h1>{title}</h1>
    <p class="meta">{role} · {period}</p>
    <div class="links">
      {repo && <a href={repo}>Repository</a>}
      {demo && <a href={demo}>Live demo</a>}
    </div>
    <div class="tags">{tags.map((tag) => <span class="tag">{tag}</span>)}</div>
  </header>

  {metrics.length > 0 && (
    <div class="metrics card">
      {metrics.map((m) => (
        <div><b>{m.value}</b><span>{m.label}</span></div>
      ))}
    </div>
  )}

  <div class="prose"><Content /></div>
</PageLayout>

<style>
  .back { font-size: 13px; font-weight: 600; text-decoration: none; }
  .head { margin: var(--space-4) 0 var(--space-6); }
  h1 { margin: 0; font-size: clamp(28px, 5vw, 38px); font-weight: 800; letter-spacing: -0.03em; }
  .meta { margin: var(--space-2) 0 0; color: var(--text-muted); }
  .links { display: flex; gap: var(--space-4); margin-top: var(--space-3); font-size: 14px; font-weight: 600; }
  .tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-3); }
  .tag {
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-soft);
    border-radius: 999px;
    padding: 3px 9px;
  }
  .metrics {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
    padding: var(--space-4) var(--space-5);
    margin-bottom: var(--space-6);
  }
  .metrics b { display: block; font-size: 22px; font-weight: 800; color: var(--accent); }
  .metrics span { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
</style>
```

- [ ] **Step 3: Verify**

Run: `npx astro check && npm run build`
Expected: `0 errors`, build exits 0, and `dist/work/vietlegal-graphrag/index.html`,
`dist/work/tradingclaw/index.html`, `dist/work/sino-nom-ocr/index.html` all exist.

Run `npm run preview` and open `/work/sino-nom-ocr`. Expected: the metric strip shows
`+30.2%`, `0.966`, `3.4K`; headings and body text render at a comfortable measure; the
"← Work" link returns to the index. Stop the preview server.

- [ ] **Step 4: Commit**

```bash
git add src/styles/prose.css src/pages/work/[...slug].astro
git commit -m "feat: add case study pages with prose styling"
```

---

### Task 10: Publications page

**Files:**
- Create: `src/pages/publications.astro`
- Create: `src/content/publications/kpter.md`

**Interfaces:**
- Consumes: the `publications` collection (Task 3), `PageLayout` (Task 4).
- Produces: `/publications`.

- [ ] **Step 1: Write the KPTER entry**

Create `src/content/publications/kpter.md`:

```markdown
---
title: 'KPTER: K-Pointer for Temporal Event Retrieval'
venue: SOICT 2025
year: 2025
authors:
  - Nguyen Le Hoang Trung
  - Team WATLERE
award: Best Presentation Award
abstract: A sequential re-ranking algorithm for temporal event retrieval, paired with Weighted Reciprocal Rank Fusion, evaluated within a zero-shot multimodal retrieval framework combining OCR, ASR, semantic embeddings, and open-vocabulary object detection.
code: https://github.com/htrung1105
---

KPTER addresses temporal alignment in video event retrieval: given a natural-language
description of an event, find not just the right video but the right moment in it.

The K-Pointer algorithm re-ranks candidates sequentially rather than scoring them
independently, and Weighted Reciprocal Rank Fusion (WRRF) combines evidence across
modalities without requiring a trained fusion model.

The surrounding pipeline is zero-shot end to end, integrating OCR, ASR, semantic
embeddings, and open-vocabulary object detection.

Presented at SOICT 2025, where it received the Best Presentation Award. The same system
placed in the top 12 of more than 80 teams at AI Challenge HCMC 2025.
```

- [ ] **Step 2: Write the publications page**

Create `src/pages/publications.astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import PageLayout from '../layouts/PageLayout.astro';
import '../styles/prose.css';

const publications = (await getCollection('publications')).sort((a, b) => b.data.year - a.data.year);
const rendered = await Promise.all(
  publications.map(async (entry) => ({ entry, Content: (await render(entry)).Content })),
);
---
<PageLayout title="Publications — Nguyen Le Hoang Trung" description="Papers and research output in multimodal retrieval and OCR.">
  <h1>Publications</h1>
  <p class="lede">Peer-reviewed and competition research output.</p>

  {rendered.map(({ entry, Content }) => (
    <article class="card pub">
      <div class="row">
        <h2>{entry.data.title}</h2>
        <span class="year">{entry.data.year}</span>
      </div>
      <p class="venue">
        {entry.data.venue}
        {entry.data.award && <span class="award">{entry.data.award}</span>}
      </p>
      <p class="authors">{entry.data.authors.join(', ')}</p>
      <p class="abstract">{entry.data.abstract}</p>

      <div class="links">
        {entry.data.pdf && <a href={entry.data.pdf}>PDF</a>}
        {entry.data.code && <a href={entry.data.code}>Code</a>}
        {entry.data.slides && <a href={entry.data.slides}>Slides</a>}
      </div>

      <details>
        <summary>More detail</summary>
        <div class="prose"><Content /></div>
      </details>
    </article>
  ))}
</PageLayout>

<style>
  h1 { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; }
  .lede { margin: var(--space-2) 0 var(--space-5); color: var(--text-muted); }
  .pub { padding: var(--space-5); margin-bottom: var(--space-4); }
  .row { display: flex; gap: var(--space-4); justify-content: space-between; align-items: baseline; }
  h2 { margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.02em; }
  .year { flex: none; font-size: 13px; color: var(--text-muted); }
  .venue { margin: var(--space-2) 0 0; font-size: 14px; font-weight: 600; }
  .award {
    margin-left: var(--space-2);
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 700;
    color: var(--accent);
    background: var(--accent-soft);
    border-radius: 999px;
  }
  .authors { margin: 2px 0 var(--space-3); font-size: 13px; color: var(--text-muted); }
  .abstract { margin: 0; color: var(--text-muted); }
  .links { display: flex; gap: var(--space-4); margin-top: var(--space-3); font-size: 14px; font-weight: 600; }
  details { margin-top: var(--space-4); }
  summary { cursor: pointer; font-size: 14px; font-weight: 600; color: var(--accent); }
  details .prose { margin-top: var(--space-3); font-size: 15px; }
</style>
```

- [ ] **Step 3: Verify**

Run: `npx astro check && npm run build && npm run preview`
Expected: `0 errors`, build exits 0. At `/publications`: the KPTER entry renders with
the "Best Presentation Award" badge, and "More detail" expands the body text. Stop the
preview server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/publications.astro src/content/publications
git commit -m "feat: add publications page"
```

---

### Task 11: Blog index

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/content/posts/kpter-wrrf.md` (one seed post so the page has content)

**Interfaces:**
- Consumes: the `posts` collection (Task 3), `TagFilter` (Task 8), `PageLayout` (Task 4).
- Produces: `/blog`, filtered by category. `<PostCard post={entry} />` takes a `CollectionEntry<'posts'>` and emits `data-tags` holding the category, so `TagFilter` drives it unchanged.

- [ ] **Step 1: Write the seed post**

Create `src/content/posts/kpter-wrrf.md`:

```markdown
---
title: Why Weighted RRF beat naive score fusion for us
date: 2026-03-15
category: project
tags: [Retrieval, Multimodal]
excerpt: Combining OCR, ASR, and embedding scores by summing them looked reasonable and performed badly. Rank fusion fixed it, and here is why.
draft: false
---

## The setup

KPTER retrieves video moments from natural-language descriptions. Evidence arrives from
four places: OCR on frames, ASR on audio, semantic embeddings, and open-vocabulary object
detection. Each returns a ranked list with its own score.

## What went wrong with score fusion

Summing raw scores assumes they share a scale. They do not. OCR confidence and cosine
similarity mean different things, and their distributions differ in both spread and shape.
Normalising per query helped a little, then broke on queries where one modality returned
nothing — the normaliser amplified noise into confident-looking evidence.

## Rank fusion

Reciprocal Rank Fusion sidesteps the problem by discarding scores and keeping only
positions. A document's fused score is the sum over lists of `1 / (k + rank)`. Scale
mismatch disappears because rank has no scale.

Weighting the per-list contribution recovers what plain RRF throws away — the knowledge
that some modalities are more reliable than others for a given query type.

## What we would check next

The weights are currently fixed. Learning them per query type is the obvious next step,
and the obvious risk is overfitting to the competition distribution.
```

- [ ] **Step 2: Write PostCard**

Create `src/components/PostCard.astro`:

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props { post: CollectionEntry<'posts'>; }
const { post } = Astro.props;
const { title, date, category, tags, excerpt } = post.data;

const labels: Record<typeof category, string> = {
  project: 'Project',
  paper: 'Paper',
  career: 'Career',
};

const formatted = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
---
<article class="card post" data-tags={category}>
  <div class="row">
    <span class="cat">{labels[category]}</span>
    <time datetime={date.toISOString()}>{formatted}</time>
  </div>
  <a class="title" href={`/blog/${post.id}`}>{title}</a>
  <p class="excerpt">{excerpt}</p>
  <div class="tags">{tags.map((tag) => <span class="tag">{tag}</span>)}</div>
</article>

<style>
  .post { padding: var(--space-5); }
  .row { display: flex; gap: var(--space-3); align-items: center; margin-bottom: var(--space-3); }
  .cat {
    font-size: 11px;
    font-weight: 700;
    color: var(--accent);
    background: var(--accent-soft);
    border-radius: 999px;
    padding: 3px 9px;
  }
  time { font-size: 12px; color: var(--text-muted); }
  .title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    text-decoration: none;
    color: var(--text);
  }
  .title:hover { color: var(--accent); }
  .excerpt { margin: var(--space-2) 0 0; color: var(--text-muted); }
  .tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-3); }
  .tag { font-size: 11px; font-weight: 600; color: var(--text-muted); }
</style>
```

- [ ] **Step 3: Write the blog index**

Create `src/pages/blog/index.astro`. Drafts are excluded from production builds but kept
visible in `dev` so work in progress is previewable:

```astro
---
import { getCollection } from 'astro:content';
import PageLayout from '../../layouts/PageLayout.astro';
import PostCard from '../../components/PostCard.astro';
import TagFilter from '../../components/TagFilter.astro';

const posts = (await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft)).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);

const categories = [...new Set(posts.map((p) => p.data.category))];
---
<PageLayout title="Blog — Nguyen Le Hoang Trung" description="Project write-ups, paper notes, and career posts on AI and retrieval.">
  <h1>Blog</h1>
  <p class="lede">Project write-ups, paper notes, and the occasional career post.</p>

  <TagFilter tags={categories} />

  <div class="grid">
    {posts.map((post) => <PostCard post={post} />)}
  </div>

  {posts.length === 0 && <p class="empty">No posts yet.</p>}
</PageLayout>

<style>
  h1 { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; }
  .lede { margin: var(--space-2) 0 var(--space-5); color: var(--text-muted); }
  .grid { display: grid; gap: var(--space-4); }
  .empty { color: var(--text-muted); }
</style>
```

- [ ] **Step 4: Verify**

Run: `npx astro check && npm run build && npm run preview`
Expected: `0 errors`, build exits 0. At `/blog`: the seed post renders with a "Project"
badge; clicking the `project` chip keeps it, and the other chips hide it. At `/`: the
Latest writing section now lists it. Stop the preview server.

- [ ] **Step 5: Commit**

```bash
git add src/components/PostCard.astro src/pages/blog/index.astro src/content/posts
git commit -m "feat: add blog index with category filtering"
```

---

### Task 12: Blog post pages and RSS

**Files:**
- Create: `src/pages/blog/[...slug].astro`
- Create: `src/pages/rss.xml.ts`

**Interfaces:**
- Consumes: the `posts` collection (Task 3), `prose.css` (Task 9), `PageLayout` with `sidebar={false}` (Task 4).
- Produces: a static route per post at `/blog/<id>`, and `/rss.xml`.

- [ ] **Step 1: Write the post route**

Create `src/pages/blog/[...slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';
import { Image } from 'astro:assets';
import PageLayout from '../../layouts/PageLayout.astro';
import '../../styles/prose.css';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
};

const { post } = Astro.props;
const { Content } = await render(post);
const { title, date, excerpt, tags, cover, coverAlt } = post.data;

const formatted = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---
<PageLayout title={`${title} — Nguyen Le Hoang Trung`} description={excerpt} sidebar={false}>
  <a class="back" href="/blog">← Blog</a>

  <header class="head">
    <h1>{title}</h1>
    <time datetime={date.toISOString()}>{formatted}</time>
    <div class="tags">{tags.map((tag) => <span class="tag">{tag}</span>)}</div>
  </header>

  {cover && <Image src={cover} alt={coverAlt ?? title} class="cover" />}

  <div class="prose"><Content /></div>
</PageLayout>

<style>
  .back { font-size: 13px; font-weight: 600; text-decoration: none; }
  .head { margin: var(--space-4) 0 var(--space-6); }
  h1 { margin: 0; font-size: clamp(28px, 5vw, 38px); font-weight: 800; letter-spacing: -0.03em; }
  time { display: block; margin-top: var(--space-2); font-size: 14px; color: var(--text-muted); }
  .tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-3); }
  .tag {
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-soft);
    border-radius: 999px;
    padding: 3px 9px;
  }
  .cover { border-radius: var(--radius-md); margin-bottom: var(--space-6); }
</style>
```

- [ ] **Step 2: Write the RSS endpoint**

Create `src/pages/rss.xml.ts`:

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../config/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: `${site.name} — Blog`,
    description: 'Project write-ups, paper notes, and career posts on AI and retrieval.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}
```

- [ ] **Step 3: Verify**

Run: `npx astro check && npm run build`
Expected: `0 errors`, build exits 0, and both `dist/blog/kpter-wrrf/index.html` and
`dist/rss.xml` exist.

Run: `npm run preview`, then open `/rss.xml`.
Expected: valid XML listing the seed post with an absolute `<link>` under
`https://htrung1105.github.io/blog/`. Open `/blog/kpter-wrrf` — headings, body copy and
the "← Blog" link all render. Stop the preview server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/[...slug].astro src/pages/rss.xml.ts
git commit -m "feat: add blog post pages and RSS feed"
```

---

### Task 13: Gallery with lightbox

**Files:**
- Create: `src/components/Lightbox.astro`
- Create: `src/pages/gallery.astro`
- Create: `src/content/gallery/.gitkeep` (already present from Task 3)

**Interfaces:**
- Consumes: the `gallery` collection (Task 3), `PageLayout` (Task 4).
- Produces: `/gallery`. `<Lightbox />` takes no props; it opens any `<button data-full="…" data-caption="…">` on the page.

- [ ] **Step 1: Write the Lightbox**

Create `src/components/Lightbox.astro`:

```astro
---
---
<dialog id="lightbox">
  <button class="close" type="button" aria-label="Close">×</button>
  <img id="lightbox-img" src="" alt="" />
  <p id="lightbox-caption"></p>
</dialog>

<style>
  dialog {
    max-width: min(94vw, 1100px);
    max-height: 92vh;
    padding: var(--space-4);
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }
  dialog::backdrop { background: rgba(0, 0, 0, 0.72); }
  img { display: block; max-height: 76vh; width: auto; border-radius: var(--radius-sm); }
  p { margin: var(--space-3) 0 0; font-size: 14px; color: var(--text-muted); }
  .close {
    position: absolute;
    top: var(--space-2);
    right: var(--space-2);
    width: 32px;
    height: 32px;
    font-size: 20px;
    line-height: 1;
    color: var(--text-muted);
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
  }
</style>

<script>
  const dialog = document.getElementById('lightbox') as HTMLDialogElement | null;
  const image = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const caption = document.getElementById('lightbox-caption');

  document.querySelectorAll<HTMLButtonElement>('[data-full]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (!dialog || !image) return;
      image.src = trigger.dataset.full ?? '';
      image.alt = trigger.dataset.alt ?? '';
      if (caption) caption.textContent = trigger.dataset.caption ?? '';
      dialog.showModal();
    });
  });

  dialog?.querySelector('.close')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
</script>
```

- [ ] **Step 2: Write the gallery page**

Create `src/pages/gallery.astro`. It must render correctly with an empty collection —
the owner supplies photographs later:

```astro
---
import { getCollection } from 'astro:content';
import { Image, getImage } from 'astro:assets';
import PageLayout from '../layouts/PageLayout.astro';
import Lightbox from '../components/Lightbox.astro';

const photos = (await getCollection('gallery')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);

const items = await Promise.all(
  photos.map(async (photo) => ({
    photo,
    full: (await getImage({ src: photo.data.image, format: 'webp', width: 1600 })).src,
  })),
);
---
<PageLayout title="Gallery — Nguyen Le Hoang Trung" description="Photographs from conferences, competitions, and team work.">
  <h1>Gallery</h1>
  <p class="lede">Conferences, competitions, and the people behind the work.</p>

  {items.length === 0 ? (
    <p class="empty">No photographs yet.</p>
  ) : (
    <div class="grid">
      {items.map(({ photo, full }) => (
        <button
          type="button"
          class="shot"
          data-full={full}
          data-alt={photo.data.alt}
          data-caption={photo.data.caption}
        >
          <Image src={photo.data.image} alt={photo.data.alt} width={520} height={390} />
          <span>{photo.data.caption}</span>
        </button>
      ))}
    </div>
  )}

  <Lightbox />
</PageLayout>

<style>
  h1 { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; }
  .lede { margin: var(--space-2) 0 var(--space-5); color: var(--text-muted); }
  .empty { color: var(--text-muted); }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--space-3);
  }
  .shot {
    display: block;
    padding: 0;
    text-align: left;
    background: none;
    border: 0;
    cursor: pointer;
  }
  .shot img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
  }
  .shot span {
    display: block;
    margin-top: var(--space-2);
    font-size: 13px;
    color: var(--text-muted);
  }
  .shot:hover img { border-color: var(--accent); }
</style>
```

- [ ] **Step 3: Verify the empty state, then a populated one**

Run: `npx astro check && npm run build`
Expected: `0 errors`, build exits 0, `/gallery` renders "No photographs yet."

Now prove the populated path works. Place any JPEG at `src/content/gallery/soict.jpg` and
create `src/content/gallery/soict-2025.md`:

```markdown
---
image: ./soict.jpg
alt: Presenting KPTER at SOICT 2025
caption: Presenting KPTER at SOICT 2025
date: 2025-11-20
album: Conferences
---
```

Run: `npm run build && npm run preview`
Expected: the grid shows one photograph; clicking it opens the lightbox; Escape and the
close button both dismiss it; clicking the backdrop dismisses it.

Keep the entry if the photograph is real. If it was a throwaway placeholder, delete both
files before committing.

- [ ] **Step 4: Commit**

```bash
git add src/components/Lightbox.astro src/pages/gallery.astro src/content/gallery
git commit -m "feat: add gallery page with lightbox"
```

---

### Task 14: Contact page, structured data, and launch checks

**Files:**
- Create: `src/pages/contact.astro`
- Create: `public/og-default.png`
- Modify: `src/layouts/BaseLayout.astro` (add JSON-LD)

**Interfaces:**
- Consumes: everything prior.
- Produces: `/contact`, `Person` structured data on every page, and a verified launch state.

- [ ] **Step 1: Write the contact page**

Create `src/pages/contact.astro`:

```astro
---
import PageLayout from '../layouts/PageLayout.astro';
import { site } from '../config/site';

const links = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'GitHub', value: 'github.com/htrung1105', href: site.github },
  { label: 'LinkedIn', value: 'Nguyen Trung', href: site.linkedin },
];
---
<PageLayout title="Contact — Nguyen Le Hoang Trung" description="Get in touch about AI research and engineering internships.">
  <h1>Contact</h1>
  <p class="lede">
    Open to AI Research and AI Engineer internships. Email is the fastest way to reach me.
  </p>

  <ul class="links">
    {links.map((link) => (
      <li class="card">
        <span class="label">{link.label}</span>
        <a href={link.href}>{link.value}</a>
      </li>
    ))}
  </ul>

  <p class="loc">Based in {site.location}.</p>
</PageLayout>

<style>
  h1 { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; }
  .lede { margin: var(--space-2) 0 var(--space-5); max-width: 56ch; color: var(--text-muted); }
  .links { list-style: none; display: grid; gap: var(--space-3); margin: 0; padding: 0; }
  .links li { padding: var(--space-4); }
  .label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 2px;
  }
  .links a { font-weight: 600; overflow-wrap: anywhere; }
  .loc { margin-top: var(--space-5); color: var(--text-muted); }
</style>
```

- [ ] **Step 2: Add JSON-LD to the base layout**

In `src/layouts/BaseLayout.astro`, add the import at the top of the frontmatter:

```astro
import { site as siteInfo } from '../config/site';
```

and this block immediately before `</head>`:

```astro
<script
  type="application/ld+json"
  set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteInfo.name,
    jobTitle: 'AI Engineer, AI Researcher',
    email: `mailto:${siteInfo.email}`,
    url: siteInfo.url,
    sameAs: [siteInfo.github, siteInfo.linkedin],
    address: { '@type': 'PostalAddress', addressLocality: 'Ho Chi Minh City', addressCountry: 'VN' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Science, VNU-HCM' },
    knowsAbout: ['Multimodal Retrieval', 'Large Language Models', 'OCR', 'GraphRAG'],
  })}
/>
```

- [ ] **Step 3: Add a default Open Graph image**

Create a 1200×630 PNG at `public/og-default.png` showing the name, the role line, and the
three headline stats on the indigo accent. Any image editor or a one-off HTML screenshot
is fine — the constraint is the dimensions and legibility at small sizes.

- [ ] **Step 4: Verify the whole site**

Run: `npx astro check && npm run build && npm run preview`

Expected — check each:
- `0 errors` from `astro check`; build exits 0.
- Every nav destination resolves: `/`, `/work`, `/publications`, `/resume`, `/blog`, `/gallery`, `/contact`.
- `dist/sitemap-index.xml` lists all of them.
- View source on any page: the `Person` JSON-LD block is present.
- At 375px width: no horizontal scrollbar on any page.
- Dark mode: every page is legible; no element keeps a light-mode background.
- Keyboard only: Tab reaches every nav link, the theme toggle, the filter chips, and the gallery tiles, with a visible focus ring throughout.

- [ ] **Step 5: Run Lighthouse**

In Chrome DevTools → Lighthouse, run against the preview URL for `/` and `/blog/kpter-wrrf`.
Expected: 95+ in Performance, Accessibility, Best Practices, and SEO.

Record any score below 95 and fix it before committing. The usual culprits are a missing
image dimension (layout shift) or insufficient contrast on muted text.

- [ ] **Step 6: Commit and push**

```bash
git add src/pages/contact.astro src/layouts/BaseLayout.astro public/og-default.png
git commit -m "feat: add contact page, Person structured data, and OG image"
git push
```

- [ ] **Step 7: Verify production**

Wait for both deployments, then open the GitHub Pages URL and the Cloudflare `*.pages.dev`
URL. Expected on both: every route works, the résumé language switch works, the theme
persists across reloads, and `/rss.xml` validates.

---

## Owner-supplied assets still outstanding

These are placeholders after Task 14 and should be replaced before the site is shared:

- `src/assets/portrait.jpg` — real portrait photograph
- `public/files/resume-en.pdf`, `public/files/resume-vi.pdf` — currently both the same bilingual PDF
- `public/og-default.png` — if generated quickly, revisit
- `src/content/gallery/` — real photographs
- Project cover images (`cover` / `coverAlt` in the project frontmatter, currently unused)

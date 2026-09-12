# Portfolio Website — Design Spec

**Date:** 2026-09-12
**Owner:** Nguyen Le Hoang Trung (htrung1105)
**Status:** Approved, ready for implementation planning

## Goal

A personal website that works as a second résumé: it shows who he is, what he has
built, and the measurable results, in a form a recruiter can scan in ten seconds
and a researcher can read in depth. It also gives him a durable place to write.

Source of truth for content: `D:\Local Data\Resume\work\resume-full.html` (EN + VI).

Out of scope for this spec: the GitHub profile revamp and the LinkedIn rewrite.
Those are separate projects, to be done after the site exists so they can link to it.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Framework | Astro | Ships static HTML with near-zero JS; Content Collections give a typed Markdown blog and an academicpages-style publications list without custom code. |
| Visual direction | Modern editorial | Bold type, accent colour, metric tiles. Scannable fast; suits a site that also hosts a blog and gallery. |
| Landing layout | Hub + vCard profile card | Compact landing with three entry tiles, plus a sticky identity card (photo, role, contacts, Download CV) in the left column. Horizontal header nav is kept. |
| Accent | Indigo `#4f46e5` (light) / `#a5b4fc` (dark) | Reads as software/product; passes WCAG AA on both grounds. |
| Theme | Light + dark, user toggle | Default follows `prefers-color-scheme`, choice persisted. |
| Language | English site; `/resume` has EN + VI | Target is international research/AI internships. Blog is not translated. |
| Styling | Plain CSS custom properties + Astro scoped styles | Small site; a utility framework is weight without payoff. |
| Contact | Links only, no form | No backend, no spam, no dependency. |
| Hosting | Cloudflare Pages (primary) **and** GitHub Pages (backup) | One repo, one build artifact, two targets. |
| Domain | Deferred — use `*.pages.dev` for now | `.id.vn` can be attached later without code changes. |
| Repo | `htrung1105.github.io` | Reserves the GitHub Pages vanity URL; base path stays `/`, so one config serves both hosts. |

### Considered and rejected

- **One long scroll landing** — everything on `/`. Familiar, but buries the blog and
  gives project depth no room.
- **Fixed left rail on every page** (vCard / academicpages style) — evaluated with a
  mockup and rejected: he wants the horizontal header kept.
- **Next.js static export** — heavier JS for a text-first site; blog plumbing would be
  hand-built.
- **Shared cPanel hosting** (my.dataonline.vn, zhost) — no CDN, no CI/CD, manual FTP
  deploys, and it cannot run AI demos anyway. Free static hosting is strictly better here.

## Information architecture

| Route | Contents | Profile card? |
| --- | --- | --- |
| `/` | Hero, metric tiles, three entry tiles (Work / Résumé / Blog), featured work, latest posts | Yes |
| `/work` | Grid of research + projects, filterable by tag | Yes |
| `/work/[slug]` | Case study: problem, approach, architecture, results, links | No — full width |
| `/publications` | KPTER and future papers: title, venue, year, authors, award, PDF/code/slides | Yes |
| `/resume` | HTML-rendered résumé, EN/VI switch, Download PDF | No — full width |
| `/blog` | Post list, filter by category (Projects / Papers / Career) | Yes |
| `/blog/[slug]` | Markdown post | No — full width |
| `/gallery` | Image grid with lightbox | Yes |
| `/contact` | Email, GitHub, LinkedIn, Google Scholar | Yes |

Pages that exist to be *read* drop the card and take the full width; pages that exist
to be *browsed* keep it.

## Content model

Astro Content Collections, each with a Zod schema. A schema violation fails the build,
so a malformed entry can never reach production.

| Collection | Entries | Key fields |
| --- | --- | --- |
| `projects` | VietLegalGraphRAG, TradingClaw, Sino-Nom OCR | `title`, `role`, `period`, `repo`, `tags[]`, `metrics[]`, `featured`, `cover` |
| `publications` | KPTER (SOICT 2025) | `title`, `venue`, `year`, `authors[]`, `award`, `pdf`, `code`, `slides` |
| `posts` | Blog | `title`, `date`, `category` (`project` \| `paper` \| `career`), `tags[]`, `excerpt`, `cover`, `draft` |
| `gallery` | Photos | `image`, `caption`, `date`, `album` |
| `resume` | Two data files: EN, VI | `education[]`, `research[]`, `projects[]`, `skills{}`, `awards[]` |

The résumé lives as structured data, not hand-written HTML. `/resume` renders it, and
the landing hero and metric tiles read the same source — one edit updates the whole site.

Images go through `astro:assets` for automatic compression and WebP generation.

## Design system

```
--accent        #4f46e5 light / #a5b4fc dark
--bg --surface --border --text --text-muted
font            system-ui stack (no web font request)
radius          8px / 12px
spacing         4px scale
```

Dark mode sets `data-theme` on `<html>`; an inline `<head>` script applies the stored
choice before first paint to avoid a white flash.

Components: `ProfileCard`, `Header` (nav + theme toggle), `StatTile`, `ProjectCard`,
`PostCard`, `TagFilter`, `Prose`, `Lightbox`.

Client-side JavaScript is limited to three things: the theme toggle, tag filtering,
and the gallery lightbox. Everything else ships as static HTML.

### Accessibility

Indigo `#4f46e5` on white measures 6.9:1, comfortably past WCAG AA. Navigation works
by keyboard, focus rings stay visible, every image carries alt text, and animation
respects `prefers-reduced-motion`.

## Build and deploy

One repository, one build, two hosts:

- **Cloudflare Pages** — connect the repo, `npm run build`, publish `dist/`.
  Primary. Custom domain attached later.
- **GitHub Pages** — `.github/workflows/deploy.yml` using `withastro/action`,
  publishing to `htrung1105.github.io`. Backup, and a free vanity URL.

Because the repo is named `htrung1105.github.io`, the base path is `/` on both hosts,
so a single `astro.config.mjs` covers them. `site` points at the primary URL so
sitemap and canonical links stay correct.

SEO: `@astrojs/sitemap`, an RSS feed for the blog, OG images, and JSON-LD `Person`
markup so a search for his name surfaces the site with structured detail.

## Verification

- `astro check` runs in CI — TypeScript and collection schemas both gate the build.
- Lighthouse run once by hand before launch; target 95+ across all four categories.
- Manual pass: 375px mobile, dark mode, keyboard tab order.

No test framework. The site is static and the collection schemas catch the class of
error that actually occurs here (malformed content entries).

## Phasing

| Phase | Scope | Outcome |
| --- | --- | --- |
| 1 | Astro setup, tokens, layout, `ProfileCard`, `Header`, `/`, `/resume`, both deploy targets | A live site with a link worth sending |
| 2 | `/work` + three case studies, `/publications` | The part of the profile that carries the most weight |
| 3 | `/blog`, `/gallery`, RSS | A place to write over time |

## Assets required from the owner

Text content is derived from the existing résumé. These are not:

- Portrait photo for the profile card
- Cover images for the three projects
- Gallery photographs
- Blog post content

Phase 1 and 2 can proceed with placeholders; the site should not launch publicly
without at least the portrait.

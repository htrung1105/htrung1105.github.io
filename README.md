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

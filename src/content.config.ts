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
      repo: z.url().optional(),
      demo: z.url().optional(),
      paper: z.url().optional(),
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
    code: z.url().optional(),
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

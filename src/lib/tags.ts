import { getCollection } from 'astro:content';

export const tagSlug = (tag: string) =>
  tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Every tag used by projects and published posts, with the entries that carry it. */
export async function getTags() {
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const map = new Map<string, { name: string; projects: typeof projects; posts: typeof posts }>();
  const entry = (name: string) => {
    const slug = tagSlug(name);
    if (!map.has(slug)) map.set(slug, { name, projects: [], posts: [] });
    return map.get(slug)!;
  };
  projects.forEach((p) => p.data.tags.forEach((t) => entry(t).projects.push(p)));
  posts.forEach((p) => p.data.tags.forEach((t) => entry(t).posts.push(p)));
  return [...map.entries()]
    .map(([slug, v]) => ({ slug, ...v, count: v.projects.length + v.posts.length }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

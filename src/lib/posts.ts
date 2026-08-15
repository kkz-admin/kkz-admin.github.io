import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return sortPosts(posts);
}

export function getFeaturedPost(posts: BlogPost[]): BlogPost | undefined {
  return sortPosts(posts.filter(({ data }) => data.featured))[0];
}

export function getRelatedPosts(current: BlogPost, posts: BlogPost[], limit = 2): BlogPost[] {
  return sortPosts(posts.filter(({ id }) => id !== current.id))
    .sort((a, b) => Number(b.data.category === current.data.category) - Number(a.data.category === current.data.category))
    .slice(0, limit);
}

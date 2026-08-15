import { describe, expect, it } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import { getFeaturedPost, getRelatedPosts, sortPosts } from '../../src/lib/posts';

type Post = CollectionEntry<'blog'>;
const post = (id: string, date: string, category: Post['data']['category'], featured = false) => ({
  id,
  collection: 'blog',
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

describe('post queries', () => {
  const posts = [
    post('old', '2026-01-01', '项目复盘'),
    post('featured', '2026-02-01', '项目复盘', true),
    post('new', '2026-03-01', '行业观察'),
  ];

  it('sorts newest first', () => {
    expect(sortPosts(posts).map(({ id }) => id)).toEqual(['new', 'featured', 'old']);
  });

  it('selects the newest featured entry', () => {
    expect(getFeaturedPost(posts)?.id).toBe('featured');
  });

  it('prefers same-category related entries', () => {
    expect(getRelatedPosts(posts[0], posts, 1)[0].id).toBe('featured');
  });
});

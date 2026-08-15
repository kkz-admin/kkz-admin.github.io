import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CollectionEntry } from "astro:content";
import {
  getFeaturedPost,
  getPublishedPosts,
  getRelatedPosts,
  sortPosts,
} from "../../src/lib/posts";

const collectionEntries = vi.hoisted(
  () => [] as Array<{ id: string; data: unknown }>,
);

vi.mock("astro:content", () => ({
  getCollection: vi.fn(
    async (
      _collection: string,
      filter: (entry: { id: string; data: unknown }) => boolean,
    ) => collectionEntries.filter((entry) => filter(entry)),
  ),
}));

type Post = CollectionEntry<"blog">;
const post = (
  id: string,
  date: string,
  category: Post["data"]["category"],
  featured = false,
) =>
  ({
    id,
    collection: "blog",
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

beforeEach(() => {
  collectionEntries.splice(0);
});

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

  it("orders newest-first within the fallback related group", () => {
    const current = post("current", "2026-04-01", "项目复盘");
    const fallbackOlder = post("fallback-older", "2026-02-15", "行业观察");
    const fallbackNewer = post("fallback-newer", "2026-03-15", "AI 工具实践");

    expect(
      getRelatedPosts(
        current,
        [posts[0], posts[1], fallbackOlder, fallbackNewer],
        4,
      ).map(({ id }) => id),
    ).toEqual(["featured", "old", "fallback-newer", "fallback-older"]);
  });

  it("excludes drafts from published posts", async () => {
    const draft = {
      ...post("draft", "2026-04-01", "项目复盘"),
      data: {
        ...post("draft", "2026-04-01", "项目复盘").data,
        draft: true,
      },
    } as Post;
    collectionEntries.push(posts[0], draft);

    expect((await getPublishedPosts()).map(({ id }) => id)).toEqual(["old"]);
  });
});

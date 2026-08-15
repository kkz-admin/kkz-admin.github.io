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

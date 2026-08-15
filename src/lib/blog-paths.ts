export const BLOG_CATEGORIES = [
  { label: "项目复盘", slug: "project-retrospective" },
  { label: "AI 工具实践", slug: "ai-tools" },
  { label: "行业观察", slug: "industry-observation" },
] as const;

export function categoryPath(slug: string): string {
  return `/blog/category/${slug}/`;
}

export function archivePath(year: string): string {
  return `/blog/archive/${year}/`;
}

import { matchesPost, type SearchablePost } from "../lib/search";

function postFromElement(element: HTMLElement): SearchablePost {
  return {
    title: element.dataset.title ?? "",
    description: element.dataset.description ?? "",
    category: element.dataset.category ?? "",
    tags: JSON.parse(element.dataset.tags ?? "[]") as string[],
  };
}

export function initBlogFilter(root: Document): void {
  const search = root.querySelector<HTMLInputElement>("[data-blog-search]");
  const categoryButtons = [
    ...root.querySelectorAll<HTMLElement>("[data-category-button]"),
  ];
  const tagButtons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-tag-button]"),
  ];
  const posts = [...root.querySelectorAll<HTMLElement>("[data-post]")];
  const empty = root.querySelector<HTMLElement>("[data-empty]");

  if (!search || !categoryButtons.length || !posts.length || !empty) return;

  let category = "全部";
  const render = () => {
    let visible = 0;
    for (const post of posts) {
      const show = matchesPost(postFromElement(post), search.value, category);
      post.hidden = !show;
      if (show) visible += 1;
    }
    empty.hidden = visible !== 0;
  };

  search.addEventListener("input", render);
  for (const button of tagButtons) {
    button.addEventListener("click", () => {
      search.value = button.dataset.tagButton ?? "";
      render();
    });
  }
  for (const button of categoryButtons) {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      category = button.dataset.categoryButton ?? "全部";
      for (const item of categoryButtons) {
        const active = item === button;
        item.setAttribute("data-active", String(active));
        if (active) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      }
      render();
    });
  }
}

export type Product = "app" | "obsidian" | "shared" | "specification";

export interface PageView {
  route: string;
  title: string;
  description: string;
  product: Product;
  version: string | null;
  generated: boolean;
  hideToc: boolean;
  source: string;
  toc: Array<{ level: number; id: string; text: string }>;
  html: string;
}

export interface SearchEntry {
  url: string;
  title: string;
  description: string;
  product: Product;
  text: string;
}

export interface NavigationSection {
  label: string;
  items: Array<{ title: string; route: string }>;
}

export interface Versions {
  app: string;
  obsidian: string;
}

export function sourceEditUrl(page: Pick<PageView, "source">): string | null {
  const [owner, sourcePath] = page.source.split(":", 2);
  if (!sourcePath) return null;
  if (owner === "tasknotes.dev")
    return `https://github.com/callumalpass/tasknotes.dev/edit/main/${sourcePath}`;
  if (owner === "tasknotes")
    return `https://github.com/callumalpass/tasknotes/blob/main/${sourcePath}`;
  if (owner === "tasknotes-app")
    return `https://github.com/callumalpass/tasknotes-app/blob/main/${sourcePath}`;
  if (owner === "tasknotes-spec")
    return `https://github.com/callumalpass/tasknotes-spec/blob/main/${sourcePath}`;
  return null;
}

export function productLabel(product: Product): string {
  if (product === "app") return "TaskNotes app";
  if (product === "obsidian") return "Obsidian plugin";
  if (product === "specification") return "Specification";
  return "Shared concept";
}

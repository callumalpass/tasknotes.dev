import generated from "@/.generated/content.json";
import type {
  NavigationSection,
  PageView,
  Versions,
} from "./content-model";

export * from "./content-model";

export interface DocumentationPage extends PageView {
  platforms: string[];
  noIndex: boolean;
  namespace: string;
  relativePath: string;
  raw: string;
  aliases: string[];
  text: string;
}

export const documentation = generated as {
  generatedAt: string;
  versions: Versions;
  navigation: NavigationSection[];
  redirects: Record<string, string>;
  pages: DocumentationPage[];
};

export function normalizeRoute(slug?: string[]): string {
  if (!slug?.length) return "/";
  return `/${slug.join("/")}/`;
}

export function pageAt(route: string): DocumentationPage | undefined {
  return documentation.pages.find((page) => page.route === route);
}

import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import matter from "gray-matter";
import hljs from "highlight.js";
import yaml from "js-yaml";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "content");
const output = path.join(root, ".generated", "content.json");
const pluginRoot = sourceRoot("TASKNOTES_PLUGIN_ROOT", "tasknotes");
const appRoot = sourceRoot("TASKNOTES_APP_ROOT", "tasknotes-app");
const specRoot = sourceRoot("TASKNOTES_SPEC_ROOT", "tasknotes-spec");
const useExistingWhenSourcesMissing = process.argv.includes("--if-sources");

marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, language) {
      const selected = hljs.getLanguage(language) ? language : "plaintext";
      return hljs.highlight(code, { language: selected }).value;
    },
  }),
);

function sourceRoot(environmentName, sibling) {
  const explicit = process.env[environmentName];
  if (explicit) return path.resolve(explicit);
  const staged = path.join(root, ".sources", sibling);
  if (existsSync(staged)) return staged;
  return path.resolve(root, "..", sibling);
}

function sourceAvailable(directory, marker) {
  return existsSync(path.join(directory, marker));
}

const requiredSources = [
  [pluginRoot, "manifest.json", "tasknotes"],
  [appRoot, "package.json", "tasknotes-app"],
  [specRoot, "00-overview.md", "tasknotes-spec"],
];
const missing = requiredSources.filter(
  ([directory, marker]) => !sourceAvailable(directory, marker),
);
if (missing.length) {
  if (useExistingWhenSourcesMissing && existsSync(output)) {
    console.log(
      `Documentation sources unavailable (${missing.map((entry) => entry[2]).join(", ")}); using the committed generated snapshot.`,
    );
    process.exit(0);
  }
  throw new Error(
    `Missing documentation sources: ${missing.map((entry) => `${entry[2]} at ${entry[0]}`).join(", ")}`,
  );
}

function escHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripHtml(value) {
  return String(value)
    .replace(/<[^>]+>/g, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return (
    stripHtml(value)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-") || "section"
  );
}

function normalizeRoute(value) {
  const route = `/${String(value || "").replace(/^\/+|\/+$/g, "")}`;
  return route === "/" ? route : `${route}/`;
}

function inferredRoute(relativePath) {
  const withoutExtension = relativePath.replace(/\.md$/i, "");
  const parts = withoutExtension.split("/");
  if (parts.at(-1) === "index") parts.pop();
  return normalizeRoute(parts.join("/"));
}

async function walkMarkdown(directory) {
  const files = [];
  async function walk(current) {
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile() && entry.name.endsWith(".md")) files.push(absolute);
    }
  }
  await walk(directory);
  return files.sort();
}

function preprocessAdmonitions(markdown) {
  const lines = markdown.split(/\r?\n/);
  const output = [];
  const admonitions = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^!!!\s+([\w-]+)(?:\s+"([^"]+)")?\s*$/);
    if (!match) {
      output.push(lines[index]);
      continue;
    }
    const body = [];
    while (index + 1 < lines.length) {
      const next = lines[index + 1];
      if (next.startsWith("    ")) {
        body.push(next.slice(4));
        index += 1;
      } else if (!next.trim() && body.length) {
        body.push("");
        index += 1;
      } else break;
    }
    const type = match[1].toLowerCase();
    const title = match[2] || `${type[0].toUpperCase()}${type.slice(1)}`;
    const token = `TASKNOTES_ADMONITION_${admonitions.length}`;
    const role = ["warning", "danger"].includes(type) ? ' role="alert"' : "";
    admonitions.push(
      `<aside class="admonition admonition--${escHtml(type)}"${role}><p class="admonition__title">${escHtml(title)}</p>${marked.parse(body.join("\n"))}</aside>`,
    );
    output.push("", token, "");
  }
  return { markdown: output.join("\n"), admonitions };
}

function renderMarkdown(content) {
  const prepared = preprocessAdmonitions(content);
  let html = marked.parse(prepared.markdown);
  prepared.admonitions.forEach((admonition, index) => {
    html = html.replace(
      new RegExp(
        `<p>\\s*TASKNOTES_ADMONITION_${index}\\s*</p>|TASKNOTES_ADMONITION_${index}`,
      ),
      admonition,
    );
  });
  const ids = new Map();
  html = html.replace(
    /<(h[2-4])([^>]*)>([\s\S]*?)<\/h[2-4]>/g,
    (full, tag, attributes, inner) => {
      if (/\sid=/.test(attributes)) return full;
      const base = slugify(inner);
      const occurrence = ids.get(base) || 0;
      ids.set(base, occurrence + 1);
      const id = occurrence ? `${base}-${occurrence + 1}` : base;
      return `<${tag} id="${id}"${attributes}>${inner}<a class="heading-anchor" href="#${id}" aria-label="Link to ${escHtml(stripHtml(inner))}">#</a></${tag}>`;
    },
  );
  return html
    .replace(/(<table[\s\S]*?<\/table>)/g, '<div class="table-wrap">$1</div>')
    .replace(/<img\b(?![^>]*\bloading=)([^>]*)>/g, '<img loading="lazy" decoding="async"$1>')
    .replace(/<video\b(?![^>]*\bpreload=)([^>]*)>/g, '<video preload="metadata" playsinline$1>');
}

function titleFrom(html, frontmatter) {
  if (frontmatter.title) return String(frontmatter.title);
  const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  return heading ? stripHtml(heading[1]) : "Untitled";
}

function descriptionFrom(html, frontmatter) {
  if (frontmatter.description) return String(frontmatter.description);
  const paragraph = html.match(/<p>([\s\S]*?)<\/p>/);
  const text = paragraph ? stripHtml(paragraph[1]) : "TaskNotes documentation.";
  return text.length > 180 ? `${text.slice(0, 177).trimEnd()}...` : text;
}

function tocFrom(html) {
  const items = [];
  for (const match of html.matchAll(
    /<(h[23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/g,
  )) {
    items.push({
      level: match[1] === "h2" ? 2 : 3,
      id: match[2],
      text: stripHtml(match[3].replace(/<a class="heading-anchor"[\s\S]*?<\/a>/, "")),
    });
  }
  return items;
}

function stripH1(html) {
  return html.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/, "");
}

const pluginManifest = JSON.parse(
  await fs.readFile(path.join(pluginRoot, "manifest.json"), "utf8"),
);
const appManifest = JSON.parse(
  await fs.readFile(path.join(appRoot, "package.json"), "utf8"),
);
const pages = [];

function addPage({
  raw,
  route,
  product,
  namespace,
  relativePath,
  source,
  generated = false,
  noIndex = false,
  aliases = [],
}) {
  const replaced = raw
    .replaceAll("${tasknotes.version}", pluginManifest.version)
    .replaceAll("${tasknotes.minAppVersion}", pluginManifest.minAppVersion);
  const parsed = matter(replaced);
  let html = renderMarkdown(parsed.content);
  const page = {
    route: normalizeRoute(parsed.data.route || route),
    title: titleFrom(html, parsed.data),
    description: descriptionFrom(html, parsed.data),
    product: parsed.data.product || product,
    platforms: Array.isArray(parsed.data.platforms) ? parsed.data.platforms : [],
    version:
      product === "app"
        ? appManifest.version
        : product === "obsidian"
          ? pluginManifest.version
          : null,
    generated: Boolean(parsed.data.generated || generated),
    noIndex: Boolean(parsed.data.noindex || parsed.data.draft || noIndex),
    hideToc: Boolean(parsed.data.hide_toc),
    source,
    namespace,
    relativePath,
    raw: replaced,
    aliases: aliases.map(normalizeRoute),
  };
  page.toc = tocFrom(html);
  page.html = stripH1(html);
  page.text = stripHtml(page.html).slice(0, 16000);
  pages.push(page);
}

for (const file of await walkMarkdown(contentRoot)) {
  const relativePath = path.relative(contentRoot, file).split(path.sep).join("/");
  const product = relativePath.startsWith("app/")
    ? "app"
    : relativePath.startsWith("obsidian/")
      ? "obsidian"
      : "shared";
  addPage({
    raw: await fs.readFile(file, "utf8"),
    route: inferredRoute(relativePath),
    product,
    namespace: relativePath.split("/")[0],
    relativePath: relativePath.split("/").slice(1).join("/"),
    source: `tasknotes.dev:content/${relativePath}`,
  });
}

const appIntegrationManifestPath = path.join(
  appRoot,
  "src",
  "generated",
  "mdbase-app.json",
);
const appIntegrationManifest = JSON.parse(
  await fs.readFile(appIntegrationManifestPath, "utf8"),
);
const requiredContracts = appIntegrationManifest.requirements?.contracts || [];
const fileActions = appIntegrationManifest.requirements?.files?.actions || [];
const notificationCriteria = appIntegrationManifest.notifications?.criteria || [];
addPage({
  raw: `---
title: App integration manifest
description: Generated reference for the TaskNotes app's mdbase integration requirements and capabilities.
---

# App integration manifest

This page is generated from the integration manifest shipped by TaskNotes app ${appManifest.version}.

| Field | Value |
| --- | --- |
| Application ID | \`${appIntegrationManifest.id}\` |
| Manifest version | \`${appIntegrationManifest.manifest_version}\` |
| Homepage | [${appIntegrationManifest.homepage}](${appIntegrationManifest.homepage}) |
| Collection access | \`${appIntegrationManifest.requirements?.access || "Not declared"}\` |

## Required contracts

${requiredContracts.length ? requiredContracts.map((contract) => `- \`${contract.id}\` version \`${contract.version}\``).join("\n") : "No contracts declared."}

## File capabilities

${fileActions.length ? fileActions.map((action) => `- \`${action}\``).join("\n") : "No file capabilities declared."}

## Notification criteria

${notificationCriteria.length ? notificationCriteria.map((criterion) => `- \`${criterion.id}\` listens for \`${criterion.event?.id}\` version \`${criterion.event?.version}\`.`).join("\n") : "No notification criteria declared."}
`,
  route: "/app/reference/manifest/",
  product: "app",
  namespace: "app",
  relativePath: "reference/manifest.md",
  source: "tasknotes-app:src/generated/mdbase-app.json",
  generated: true,
});

const releaseRoot = path.join(pluginRoot, "docs", "releases");
addPage({
  raw: await fs.readFile(path.join(pluginRoot, "docs", "releases.md"), "utf8"),
  route: "/obsidian/releases/",
  product: "obsidian",
  namespace: "obsidian",
  relativePath: "releases.md",
  source: "tasknotes:docs/releases.md",
  aliases: ["/releases/"],
});
for (const file of await walkMarkdown(releaseRoot)) {
  const name = path.basename(file, ".md");
  addPage({
    raw: await fs.readFile(file, "utf8"),
    route: `/obsidian/releases/${name}/`,
    product: "obsidian",
    namespace: "obsidian",
    relativePath: `releases/${path.basename(file)}`,
    source: `tasknotes:docs/releases/${path.basename(file)}`,
    aliases: [`/releases/${name}/`],
  });
}

const generatedModule = path.join(
  pluginRoot,
  "docs-builder",
  "src",
  "generated-pages.js",
);
const { buildGeneratedPages } = await import(pathToFileURL(generatedModule).href);
const generatedReferences = await buildGeneratedPages(pluginManifest);
for (const [relativePath, raw] of generatedReferences) {
  const route = `/obsidian/${relativePath.replace(/\.md$/, "/")}`;
  addPage({
    raw,
    route,
    product: "obsidian",
    namespace: "obsidian",
    relativePath,
    source: "tasknotes:docs-builder/src/generated-pages.js",
    generated: true,
    aliases: [`/${relativePath.replace(/\.md$/, "/")}`],
  });
}

for (const file of await walkMarkdown(specRoot)) {
  const name = path.basename(file);
  if (!/^(?:\d{2}-.+|CHANGELOG)\.md$/.test(name)) continue;
  const base = name.replace(/\.md$/, "");
  const route =
    base === "00-overview"
      ? "/developers/specification/"
      : `/developers/specification/${base}/`;
  addPage({
    raw: await fs.readFile(file, "utf8"),
    route,
    product: "specification",
    namespace: "specification",
    relativePath: name,
    source: `tasknotes-spec:${name}`,
    aliases: [`/spec/${base}/`],
  });
}

const redirectsConfig = yaml.load(
  await fs.readFile(path.join(root, "redirects.yml"), "utf8"),
);
const redirects = Object.fromEntries(
  Object.entries(redirectsConfig.redirects || {}).map(([from, to]) => [
    normalizeRoute(from),
    normalizeRoute(to),
  ]),
);
for (const page of pages) {
  if (page.product === "obsidian" && page.route.startsWith("/obsidian/")) {
    const legacy = normalizeRoute(page.route.slice("/obsidian".length));
    if (legacy !== "/" && legacy !== "/privacy/") page.aliases.push(legacy);
  }
  for (const alias of page.aliases) redirects[alias] ||= page.route;
}

const routeBySource = new Map(
  pages.map((page) => [`${page.namespace}:${page.relativePath}`, page.route]),
);
const redirectEntries = Object.entries(redirects).sort(
  (left, right) => right[0].length - left[0].length,
);

function splitHref(href) {
  const match = String(href).match(/^([^?#]*)([\s\S]*)$/);
  return { pathPart: match?.[1] || "", suffix: match?.[2] || "" };
}

function canonicalRouteForAbsolute(pathname) {
  const normalized = normalizeRoute(pathname);
  const exact = redirects[normalized];
  if (exact) return exact;
  for (const [from, to] of redirectEntries) {
    if (normalized.startsWith(from) && from !== "/") {
      return normalizeRoute(`${to}${normalized.slice(from.length)}`);
    }
  }
  return normalized;
}

function rewriteLinks(page) {
  let html = page.html.replace(
    /(<a\b[^>]*\shref=")([^"]+)(")/g,
    (full, before, href, after) => {
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("//") ||
        /^[A-Za-z][A-Za-z0-9+.-]*:/.test(href)
      )
        return full;
      const { pathPart, suffix } = splitHref(href);
      if (pathPart.startsWith("/"))
        return `${before}${canonicalRouteForAbsolute(pathPart)}${suffix}${after}`;
      if (/\.md$/i.test(pathPart)) {
        const targetRelative = path.posix.normalize(
          path.posix.join(path.posix.dirname(page.relativePath), pathPart),
        );
        const target = routeBySource.get(`${page.namespace}:${targetRelative}`);
        if (target) return `${before}${target}${suffix}${after}`;
      }
      return full;
    },
  );
  html = html.replace(
    /(<(?:img|source|video)\b[^>]+\s(?:src|poster)=")([^"]+)(")/g,
    (full, before, source, after) => {
      if (/^(?:https?:|data:|\/\/)/.test(source)) return full;
      if (source.startsWith("/assets/")) {
        return page.product === "obsidian"
          ? `${before}/assets/obsidian/${source.slice("/assets/".length)}${after}`
          : full;
      }
      const assetMatch = source.match(/(?:^|\/)assets\/(.+)$/);
      if (assetMatch && page.product === "obsidian")
        return `${before}/assets/obsidian/${assetMatch[1]}${after}`;
      return full;
    },
  );
  return html;
}

for (const page of pages) page.html = rewriteLinks(page);

const navigationConfig = yaml.load(
  await fs.readFile(path.join(root, "navigation.yml"), "utf8"),
);
const navigationRoutes = new Set(
  navigationConfig.navigation.flatMap((section) =>
    section.items.map((item) => normalizeRoute(item.route)),
  ),
);
const pageRoutes = new Set(pages.map((page) => page.route));
const missingNavigation = [...navigationRoutes].filter(
  (route) => !pageRoutes.has(route),
);
if (missingNavigation.length)
  throw new Error(`Navigation references missing routes: ${missingNavigation.join(", ")}`);

const duplicates = pages
  .map((page) => page.route)
  .filter((route, index, routes) => routes.indexOf(route) !== index);
if (duplicates.length)
  throw new Error(`Duplicate documentation routes: ${[...new Set(duplicates)].join(", ")}`);

const result = {
  generatedAt: new Date().toISOString(),
  versions: { app: appManifest.version, obsidian: pluginManifest.version },
  navigation: navigationConfig.navigation,
  redirects,
  pages: pages.sort((left, right) => left.route.localeCompare(right.route)),
};
await fs.mkdir(path.dirname(output), { recursive: true });
const temporaryOutput = `${output}.${process.pid}.tmp`;
await fs.writeFile(temporaryOutput, `${JSON.stringify(result)}\n`);
await fs.rename(temporaryOutput, output);

const publicRoot = path.join(root, "public");
const published = result.pages.filter((page) => !page.noIndex);
const searchIndex = published.map((page) => ({
  title: page.title,
  url: page.route,
  description: page.description,
  product: page.product,
  text: page.text,
}));
await Promise.all([
  fs.writeFile(
    path.join(publicRoot, "search-index.json"),
    `${JSON.stringify(searchIndex)}\n`,
  ),
  fs.writeFile(
    path.join(publicRoot, "robots.txt"),
    "User-agent: *\nAllow: /\nSitemap: https://tasknotes.dev/sitemap.xml\n",
  ),
  fs.writeFile(
    path.join(publicRoot, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${published
      .map(
        (page) =>
          `  <url><loc>https://tasknotes.dev${escHtml(page.route)}</loc></url>`,
      )
      .join("\n")}\n</urlset>\n`,
  ),
  fs.writeFile(path.join(publicRoot, "llms.txt"), buildLlmsIndex(result)),
  fs.writeFile(
    path.join(publicRoot, "llms-full.txt"),
    buildLlmsBundle(result),
  ),
]);
console.log(
  `Generated ${pages.length} documentation pages from authored content, product releases and references, and the formal specification.`,
);

function buildLlmsIndex(site) {
  const primaryRoutes = new Set(
    site.navigation.flatMap((section) =>
      section.items.map((item) => normalizeRoute(item.route)),
    ),
  );
  const lines = [
    "# TaskNotes",
    "> Documentation for the TaskNotes app, Obsidian plugin, and portable task format.",
    "",
    "## Documentation",
    "",
  ];
  for (const page of site.pages.filter((candidate) => primaryRoutes.has(candidate.route)))
    lines.push(
      `- [${page.title}](https://tasknotes.dev${page.route}): ${page.description}`,
    );
  lines.push(
    "",
    "## Full context",
    "",
    "- [Complete primary documentation](https://tasknotes.dev/llms-full.txt)",
    "",
  );
  return lines.join("\n");
}

function buildLlmsBundle(site) {
  const primaryRoutes = new Set(
    site.navigation.flatMap((section) =>
      section.items.map((item) => normalizeRoute(item.route)),
    ),
  );
  const lines = [
    "# TaskNotes documentation",
    "",
    "> Documentation for the TaskNotes app, Obsidian plugin, and portable task format.",
    "",
  ];
  for (const page of site.pages.filter((candidate) => primaryRoutes.has(candidate.route))) {
    const body = matter(page.raw).content.replace(/^#\s+.+(?:\r?\n)+/, "").trim();
    lines.push(
      "---",
      "",
      `# ${page.title}`,
      "",
      `Source: https://tasknotes.dev${page.route}`,
      "",
      body,
      "",
    );
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

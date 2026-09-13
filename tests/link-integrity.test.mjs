import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const generated = JSON.parse(
  await readFile(new URL(".generated/content.json", root), "utf8"),
);
const routes = new Set(generated.pages.map((page) => page.route));

function internalUrls(html, attribute) {
  return [...html.matchAll(new RegExp(`\\b${attribute}="([^"]+)"`, "g"))]
    .map((match) => match[1])
    .filter((url) => url.startsWith("/") && !url.startsWith("//"));
}

test("all internal documentation links resolve", () => {
  const failures = [];
  for (const page of generated.pages) {
    for (const url of internalUrls(page.html, "href")) {
      const pathname = url.split(/[?#]/)[0];
      // Asset downloads are checked against public/ alongside media below.
      if (pathname.startsWith("/assets/")) continue;
      if (!routes.has(pathname) && !generated.redirects[pathname])
        failures.push(`${page.route} -> ${url}`);
    }
  }
  assert.deepEqual(failures, []);
});

test("all referenced public media, posters, and asset downloads exist", async () => {
  const failures = [];
  for (const page of generated.pages) {
    const urls = [
      ...internalUrls(page.html, "src"),
      ...internalUrls(page.html, "poster"),
      ...internalUrls(page.html, "href").filter((url) => url.startsWith("/assets/")),
    ];
    for (const url of urls) {
      const pathname = url.split(/[?#]/)[0];
      const publicPath = new URL(`public${pathname}`, root);
      try {
        await access(publicPath);
      } catch {
        failures.push(`${page.route} -> ${path.posix.normalize(pathname)}`);
      }
    }
  }
  assert.deepEqual(failures, []);
});

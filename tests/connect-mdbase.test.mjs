import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const generated = JSON.parse(
  await readFile(new URL(".generated/content.json", root), "utf8"),
);
const page = generated.pages.find((page) => page.route === "/app/connect-mdbase/");

test("the connection steps describe the current mdbase Connect flow", () => {
  assert.equal(page?.source, "tasknotes.dev:content/app/connect-mdbase.md");
  assert.equal(page?.product, "app");
  assert.match(page.raw, /Add existing folder/);
  assert.match(page.raw, /Turn on sync/);
  assert.match(page.raw, /TaskNotes 4 can overwrite it/);
  assert.doesNotMatch(page.raw, /relay|Continue in browser|Hosted by mdbase|<video/);
});

test("the app entry points and navigation link to the connection steps", () => {
  for (const route of ["/app/", "/app/getting-started/", "/app/collections/", "/app/mdbase/"]) {
    const entry = generated.pages.find((page) => page.route === route);
    assert.ok(entry?.html.includes('href="/app/connect-mdbase/"'), route);
  }
  assert.ok(generated.navigation.some((section) =>
    section.label === "TaskNotes app" && section.items.some((item) => item.route === page.route),
  ));
});

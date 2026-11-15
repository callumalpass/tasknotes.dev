import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const clientDirectory = fileURLToPath(
  new URL("../dist/client/", import.meta.url),
);

async function render(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const filename = join(clientDirectory, ...segments, "index.html");
  return new Response(await readFile(filename), {
    status: 200,
    headers: { "content-type": "text/html" },
  });
}

test("renders the product-family documentation home", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>TaskNotes documentation \| TaskNotes<\/title>/i);
  assert.match(html, /TaskNotes app/);
  assert.match(html, /TaskNotes plugin/);
  assert.match(html, /One portable task model/);
  assert.doesNotMatch(
    html,
    /codex-preview|react-loading-skeleton|Starter Project/,
  );
});

test("renders app and Obsidian pages with explicit scope", async () => {
  const app = await render("/app/collections/");
  assert.equal(app.status, 200);
  const appHtml = await app.text();
  assert.match(appHtml, /Choose a collection/);
  assert.match(appHtml, /TaskNotes app/);
  assert.match(appHtml, /A folder on your computer/);

  const plugin = await render("/obsidian/core-concepts/");
  assert.equal(plugin.status, 200);
  const pluginHtml = await plugin.text();
  assert.match(pluginHtml, /Obsidian plugin/);
  assert.match(pluginHtml, /Core Concepts/);
});

test("replaces the embedded demo with the existing static app screenshot and preserves its old URL", async () => {
  const app = await render("/app/");
  const html = await app.text();
  assert.match(html, /src="\/assets\/app\/today-workspace\.webp"/);
  assert.doesNotMatch(html, /<iframe|Interactive demo|Reset demo|\/embed/);
  const legacy = await render("/app/demo/");
  assert.equal(legacy.status, 200);
  assert.match(await legacy.text(), /<link rel="canonical" href="https:\/\/tasknotes\.dev\/app\/"/);
});

test("renders the connection steps without the retired walkthrough video", async () => {
  const response = await render("/app/connect-mdbase/");
  const html = await response.text();
  assert.doesNotMatch(html, /<video\b|walkthrough\.mp4/);
  assert.match(html, /<h2 id="start-a-new-collection"/);
  assert.match(html, /<h2 id="use-a-folder-on-your-computer"/);
  assert.match(html, /<h2 id="first-time-setup"/);
});

test("renders legacy routes with canonical destinations", async () => {
  const plugin = await render("/features/");
  assert.equal(plugin.status, 200);
  assert.match(
    await plugin.text(),
    /<link rel="canonical" href="https:\/\/tasknotes\.dev\/obsidian\/features\/"/,
  );

  const specification = await render("/spec/");
  assert.equal(specification.status, 200);
  assert.match(
    await specification.text(),
    /<link rel="canonical" href="https:\/\/tasknotes\.dev\/developers\/specification\/"/,
  );
});

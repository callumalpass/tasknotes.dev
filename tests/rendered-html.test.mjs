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
  assert.match(appHtml, /Hosted mdbase/);

  const plugin = await render("/obsidian/core-concepts/");
  assert.equal(plugin.status, 200);
  const pluginHtml = await plugin.text();
  assert.match(pluginHtml, /Obsidian plugin/);
  assert.match(pluginHtml, /Core Concepts/);
});

test("renders the interactive app demo as an opt-in experience", async () => {
  const response = await render("/app/demo/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Load the interactive demo/);
  assert.match(html, /24 sample tasks/);
  assert.match(html, /Open in a new tab/);
  assert.doesNotMatch(html, /<iframe/);
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

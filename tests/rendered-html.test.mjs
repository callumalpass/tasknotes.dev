import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
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

test("redirects legacy plugin and specification routes", async () => {
  const plugin = await render("/features/");
  assert.ok([301, 302, 307, 308].includes(plugin.status));
  assert.equal(
    new URL(plugin.headers.get("location"), "http://localhost").pathname,
    "/obsidian/features/",
  );

  const specification = await render("/spec/");
  assert.ok([301, 302, 307, 308].includes(specification.status));
  assert.equal(
    new URL(specification.headers.get("location"), "http://localhost").pathname,
    "/developers/specification/",
  );
});

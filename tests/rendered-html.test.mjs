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

test("renders the interactive app demo immediately with minimal chrome", async () => {
  const response = await render("/app/demo/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Try TaskNotes/);
  assert.match(html, /24 sample tasks/);
  assert.match(html, /Open in a new tab/);
  assert.match(html, /<iframe/);
  assert.doesNotMatch(html, /Load the interactive demo/);
  assert.doesNotMatch(html, /aria-label="Documentation"/);
});

test("renders the connection walkthrough with an opt-in local video and minimal copy", async () => {
  const response = await render("/app/connect-mdbase/");
  const html = await response.text();
  const video = html.match(/<video\b[^>]*>/)?.[0];
  assert.ok(video, "the walkthrough has a native video player");
  assert.match(video, /\bcontrols\b/);
  assert.match(video, /\bplaysinline\b/);
  assert.match(video, /preload="none"/);
  assert.match(video, /poster="\/assets\/app\/connect-mdbase\/poster\.png"/);
  assert.match(video, /aria-label="Connect TaskNotes to mdbase/);
  assert.doesNotMatch(video, /\b(?:autoplay|loop)\b/);
  assert.match(html, /<source src="\/assets\/app\/connect-mdbase\/walkthrough\.mp4" type="video\/mp4"/);
  assert.match(html, /<track[^>]*kind="captions"[^>]*srclang="en"/);
  assert.match(html, /href="\/assets\/app\/connect-mdbase\/walkthrough\.mp4"/);
  assert.doesNotMatch(html, /walkthrough\.mp4\//);
  assert.doesNotMatch(html, /walkthrough-transcript|Read the transcript|3 minutes 53 seconds/);
  assert.match(html, /<h2 id="connect-a-hosted-collection"/);
  assert.match(html, /<h2 id="connect-an-existing-local-folder"/);
  assert.doesNotMatch(html, /OS-specific installer dialogs are omitted|disposable demo data/);
  assert.doesNotMatch(html, /tasknotes-mdbase-video\.pages\.dev|<iframe/);
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

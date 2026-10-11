import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const generated = JSON.parse(
  await readFile(new URL("../.generated/content.json", import.meta.url), "utf8"),
);
const guideRoute = "/obsidian/migration-v4-to-v5/";
const pageAt = (route) => {
  const page = generated.pages.find((entry) => entry.route === route);
  assert.ok(page, `published page: ${route}`);
  return page;
};

const guide = pageAt(guideRoute);

test("the authored v5 guide is discoverable and retains its advertised URL", () => {
  assert.equal(guide.source, "tasknotes.dev:content/obsidian/migration-v4-to-v5.md");
  assert.equal(generated.redirects["/migration-v4-to-v5/"], guideRoute);
  assert.ok(
    generated.navigation.some((section) =>
      section.items.some((item) => item.route === guideRoute),
    ),
  );
  assert.match(pageAt("/obsidian/").html, /href="\/obsidian\/migration-v4-to-v5\/"/);
});

test("the guide identifies the beta and its own Obsidian requirement", () => {
  assert.equal(guide.version, "5.0.0-beta.5");
  assert.match(guide.text, /This guide covers 5\.0\.0-beta\.5/);
  assert.match(guide.text, /Obsidian 1\.13\.1 or later/);
  assert.doesNotMatch(guide.raw, /\$\{tasknotes\./);
  assert.match(guide.text, /v4 remains the recommended stable release/);
  assert.equal(pageAt("/obsidian/settings/").version, generated.versions.obsidian);
});

test("beta release-note migration sections and recovery guidance are published", () => {
  for (const id of [
    "mdbase-collections",
    "interrupted-updates-and-blocked-collections",
    "tasknotes-app-setup-is-separate",
    "check-existing-task-records",
  ]) {
    assert.ok(guide.html.includes(`id="${id}"`), id);
  }
  const backup = pageAt("/obsidian/guides/backup-recovery/");
  assert.match(backup.html, /id="interrupted-mdbase-metadata-updates"/);
  assert.match(guide.html, /href="\/obsidian\/guides\/backup-recovery\/#interrupted-mdbase-metadata-updates"/);
  assert.match(backup.html, /href="\/obsidian\/migration-v4-to-v5\/#interrupted-updates-and-blocked-collections"/);
  assert.match(backup.text, /Close Obsidian on all syncing devices/);
  assert.match(backup.text, /Do not delete a pending journal/);
  assert.match(backup.text, /does not make this path atomic/);
  assert.match(backup.text, /independent backup or sync history/);
});

test("shared references distinguish stable settings, beta statistics, and API tokens", () => {
  const settings = pageAt("/obsidian/settings/");
  assert.match(settings.text, /This page describes TaskNotes v4/);
  assert.match(settings.html, /href="\/obsidian\/migration-v4-to-v5\/#settings-are-reorganized"/);
  const time = pageAt("/obsidian/features/time-management/");
  assert.match(time.text, /In v5 beta\.5.*dashboards have been removed/);
  const api = pageAt("/obsidian/HTTP_API/");
  assert.match(api.text, /Authentication is required for both HTTP API and MCP requests/);
  assert.doesNotMatch(api.text, /Authentication is optional|all API requests are accepted/);
  assert.match(api.text, /TaskNotes 4\.13\.0 and later/);
  assert.match(api.text, /Clearing the token does not enable unauthenticated access/);
  assert.match(api.text, /In v4, the HTTP API token is stored in data\.json/);
  assert.match(api.text, /In v5, it moves to Obsidian Secret Storage on each device/);
  assert.match(api.html, /id="connecting-claude-desktop-with-mcp"/);
  const integrations = pageAt("/obsidian/settings/integrations/");
  assert.match(integrations.text, /authentication is required for HTTP API and MCP requests/);
  assert.doesNotMatch(integrations.text, /local API requests are still unauthenticated/);
});

test("the static guide and legacy route render with the beta's canonical URL", async () => {
  const html = await readFile(
    new URL("../dist/client/obsidian/migration-v4-to-v5/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /<title>Upgrading from v4 to v5 \| TaskNotes<\/title>/);
  assert.match(html.replaceAll("<!-- -->", ""), /Obsidian plugin · 5\.0\.0-beta\.5/);
  assert.match(html, /Obsidian 1\.13\.1 or later/);
  const legacy = await readFile(
    new URL("../dist/client/migration-v4-to-v5/index.html", import.meta.url),
    "utf8",
  );
  assert.match(
    legacy,
    /<link rel="canonical" href="https:\/\/tasknotes\.dev\/obsidian\/migration-v4-to-v5\/"/,
  );
});

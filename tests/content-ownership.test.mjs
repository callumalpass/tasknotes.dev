import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const generated = JSON.parse(
  await readFile(new URL("../.generated/content.json", import.meta.url), "utf8"),
);

async function markdownFiles(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory())
      files.push(
        ...(await markdownFiles(new URL(`${entry.name}/`, directory), relative)),
      );
    else if (entry.name.endsWith(".md")) files.push(relative);
  }
  return files;
}

test("authored content excludes product-owned releases, internals, and specification", async () => {
  const files = await markdownFiles(new URL("../content/", import.meta.url));
  assert.ok(files.some((file) => file.startsWith("app/")));
  assert.ok(files.some((file) => file.startsWith("obsidian/")));
  assert.ok(files.some((file) => file.startsWith("shared/")));
  assert.equal(files.some((file) => /(^|\/)releases\//.test(file)), false);
  assert.equal(files.some((file) => /(^|\/)development\//.test(file)), false);
  assert.equal(files.some((file) => /(^|\/)spec\//.test(file)), false);
});

test("authored documentation does not advertise removed browser-only collections", async () => {
  const directory = new URL("../content/", import.meta.url);
  const files = await markdownFiles(directory);
  const matches = [];
  for (const file of files) {
    const markdown = await readFile(new URL(file, directory), "utf8");
    if (/browser[- ]only|browser-held|browser data|OPFS/i.test(markdown))
      matches.push(file);
  }
  assert.deepEqual(matches, []);
});

test("app documentation does not advertise device filesystem collections", async () => {
  const appDirectory = new URL("../content/app/", import.meta.url);
  const files = await markdownFiles(appDirectory);
  const documents = await Promise.all([
    ...files.map((file) => readFile(new URL(file, appDirectory), "utf8")),
    readFile(new URL("../content/shared/task-records.md", import.meta.url), "utf8"),
    readFile(new URL("../content/policies/privacy.md", import.meta.url), "utf8"),
  ]);
  const removedTerms =
    /device[- ](?:folder|only)|keep on this device|system file picker|app-managed documents folder/i;
  assert.deepEqual(
    documents.filter((markdown) => removedTerms.test(markdown)),
    [],
  );
});

test("mdbase guide explains computer availability, encryption, and desktop setup", async () => {
  const guide = generated.pages.find((page) => page.route === "/app/mdbase/");
  assert.equal(guide?.source, "tasknotes.dev:content/app/mdbase.md");
  assert.match(guide?.raw || "", /https:\/\/mdbase\.dev\/downloads\//);
  assert.match(guide?.text || "", /awake, connected to the internet/i);
  assert.match(guide?.text || "", /end-to-end encrypted relay/i);
});

test("app documentation identifies its beta and collection compatibility", () => {
  const landing = generated.pages.find((page) => page.route === "/");
  const app = generated.pages.find((page) => page.route === "/app/");
  assert.match(landing?.text || "", /Beta · Web · Android · iOS/);
  assert.match(landing?.text || "", /TaskNotes v5 collections/);
  assert.match(app?.text || "", /mdbase 0\.3\.0 specification/);
});

test("generated snapshot retains source ownership", () => {
  const releases = generated.pages.filter((page) =>
    page.route.startsWith("/obsidian/releases/"),
  );
  const specification = generated.pages.filter((page) =>
    page.route.startsWith("/developers/specification/"),
  );
  const references = generated.pages.filter((page) => page.generated);
  const appManifest = generated.pages.find(
    (page) => page.route === "/app/reference/manifest/",
  );
  assert.ok(releases.length > 50);
  assert.ok(releases.every((page) => page.source.startsWith("tasknotes:")));
  assert.ok(specification.length >= 10);
  assert.ok(
    specification.every((page) => page.source.startsWith("tasknotes-spec:")),
  );
  assert.ok(references.length >= 5);
  assert.equal(
    appManifest?.source,
    "tasknotes-app:src/generated/mdbase-app.json",
  );
  assert.ok(
    references.every((page) =>
      ["tasknotes:", "tasknotes-app:"].some((owner) =>
        page.source.startsWith(owner),
      ),
    ),
  );
});

test("every available source attribution resolves to its owning repository", async () => {
  const siteRoot = fileURLToPath(new URL("../", import.meta.url));
  const roots = {
    "tasknotes.dev": siteRoot,
    tasknotes:
      process.env.TASKNOTES_PLUGIN_ROOT || path.resolve(siteRoot, "../tasknotes"),
    "tasknotes-app":
      process.env.TASKNOTES_APP_ROOT || path.resolve(siteRoot, "../tasknotes-app"),
    "tasknotes-spec":
      process.env.TASKNOTES_SPEC_ROOT || path.resolve(siteRoot, "../tasknotes-spec"),
  };
  const availableOwners = new Set(["tasknotes.dev"]);
  for (const [owner, directory] of Object.entries(roots)) {
    if (owner === "tasknotes.dev") continue;
    try {
      await access(directory);
      availableOwners.add(owner);
    } catch {}
  }
  const failures = [];
  for (const page of generated.pages) {
    const separator = page.source.indexOf(":");
    const owner = page.source.slice(0, separator);
    const sourcePath = page.source.slice(separator + 1);
    if (!availableOwners.has(owner)) continue;
    try {
      await readFile(path.join(roots[owner], sourcePath));
    } catch {
      failures.push(page.source);
    }
  }
  assert.deepEqual(failures, []);
});

test("navigation and redirects resolve to published routes", () => {
  const routes = new Set(generated.pages.map((page) => page.route));
  for (const section of generated.navigation)
    for (const item of section.items)
      assert.ok(routes.has(item.route), item.route);
  for (const target of Object.values(generated.redirects))
    assert.ok(routes.has(target), target);
  assert.equal(generated.redirects["/features/"], "/obsidian/features/");
  assert.equal(generated.redirects["/spec/"], "/developers/specification/");
  assert.equal(
    generated.redirects["/app/sync-and-conflicts/"],
    "/app/connection/",
  );
});

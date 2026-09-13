import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const media = "assets/app/connect-mdbase/";
const generated = JSON.parse(
  await readFile(new URL(".generated/content.json", root), "utf8"),
);
const page = generated.pages.find((page) => page.route === "/app/connect-mdbase/");

// Approved revision 6, 3:53, with visible cursors and four contextual sections.
// Source: https://3f1cda16.tasknotes-mdbase-video.pages.dev/
const approvedVideoHash = "da55a40d0ef4f9b684adda89b1d733baeee5a0869115d09eaeff17a0db356a21";
const videoDuration = 232.599347;

test("publishes the approved walkthrough and its assets without changing them", async () => {
  const video = await readFile(new URL(`public/${media}walkthrough.mp4`, root));
  assert.equal(createHash("sha256").update(video).digest("hex"), approvedVideoHash);
  for (const name of ["walkthrough.mp4", "poster.png", "captions.en.vtt"]) {
    const source = await readFile(new URL(`public/${media}${name}`, root));
    const published = await readFile(new URL(`dist/client/${media}${name}`, root));
    assert.deepEqual(published, source, `${name} is included in the static site`);
  }
});

test("the walkthrough retains valid timed captions without a transcript", async () => {
  assert.equal(page?.source, "tasknotes.dev:content/app/connect-mdbase.md");
  assert.equal(page?.product, "app");
  const vtt = await readFile(new URL(`public/${media}captions.en.vtt`, root), "utf8");
  assert.ok(vtt.startsWith("WEBVTT\n"));
  const cues = vtt.trim().split(/\n\n+/).slice(1);
  assert.doesNotMatch(page.raw, /transcript|walkthrough-description|<figcaption/i);
  const seconds = (value) => {
    const [hours, minutes, seconds] = value.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };
  let previousEnd = 0;
  for (const cue of cues) {
    const [timing, ...lines] = cue.split("\n");
    const match = timing.match(/^(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})$/);
    assert.ok(match, timing);
    const start = seconds(match[1]);
    const end = seconds(match[2]);
    assert.ok(start >= previousEnd && end > start && end <= videoDuration + 0.01);
    assert.ok(lines.join(" ").trim(), "each caption has text");
    previousEnd = end;
  }
  assert.equal(cues.length, 26);
  assert.match(page.raw, /Hosted collections can also be mirrored/);
  assert.doesNotMatch(page.raw, /disposable demo data|OS-specific installer dialogs|Download the video/);
});

test("the app entry points and navigation link to the walkthrough", () => {
  for (const route of ["/app/", "/app/getting-started/", "/app/collections/", "/app/mdbase/"]) {
    const entry = generated.pages.find((page) => page.route === route);
    assert.ok(entry?.html.includes('href="/app/connect-mdbase/"'), route);
  }
  assert.ok(generated.navigation.some((section) =>
    section.label === "TaskNotes app" && section.items.some((item) => item.route === page.route),
  ));
});

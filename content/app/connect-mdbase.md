---
title: Connect TaskNotes to mdbase
description: Watch how to connect hosted mdbase collections and existing local folders to the TaskNotes app, with written steps and a transcript.
route: /app/connect-mdbase/
product: app
platforms: [web, android, ios]
---

# Connect TaskNotes to mdbase

<figure class="app-walkthrough">
  <video controls playsinline preload="none" width="1440" height="960" poster="/assets/app/connect-mdbase/poster.png" aria-label="Connect TaskNotes to mdbase: hosted collections and existing local folders" aria-describedby="walkthrough-description">
    <source src="/assets/app/connect-mdbase/walkthrough.mp4" type="video/mp4">
    <track src="/assets/app/connect-mdbase/captions.en.vtt" kind="captions" srclang="en" label="English">
    <p>Your browser cannot play this video. <a href="/assets/app/connect-mdbase/walkthrough.mp4">Download the MP4</a> or read the written steps and transcript below.</p>
  </video>
  <figcaption id="walkthrough-description">3 minutes 53 seconds · Silent walkthrough with on-screen instructions and visible cursors. Use the player’s fullscreen control for a closer view.</figcaption>
</figure>

<a href="/assets/app/connect-mdbase/walkthrough.mp4" download>Download the video</a>
· [Read the transcript](#transcript)

These instructions are for the web, Android, and iOS app, not the
[Obsidian plugin](/obsidian/).

The recording uses disposable demo data in the LAB test environment. Account
sign-in and OS-specific installer dialogs are omitted. The folder chooser and
Markdown editor shown are Linux examples; the connection steps apply across
platforms. TaskNotes is in beta, so some labels may change.

## Choose where your collection lives

- **Hosted by mdbase:** available online even when your computer is off. You
  need an internet connection, but not the desktop Connector to use TaskNotes.
- **On your computer:** files stay in a local folder. Keep that computer
  reachable and mdbase Connect running while other devices use the collection.

Hosted collections can also be mirrored to your computer, so you can work
with local Markdown files. Mirror setup is outside this walkthrough.

The same TaskNotes app works with either. Read [What is mdbase?](/app/mdbase/)
for more background or [Choose a collection](/app/collections/) for a fuller
comparison.

## Connect a hosted collection

1. Open [TaskNotes](https://app.tasknotes.dev/) or its Android or iOS app and
   choose a collection. Sign in to mdbase if asked.
2. Select a collection labelled **Hosted by mdbase**, then choose **Review
   access**.
3. Review the named application, collection, requested actions, and setup
   changes. Approve only if you agree. For a collection needing TaskNotes
   definitions, the button reads **Set up and allow access**.
4. Return to TaskNotes and add a task. It is saved in the hosted collection.

If you do not have a hosted collection, expand **Add or connect another
collection → Create hosted collection** in mdbase. Creating a collection and
approving TaskNotes access are separate steps.

## Connect an existing local folder

1. Visit the [mdbase Connect download page](https://mdbase.dev/downloads/) and
   choose the **desktop app** for your operating system and processor. Follow
   the current platform installation and beta security guidance, then open
   mdbase Connect. The standalone CLI download does not include the desktop
   interface.
2. Name your computer and choose **Continue in browser**. Sign in if asked,
   approve the computer, then return to the desktop app and wait for it to
   connect.
3. Open **Collections → Add existing**. Select the collection root containing
   `mdbase.yaml`, not just its `tasks` subfolder. Adding the folder validates it
   in place; it does not move or upload its files.
4. Open the collection chooser in TaskNotes and select the collection listed
   under your connected computer. If TaskNotes already has a collection open,
   use **Settings → Change collection → Connect another collection**.
5. Review and approve the requested access and setup changes if you agree.
   If TaskNotes subsequently asks, review **Apply reviewed setup** as well.
6. Add a task and inspect its Markdown file in the collection. Completing the
   task updates that file’s status to `done`. You can use any Markdown editor;
   the video uses VS Code.

TaskNotes does not open the folder directly or maintain a durable offline copy.
Your computer remains the main copy and must be reachable for remote access.
See [Connection and availability](/app/connection/) if the collection cannot
be reached.

## Switch an existing connection

Open **Settings → Change collection** and select a collection you have already
approved. **Connect another collection** returns to mdbase to approve access
to another one. Switching collections does not copy or move their records.

## Transcript

<details class="walkthrough-transcript">
<summary>Read the full video transcript</summary>

**00:00** — This video shows how to connect mdbase collections to the TaskNotes app. We’ll start with a hosted collection, then connect an existing folder on your computer.

**00:08** — Hosted by mdbase: available online, even when your computer is off. No desktop Connector needed for TaskNotes.

**00:14** — Hosted collections can also be mirrored to your computer, so you can work with local Markdown files.

**00:21** — On your computer: files stay in an existing folder. Keep mdbase Connect running and the computer reachable. The same TaskNotes app works with either.

**00:29** — Start with hosted: open app.tasknotes.dev and choose a collection.

**00:37** — Select a collection labelled Hosted by mdbase, then review access.

**00:50** — Review the permissions, then approve access if you agree.

**01:00** — Add a task. It is saved in your hosted collection; no local computer is needed.

**01:14** — Already have an mdbase collection on your computer? Connect that folder to TaskNotes without moving its files.

**01:22** — For a local folder, first get the desktop app at mdbase.dev/downloads.

**01:35** — Install and open mdbase Connect.

**01:39** — Name this computer, then choose Continue in browser.

**01:49** — Sign in if asked, then approve this computer.

**02:00** — In Collections, choose Add existing and select your collection folder.

**02:09** — Choose the folder containing mdbase.yaml. Its files stay where they are.

**02:15** — Back in TaskNotes, open the mdbase collection chooser.

**02:21** — Select the collection listed under your connected computer.

**02:35** — Review the requested access and setup changes, then approve if you agree.

**02:44** — Add a task to the local collection.

**02:59** — Each task is a Markdown file. Changes you make in TaskNotes are saved back to the collection.

**03:06** — The task is now a Markdown file in your existing folder.

**03:11** — Keep mdbase Connect running while other devices use this folder.

**03:15** — Once both are connected, switch collections in Settings → Change collection.

**03:24** — Choose a collection you have already approved.

**03:37** — In the local collection, complete the task.

**03:46** — The same Markdown file now says status: done.

</details>

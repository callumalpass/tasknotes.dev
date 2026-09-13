---
title: Connect TaskNotes to mdbase
description: Connect a hosted mdbase collection or an existing folder on your computer.
route: /app/connect-mdbase/
product: app
platforms: [web, android, ios]
---

# Connect TaskNotes to mdbase

<figure class="app-walkthrough">
  <video controls playsinline preload="none" width="1440" height="960" poster="/assets/app/connect-mdbase/poster.png" aria-label="Connect TaskNotes to mdbase: hosted collections and existing local folders">
    <source src="/assets/app/connect-mdbase/walkthrough.mp4" type="video/mp4">
    <track src="/assets/app/connect-mdbase/captions.en.vtt" kind="captions" srclang="en" label="English">
    <p>Your browser cannot play this video. <a href="/assets/app/connect-mdbase/walkthrough.mp4">Download the MP4</a> or read the written steps below.</p>
  </video>
</figure>

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

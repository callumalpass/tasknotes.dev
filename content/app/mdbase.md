---
title: mdbase and TaskNotes
description: Understand how TaskNotes uses mdbase, and how mdbase Connect syncs a folder on your computer.
route: /app/mdbase/
product: app
platforms: [web, android, ios]
---

# mdbase and TaskNotes

mdbase lets TaskNotes work with a portable Markdown collection instead of
hiding your tasks in a TaskNotes-only database. Every TaskNotes session opens
one mdbase collection.

## What is mdbase?

Two related names appear in TaskNotes:

- **mdbase** is the open collection format and specification. A collection is
  a folder of Markdown files plus a small description of what those files mean.
- **mdbase Connect** is the service that keeps your collections, syncs them
  with folders on your computers, and lets apps such as TaskNotes use them
  with your permission. It includes a desktop app for macOS, Windows and Linux.

Read the [mdbase introduction](https://mdbase.dev/) for a visual explanation of
the wider ecosystem.

## What it gives TaskNotes

TaskNotes understands what a task looks like inside an mdbase collection. That
compatibility is defined by the TaskNotes v5 collection format and its mdbase
0.3.0 binding. That means TaskNotes can:

- use the same task fields, projects, tags, saved views, and settings on the
  web, Android, and iOS;
- ask for access to one collection without seeing your other folders; and
- keep reminders running while TaskNotes is closed when your collection
  supports them.

Behind the scenes, mdbase checks that each change is valid before saving it.
You still own readable Markdown files rather than a database that only
TaskNotes can open.

## Where your collection lives

mdbase keeps a copy of each collection online, and TaskNotes reads and writes
that copy. A collection can start in one of two places:

| Start with | What happens |
| --- | --- |
| A new collection | It is created online. You can sync it to a folder on a computer later. |
| A folder on your computer | The mdbase Connect desktop app syncs it with an online copy. The folder stays where it is. |

[Choose a collection](/app/collections/) compares these in more detail.
[Connect TaskNotes to mdbase](/app/connect-mdbase/) has the setup steps.

## Use a folder on your computer

Install the mdbase Connect desktop app to sync a folder on your computer, such
as an Obsidian vault.

1. Open the [mdbase Connect download page](https://mdbase.dev/downloads/) and
   choose the desktop app for macOS, Windows, or Linux. Follow any
   platform-specific beta installation notes on that page.
2. Open mdbase Connect and sign in.
3. Add the folder, then turn on sync for it.
4. In TaskNotes, sign in with the same account and choose the collection.

[Connect TaskNotes to mdbase](/app/connect-mdbase/#use-a-folder-on-your-computer)
has the exact steps. For an Obsidian vault, follow
[Use TaskNotes App with your vault](/obsidian/guides/tasknotes-app/).

## Do I need to leave my computer on?

No. TaskNotes uses the online copy, so it keeps working while your computer is
asleep or off. Changes made in TaskNotes reach the folder on your computer the
next time mdbase Connect is running there, and changes made in the folder
reach TaskNotes the same way.

For more detail about how Connect protects and routes your data, read
[How mdbase Connect works](https://mdbase.dev/connect/).

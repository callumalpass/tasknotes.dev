---
title: mdbase and TaskNotes
description: Understand how TaskNotes uses hosted mdbase or the encrypted relay to reach a collection on your computer.
route: /app/mdbase/
product: app
platforms: [web, android, ios]
---

# mdbase and TaskNotes

mdbase lets TaskNotes work with a portable Markdown collection instead of
hiding your tasks in a TaskNotes-only database. Every TaskNotes session opens
one mdbase collection: either a collection hosted online or one kept on your
computer and reached through the encrypted relay.

## What is mdbase?

Two related names appear in TaskNotes:

- **mdbase** is the open collection format and specification. A collection is
  a folder of Markdown files plus a small description of what those files mean.
- **mdbase Connect** is the access service TaskNotes uses to ask for permission
  and connect to a hosted collection or a collection on your computer.

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

Behind the scenes, mdbase checks that each change is valid and writes it to the
main collection. You still own readable Markdown files rather than a database
that only TaskNotes can open.

## How the connection works

The mdbase collection is the source of truth. TaskNotes reads and writes it
directly and does not keep a separate offline collection, so opening tasks and
saving changes require a connection.

| Choice | Where the Markdown lives | What must be available |
| --- | --- | --- |
| Hosted mdbase | With the hosted provider | Your device must have a network connection |
| Connect to your computer | In a folder on your computer | Both devices must be online, and your computer must be running mdbase Connect |

[Choose a collection](/app/collections/) compares the TaskNotes behavior of
these options in more detail.

## Use a collection on your computer

Install the Electron-based mdbase Connect desktop app to make a folder on your
computer available to TaskNotes. It runs a small background service that keeps
TaskNotes connected to the Markdown folder. The download also includes command
line tools. The mdbase editor is online and is not part of the desktop app.

1. Open the [mdbase Connect download page](https://mdbase.dev/downloads/) and
   choose the package for macOS, Windows, or Linux.
2. Install and open mdbase Connect. Follow any platform-specific beta
   installation notes shown on the download page.
3. Add an existing mdbase folder on the computer, or create a collection.
4. In TaskNotes, choose **Connect to a computer** and select that collection.
5. Review the requested actions and approve the connection.

TaskNotes requests and responses travel through an end-to-end encrypted relay.
The relay passes the encrypted data along but cannot read your task contents.
You do not need to open an inbound port on your router.

The background service on your computer checks that TaskNotes has permission,
then reads or changes the Markdown files. It does not create another hosted or
offline copy of the collection.

## Do I need to leave my computer on?

Yes. Your computer holds the main copy, so it is part of the connection:

- It must be awake, connected to the internet, and running the mdbase Connect
  background service whenever TaskNotes needs remote access.
- Sleep, shutdown, a network outage, or a stopped connector makes the
  collection unavailable until the computer returns.
- Reminder delivery also depends on the computer remaining available.
- You are responsible for the computer's security, disk health, and backups.

This works well for an always-on desktop or home server. It is less convenient
for a laptop that sleeps or travels regularly. Hosted mdbase removes the
always-on-computer requirement, but it moves the main copy to a provider you
must trust. Both choices require a network connection while you use TaskNotes.

For more detail about how Connect protects and routes your data, read
[How mdbase Connect works](https://mdbase.dev/connect/).

## A practical recommendation

Choose **Hosted mdbase** if dependable access across several devices and
reminder delivery matter most. Choose **Connect to a computer** if keeping the
main Markdown folder on your own machine matters more and that machine can
remain available.

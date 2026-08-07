---
title: TaskNotes app
description: Use TaskNotes on the web, Android, and iOS with portable Markdown through mdbase.
route: /app/
product: app
platforms: [web, android, ios]
---

# TaskNotes app

The TaskNotes app is currently in beta. It is a web-first client packaged for
Android and iOS, designed for quick capture, daily review, editing, and
completion while keeping task records portable.

The app is compatible with **TaskNotes v5 collections**, which use the
**mdbase 0.3.0 specification**. The same collection can be used by other
compatible TaskNotes and mdbase tools.

Every TaskNotes session opens an mdbase collection. You can use a collection
hosted online or connect to a Markdown collection on your computer through the
encrypted mdbase relay. TaskNotes reads and writes that collection directly, so
changes require a connection.

<figure class="app-screenshot">
  <img src="/assets/app/today-workspace.webp" alt="TaskNotes Today workspace with desktop navigation, quick capture, and grouped task rows">
  <figcaption>The Today workspace in the desktop layout.</figcaption>
</figure>

## Begin here

1. [Open or install TaskNotes](/app/getting-started/).
2. [Learn how mdbase supports TaskNotes](/app/mdbase/).
3. [Choose where your collection lives](/app/collections/).
4. Create a task and open **Today**.
5. Turn on reminders only if the collection and platform support delivery.

## What the app includes

- Today, Upcoming, Projects, lists, boards, and calendars
- Capture, editing, completion, archive, and search
- Projects, contexts, tags, priorities, relationships, and custom fields
- Recurrence, materialized occurrence notes, reminders, and time tracking
- Hosted mdbase and end-to-end encrypted relay connections
- Browser, Android, and iOS packaging from the same application

Plugin-only functionality such as inline Obsidian widgets, the command palette,
external calendar integrations, HTTP APIs, and companion plugins is documented
under the [Obsidian plugin](/obsidian/).

---
title: Portable task records
description: The Markdown records, collection configuration, and task concepts shared by TaskNotes clients.
route: /concepts/task-records/
product: shared
---

# Portable task records

A TaskNotes task is an ordinary Markdown record with structured properties.
Those properties describe the task; the Markdown body remains available for
notes, checklists, links, and supporting detail.

## Collections

A collection is a group of records plus the configuration that explains how to
interpret them. The configuration defines field names, statuses, priorities,
custom properties, record locations, and saved views.

The TaskNotes app uses **collection** throughout. The Obsidian plugin usually
describes the containing folder as a **vault** and presents saved views through
Obsidian Bases.

## Source of truth

Where the authoritative copy lives depends on the client and connection:

| Client and collection | Source of truth | Availability |
| --- | --- | --- |
| TaskNotes app · hosted mdbase | Hosted collection | Requires a network connection |
| TaskNotes app · computer through relay | Collection on that computer | Requires the network, computer, and connector |
| Obsidian vault | Markdown files in the vault | Controlled by Obsidian and your sync choice |

## Portability and compatibility

Portable does not mean every client exposes every feature. Inline task widgets,
Obsidian commands, external calendar integrations, and companion plugins belong
to the Obsidian client. mdbase collection access and background reminder
delivery belong to the TaskNotes app.

Use the client-specific guide for interface instructions and the
[specification](/developers/specification/) for normative data semantics.

---
title: TaskNotes privacy overview
description: How the TaskNotes app and Obsidian plugin store data and when optional services are involved.
route: /privacy/
product: shared
last_updated: 2026-08-06
---

# TaskNotes privacy overview

Last updated: August 6, 2026

TaskNotes products are built around portable Markdown records. The storage and
network boundaries depend on the client and collection you choose.

## TaskNotes app

- The TaskNotes app opens every collection through mdbase and requires a
  connection to read or change it.
- A hosted collection stores the authoritative Markdown with the hosted
  provider.
- A computer collection keeps the authoritative Markdown on that computer.
  TaskNotes reaches it through an end-to-end encrypted relay that cannot read
  record contents; the computer must remain reachable and run mdbase Connect.
- TaskNotes keeps only a temporary in-memory session cache. It does not retain
  a separate offline collection after the app or page closes.
- Reminder notifications for mdbase collections require explicit permission
  and use content-free event payloads. Task content is refreshed through the
  authorized collection connection.

## Obsidian plugin

The plugin keeps task and note content in the local Obsidian vault. Plugin
settings live in Obsidian's plugin configuration. Network access occurs only
for enabled features that require it, including release checks, calendar
providers, ICS subscriptions, webhooks, and remotely loaded API documentation
assets.

## Analytics

TaskNotes does not include a product telemetry or analytics pipeline. Services
you choose to connect may keep their own operational, account, security, or
billing records under their respective policies.

## Removal

Removing a client does not necessarily remove its authoritative collection.
Use the hosted provider's controls for a hosted collection, or manage the
Markdown folder on the computer that owns a computer collection. Back up
records before removing an authoritative copy.

## Questions and source code

Use the relevant TaskNotes GitHub repository to report a privacy problem or
inspect the implementation:

- [TaskNotes app](https://github.com/callumalpass/tasknotes-app)
- [TaskNotes Obsidian plugin](https://github.com/callumalpass/tasknotes)

---
title: TaskNotes privacy overview
description: How the TaskNotes app and Obsidian plugin store data and when optional services are involved.
route: /privacy/
product: shared
last_updated: 2026-11-07
---

# TaskNotes privacy overview

Last updated: November 7, 2026

TaskNotes products are built around portable Markdown records. The storage and
network boundaries depend on the client and collection you choose.

TaskNotes is run by Callum Alpass, in Melbourne, Australia.

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

## TaskNotes Calendar (hosted service)

TaskNotes Calendar is an optional service that shows your Google Calendar
events in the TaskNotes web and mobile apps and lets you create, edit and
delete them there. It is only used if you sign in to it.

**What we receive from Google.** When you sign in, we receive your Google
account identifier, email address and name. When you connect calendars, we
receive access to the list of calendars you subscribe to and to the events on
them.

**What we store.**

- Your Google account identifier, email address and name, until you delete
  your account.
- Google access credentials, encrypted, until you disconnect, reconnect or
  delete your account.
- The details of your calendars, such as their names, until you disconnect or
  delete your account.
- Digests of your device sessions, which expire after 30 days without use and
  after 90 days at most.

**What we do not store.** Your calendar events pass through the service when
you view or change them. They are not saved on our servers.

**Logs.** Our logs record the route, method, status, duration and any error
code of each request. They do not include your identity, IP address, calendar
data or event content. Logs are kept for up to 7 days.

**Who processes this data.** The service runs on Cloudflare, which hosts it
and its database. Calendar data is exchanged with Google. We do not sell your
data, use it for advertising, or share it with anyone else, except where the
law requires it.

**Your choices.** You can disconnect your calendars or delete your account in
the app's settings at any time. Either one deletes our stored Google
credential and asks Google to revoke our access. Deleting your account removes
the data listed above, apart from a keyed digest of your identity, kept for
about an hour so that sign-ins already in progress cannot recreate the
account. Deleted data can remain in database backups for up to 30 days. You
can also remove access from your Google Account's linked apps page. Deleting
your account does not change your Google events or your tasks.

**Google API Services.** TaskNotes' use and transfer to any other app of
information received from Google APIs will adhere to the [Google API Services
User Data Policy](https://developers.google.com/terms/api-services-user-data-
policy), including the Limited Use requirements.

See the [TaskNotes Calendar terms](/terms/).

## Analytics

TaskNotes does not include a product telemetry or analytics pipeline. TaskNotes
Calendar keeps the operational logs described above. Services
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

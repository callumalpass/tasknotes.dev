---
title: Troubleshoot the TaskNotes app
description: Diagnose mdbase connection, authorization, refresh, and notification problems in the app.
route: /app/troubleshooting/
product: app
platforms: [web, android, ios]
---

# Troubleshoot the TaskNotes app

Start by recording the app version, platform, collection type, collection
status shown under **More**, and the smallest sequence that reproduces the
problem.

## The collection is unavailable

Confirm that the device is online and try **Reconnect this collection**.

## An authorization error appears

Use the reconnect action for the current collection and review the access that
mdbase requests. If you no longer want to use that collection, use the
collection switcher in the sidebar, or **Settings → Collection**, to open
another one.

## A change did not save

TaskNotes writes directly to mdbase and does not queue failed changes for later.
Restore the connection, then retry the action. Capture and editing screens keep
recoverable input visible when they can do so safely.

## A change from another tool is missing

Open **More** and choose **Refresh now**. If the record still does not appear,
confirm that the other tool wrote to the same mdbase collection and that the
record uses a compatible TaskNotes task definition. For a change made in a
folder on your computer, such as an Obsidian vault, check that mdbase Connect
is running on that computer and sync is on for the folder.

## Notifications do not arrive

Confirm that the current collection is an mdbase collection, reminders are
enabled in **More**, the browser or operating system permission is granted, and
the task contains a valid future reminder.

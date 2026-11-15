---
title: Connection and availability
description: Understand when TaskNotes can reach hosted and computer-connected mdbase collections.
route: /app/connection/
product: app
platforms: [web, android, ios]
---

# Connection and availability

TaskNotes reads and writes the selected mdbase collection directly. It does not
keep a separate offline collection or a queue of changes waiting to sync.

## What each status means

| Status | Meaning |
| --- | --- |
| Connected | TaskNotes can read and change the selected collection |
| Connecting | TaskNotes is checking the collection connection |
| Collection unavailable | TaskNotes cannot reach mdbase |

Open **More** to see the current status and use **Refresh now** to read the
latest collection state.

## What TaskNotes needs

TaskNotes needs a network connection and an available mdbase service. If
either is unavailable, TaskNotes cannot open the collection or save changes.
Reconnect the collection if its authorization has expired.

## Folders on your computer

When a collection is synced with a folder on your computer, TaskNotes uses the
online copy, so the computer can be off. Changes reach the folder the next time
mdbase Connect is running on that computer.

## During a connection problem

Tasks already visible in the current session may remain on screen during a
short interruption, but TaskNotes cannot safely save new changes until mdbase
is reachable. A failed action is not silently queued for later.

If the problem continues, use the collection switcher in the sidebar, or
**Settings → Collection**, to open another mdbase collection.

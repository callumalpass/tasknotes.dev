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
| Collection unavailable | The hosted service or connected computer cannot be reached |

Open **More** to see the current status and use **Refresh now** to read the
latest collection state.

## Hosted collections

A hosted collection needs a network connection and an available hosted mdbase
service. If either is unavailable, TaskNotes cannot open the collection or save
changes. Reconnect the collection if its authorization has expired.

## Collections on your computer

A computer collection also needs the computer holding the Markdown to be
awake, online, and running the mdbase Connect background service. TaskNotes
reaches it through the end-to-end encrypted relay. If the computer becomes
unavailable, access returns when the computer and connector return.

## During a connection problem

Tasks already visible in the current session may remain on screen during a
short interruption, but TaskNotes cannot safely save new changes until mdbase
is reachable. A failed action is not silently queued for later.

If the problem continues, open **More** and choose **Change collection** to use
another mdbase collection.

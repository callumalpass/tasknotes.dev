---
title: Reminders in the TaskNotes app
description: Understand reminder data, notification delivery, permissions, and collection requirements.
route: /app/reminders/
product: app
platforms: [web, android, ios]
---

# Reminders in the TaskNotes app

Task records can contain relative reminders anchored to scheduled or due dates,
or absolute reminders fixed to a particular time. Saving reminder data does not
by itself guarantee notification delivery.

## Delivery by collection

| Collection | Reminder data | Notification delivery |
| --- | --- | --- |
| Hosted mdbase | Saved in the collection | Available after opt-in |
| Computer through the relay | Saved in the collection | Available while the computer and connector remain available |

For mdbase collections, the authority schedules reminder events so delivery
does not depend on one TaskNotes screen remaining open. Notification payloads
are content-free; selecting one refreshes authorized collection state in the
app.

## Turn on reminders

Open **More**, select **Turn on reminders**, and approve the browser or operating
system permission. Some existing mdbase grants require **Review notification
access** before the channel can be enabled.

An unsupported or insecure browser reports that notification delivery is not
available. The reminder definitions remain in the task record.

---
title: Connect TaskNotes to mdbase
description: Start a new collection, or sync a folder on your computer with mdbase Connect, and open it in TaskNotes.
route: /app/connect-mdbase/
product: app
platforms: [web, android, ios]
---

# Connect TaskNotes to mdbase

TaskNotes keeps your tasks in an mdbase collection: a folder of Markdown
files. You can start a new collection online, or sync a folder that is already
on your computer. Either way, mdbase keeps a copy online, so TaskNotes works on
the web, iPhone and Android even while your computer is off.

Read [What is mdbase?](/app/mdbase/) for more background, or
[Choose a collection](/app/collections/) to compare the options.

## Try it without an account

Open [app.tasknotes.dev](https://app.tasknotes.dev/) in a browser. Without an
account, TaskNotes opens a collection saved only in that browser. When you
connect later, TaskNotes offers to **Bring it in** to the collection you
choose.

## Start a new collection

1. Open [TaskNotes](https://app.tasknotes.dev/) or its iPhone or Android app
   and sign in to mdbase. You can create an account there.
2. On the **Open in TaskNotes** page, enter a name under **New collection
   name**, or choose a collection you already have.
3. Choose **Open TaskNotes**.
4. The first time TaskNotes opens a collection, it asks to set it up. See
   [First-time setup](#first-time-setup).

## Use a folder on your computer

Use this for an existing folder of Markdown task notes, such as an Obsidian
vault. If it is an Obsidian vault, follow
[Use TaskNotes App with your vault](/obsidian/guides/tasknotes-app/) instead:
it has the steps for the TaskNotes plugin as well.

1. Install the [mdbase Connect desktop app](https://mdbase.dev/downloads/) for
   macOS, Windows or Linux, and open it.
2. Choose **Sign in with your browser**. In the browser, sign in or create an
   account, then choose **Approve computer**.
3. Choose **Add existing folder** and select the folder. Select the top folder
   of the collection, not a `tasks` folder inside it. The folder stays where it
   is.
4. Open **Collections**, open the folder's **…** menu and choose **Turn on
   sync**, then choose **Turn on sync** again. mdbase Connect uploads the files
   and keeps them in sync. TaskNotes can use the folder only once sync is on.
5. Open TaskNotes, sign in with the same account, choose the collection and
   choose **Open TaskNotes**.
6. The first time, TaskNotes asks to set up the collection. See
   [First-time setup](#first-time-setup).

Changes you make in TaskNotes reach the folder whenever mdbase Connect is
running on that computer. Changes you make in the folder reach TaskNotes the
same way.

## First-time setup

The first time TaskNotes opens a collection, it may show **Set up
_collection_ for TaskNotes**. Setup adds or updates the task type and saved
views that TaskNotes needs. It keeps your notes and any changes you made to
those definitions. Choose **Set up** to continue, or **Continue** if nothing
needs to change.

**If the collection is an Obsidian vault**, update the TaskNotes plugin to
version 5 on every device that uses the vault before you set it up. Setup
writes the task type whether or not type definitions are turned on in
Obsidian, and TaskNotes 4 can overwrite it.

## Switch collections

Use the collection switcher in the sidebar, or **Settings → Collection**, and
choose a collection. **Add a collection…** opens mdbase so you can choose
another collection. Switching collections does not copy or move their records.

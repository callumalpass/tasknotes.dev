---
title: A to-do app that stores each task as a Markdown file
description: TaskNotes keeps each task in its own .md file. Start in your browser without an account, then sync a folder to read and edit those files on your computer.
route: /guides/markdown-todo/
platforms: [web]
---

# A to-do app that stores each task as a Markdown file

You need a browser to try this. To keep the files in a folder you can open in a text editor, you also need an mdbase account and the mdbase Connect desktop app. You can do the whole setup without Obsidian.

## 1. Start in the browser

Open [TaskNotes](https://app.tasknotes.dev/). You can create a task straight away. If the workspace says **No views yet**, choose **Add starter views** to get **Today**, **Inbox** and the other lists.

<figure class="app-screenshot">
  <img src="/assets/guides/browser-workspace.webp" width="1400" height="658" alt="TaskNotes in a browser with New task in the sidebar and three scheduled tasks in Today">
  <figcaption>“Saved only in this browser” tells you where the tasks are until you connect a collection.</figcaption>
</figure>

## 2. Write a task and find its file

Choose **New task**. Try typing `Measure the kitchen window today`. TaskNotes puts “Measure the kitchen window” in the title and turns “today” into a scheduled date. Choose **Notes**, write a measurement instruction, then choose **Add**.

<figure class="app-screenshot guide-recording">
  <video controls muted playsinline preload="none" loading="lazy" width="1120" height="762" poster="/assets/guides/new-task.webp" aria-label="Create a scheduled task with a note and save it to Today">
    <source src="/assets/guides/create-task.mp4" type="video/mp4">
  </video>
  <img class="motion-still" src="/assets/guides/new-task.webp" width="1280" height="870" alt="New task form with the parsed Scheduled Today field, the measurement instruction under Notes, and Add">
  <figcaption>Watch the date move out of the title and into the schedule.</figcaption>
</figure>

Open the task from **Today**. Its file path appears at the bottom of the task details. **Copy path** copies the location relative to the collection folder.

<figure class="app-screenshot">
  <img src="/assets/guides/markdown-path.webp" width="806" height="246" alt="Task details show tasks/20261124174342.md above the Copy path button">
  <figcaption>This collection uses a timestamp for the filename. The title lives inside the file.</figcaption>
</figure>

## 3. Keep the files on your computer

So far the tasks belong to this browser profile. Clearing the site’s storage can erase them. To keep working with them as ordinary files, create a folder for the collection and bring your tasks into it.

1. Install [mdbase Connect](https://mdbase.dev/downloads/) on your computer. Choose **Sign in with your browser**, sign in or create an account, and choose **Approve computer**.
2. In the desktop app, choose **Create collection**. Give it a name such as `Household`, choose where to create its folder, and confirm. In **Collections**, open its **…** menu, choose **Turn on sync**, and confirm the default cloud copy.
3. Back in the **same browser profile**, choose **Connect to sync your work**. Sign in with the same account, select **Household** under **Open in TaskNotes**, then choose **Open TaskNotes**. If asked, confirm setup of the task type and starter views.
4. When TaskNotes offers to bring your work into Household, choose **Bring it in**. Review any file renames it proposes. With mdbase Connect running, open the Household folder on your computer and look for the path shown in the task details.

## Read the Markdown

Here is the file TaskNotes wrote for the window measurement. The block between the `---` lines is YAML frontmatter. The instruction beneath it is the Markdown body.

```markdown
---
title: Measure the kitchen window
status: open
priority: normal
scheduled: "2026-11-24"
dateCreated: "2026-11-24T06:43:43.014Z"
dateModified: "2026-11-24T06:43:43.014Z"
tags: [task]
id: e1173327-29b8-4404-b235-156a657d92d0
mobileRevision: 1
type: task
---
Measure inside the frame before ordering the blind.
```

Open the file in a text editor, add the width and height below the instruction, and save. Once the folder syncs, open the task in the browser to see the measurements under **Notes**. With the default cloud copy, your computer can be off while you use the web app. It needs to be running again for changes to reach the folder.

For the relationship between a task file, its fields and its collection, see [Portable task records](/concepts/task-records/).

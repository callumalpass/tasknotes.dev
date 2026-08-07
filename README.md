# tasknotes.dev

The public documentation site for the TaskNotes product family.

This repository owns public, authored documentation and its assets. Product
repositories remain authoritative for release notes, generated reference data,
and internal engineering documentation. `tasknotes-spec` remains authoritative
for the formal TaskNotes specification.

## Ownership

| Repository | Owns |
| --- | --- |
| `tasknotes.dev` | Public authored prose, navigation, policies, redirects, and public documentation assets |
| `tasknotes` | Obsidian plugin release notes, generated plugin references, and internal documentation |
| `tasknotes-app` | App release notes, generated app metadata, and internal documentation |
| `tasknotes-spec` | The formal TaskNotes specification |

Imported material is assembled during `npm run content:generate`. Local
development finds sibling repositories under `/home/calluma/projects` by
default. CI can set `TASKNOTES_PLUGIN_ROOT`, `TASKNOTES_APP_ROOT`, and
`TASKNOTES_SPEC_ROOT` to checked-out source paths.

## Development

```sh
npm install
npm run dev
```

Build and validate the complete site with:

```sh
npm test
```

The production site is intended for `https://tasknotes.dev`. The TaskNotes web
application remains a separate deployment at `https://app.tasknotes.dev`.

## Publication

This repository owns the `tasknotes.dev` publication workflow. The product
repositories retain their release notes, generated references, and internal
documentation, but do not deploy the public documentation site.

# All Projects Archive

This repository is a private backup index for the projects stored under
`C:\all projects`.

The goal is preservation, not portfolio pruning. Project folders stay intact on
disk unless they are intentionally removed after a verified GitHub backup.

## Backup Strategy

- Keep source code, notebooks, configs, docs, and small assets in Git.
- Keep dependency folders, build outputs, caches, temp files, and local secrets
  out of Git.
- Back up very large files as GitHub Release assets because normal GitHub Git
  rejects files of 100 MB or larger.
- Handle folders that are already Git repositories as standalone projects.

## Important Docs

- [GitHub backup guide](docs/github-backup-guide.md)
- [Project index](docs/project-index.md)
- [Dependency overview](docs/dependencies.md)
- [Large file manifest](docs/large-file-manifest.md)

## Current Remote

Repository: `NiksheyYadav/all-of-my-projects-unveiled`

Visibility: private, so research data, experiments, and accidental local files
are not exposed publicly.

Release backup tag: `folder-backup-2026-05-23`

Backup helper scripts:

- `tools/upload-folder-release.ps1`
- `tools/upload-standalone-folders.ps1`

## Restore Notes

Clone this repository for the index and source files. Download matching GitHub
Release assets for large archived folders or files, then follow the restore
steps in `docs/github-backup-guide.md`.

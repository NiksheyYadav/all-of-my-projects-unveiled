# GitHub Backup Guide

This folder is being prepared as a GitHub backup, not as a cleaned public
portfolio. No project source should be deleted as part of preparation.

## Why This Uses Releases For Large Files

GitHub has hard limits for normal Git pushes:

- Regular Git files are blocked at 100 MB.
- A single push is capped at 2 GiB.
- Git LFS has a 2 GB per-file limit on GitHub Free/Pro and only 10 GiB of
  included monthly storage.

This workspace has 46 files over 100 MB, totaling about 23.95 GB, including two
files over 2 GB. Those files cannot all be safely stored in normal Git or free
Git LFS. They should be backed up as GitHub Release assets or split release
chunks.

Sources:

- https://docs.github.com/repositories/creating-and-managing-repositories/repository-limits
- https://docs.github.com/github/managing-large-files/about-git-large-file-storage
- https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-storage-and-bandwidth-usage
- https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases

## Safe Upload Flow

1. Keep the repository private.
2. Commit backup metadata, docs, and small source files.
3. Push standalone Git projects from their own folders.
4. Upload large files or chunked folder archives as GitHub Release assets.
5. Verify by cloning/downloading to a separate location.
6. Only after verification, remove local folders to reclaim disk space.

Current release tag for archived folder chunks: `folder-backup-2026-05-23`

Helper scripts used in this workspace:

- `tools/upload-folder-release.ps1`
- `tools/upload-standalone-folders.ps1`

## Restore Release Chunks

If a folder was uploaded as chunked tar parts:

```powershell
copy /b folder.tar.part-* folder.tar
tar -xf folder.tar
```

Keep the uploaded manifest/checksum file with the chunks so each archive can be
verified after download.

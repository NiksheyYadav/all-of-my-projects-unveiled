# Dependency Overview

This is a mixed archive containing web apps, Python/ML projects, documents,
research code, and small experiments. Dependencies should be restored per
project from the files inside each folder.

## Common Runtimes

- Node.js and npm for React, Next.js, Vite, and CLI projects.
- Python for notebooks, ML experiments, API servers, and scripts.
- Git LFS for large binary/data artifacts when a project chooses to use LFS.
- Docker for projects with `docker-compose.yml`, `Dockerfile`, or deployment
  manifests.

## Dependency Files To Look For

- Node.js: `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`
- Python: `requirements.txt`, `pyproject.toml`, `Pipfile`, `environment.yml`
- Docker: `Dockerfile`, `docker-compose.yml`, `compose.yaml`
- Other ecosystems: `Cargo.toml`, `go.mod`, `pom.xml`, `build.gradle`

## Root Tooling

The root `package.json` currently exists only to provide local tooling:

- `gitnexus`

Do not treat root `node_modules` as project source. It can be recreated with
`npm install` if needed.

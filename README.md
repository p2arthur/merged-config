# Hybrid Shared Config

Reusable GitHub Actions that keep the pinned, security-minded workflows from `shared-config` and layer on the orchestration/layout patterns from `ref-shared-config`.

## Why this beats the parents
- **Security + durability (from `shared-config`)**: pinned external actions, npm/uv audit steps, commitlint, and OIDC-ready semantic releases to npm/PyPI. Releases run with bot tokens and trusted publishing instead of ad-hoc installs.
- **Orchestration ergonomics (from `ref-shared-config`)**: one entrypoint (`on-merge-main`) that chains CI → docs → release, a branch-sync helper (`on-merge-release`), and a ready-made Node build+zip workflow.
- **Docs options (mixed)**: `shared-config`’s TypeDoc/Sphinx builders and Pages publish, plus `ref-shared-config`’s DevPortal branch publisher so you can target both GitHub Pages and the Algorand portal.
- **Local-first wiring**: workflows call the included composite actions via `./actions/...`, so consumers pin the repo once (tag/SHA) and avoid fetching external repos at runtime.
- **Config reuse**: ESLint/Prettier configs stay available for TS repos, preserving `shared-config`’s developer experience.

## What You Get
- **Orchestration workflows** (from `ref-shared-config` style): `on-merge-main.yml` chains CI → docs → release; `on-merge-release.yml` syncs `main` ⇄ `release`; `node-build-zip.yml` builds and zips Node artifacts.
- **Secure core workflows** (from `shared-config`): `ci.yml`, `pr.yml`, `release.yml`, `docs.yml` with pinned third-party actions, audits, commit linting, uv-based Python CI, and OIDC-ready semantic releases to npm/PyPI.
- **Composite actions** (from `shared-config`): Node/Python CI with audit/lint/test/build, release actions for npm/PyPI, docs builders (TypeDoc/Sphinx) + publish, bot-token + commitlint utilities. Workflows call these via local paths (no external fetch).
- **DevPortal publishing**: Optional docs publishing flow to a dedicated docs branch for Algorand DevPortal consumption (`actions/docs/devportal-publish`), toggle via `docs.yml` input `publish-devportal`.
- **Config artifacts**: ESLint/Prettier configs remain available for TypeScript consumers.

## Quick Starts
### End-to-end on merge to main
```yaml
jobs:
  on-main:
    uses: <owner>/<repo>/.github/workflows/on-merge-main.yml@main
    with:
      project-type: node    # or python
      publish-docs: true
    secrets:
      BOT_ID: ${{ secrets.BOT_ID }}
      BOT_SK: ${{ secrets.BOT_SK }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}   # if needed
      PYPI_TOKEN: ${{ secrets.PYPI_TOKEN }} # if python + publish
```

### Sync release branch after prod promotion
```yaml
jobs:
  sync-release:
    uses: <owner>/<repo>/.github/workflows/on-merge-release.yml@main
    with:
      main-branch: main
      release-branch: release
    secrets:
      BOT_ID: ${{ secrets.BOT_ID }}
      BOT_SK: ${{ secrets.BOT_SK }}
```

### Build and zip a Node artifact
```yaml
jobs:
  build-zip:
    uses: <owner>/<repo>/.github/workflows/node-build-zip.yml@main
    with:
      node-version: "22"
      build-path: dist
      artifact-name: package
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }} # if private deps
      GH_TOKEN: ${{ secrets.GH_TOKEN }}   # optional for checkout
```

## How it works (what shines where)
- **CI and PR gates (mrcointreau)**: `ci.yml` and `pr.yml` use the `shared-config` composites for audit/lint/test/build (Node and Python via uv), plus commitlint as an optional PR guard.
- **Release (mrcointreau)**: `release.yml` wraps semantic-release with bot-token generation and OIDC trusted publishing; supports npm and PyPI with configurable config-path/dry-run.
- **Docs (mix)**: `docs.yml` builds via TypeDoc/Sphinx (shared-config) and can publish to GitHub Pages or optionally to a DevPortal branch (ref-style publisher).
- **End-to-end orchestration (p2arthur)**: `on-merge-main` ties CI → docs → release for a single trigger; `on-merge-release` automates main/release sync; `node-build-zip` standardizes Node artifact packaging.
- **Distribution model**: consumers call workflows by repo tag/SHA (e.g., `uses: <owner>/<repo>/.github/workflows/ci.yml@vX.Y.Z`), which pins all included composites automatically.

## Contents
```
.github/workflows/
  ci.yml              # Audit + lint + test + build (node/python)
  pr.yml              # CI + optional conventional commit lint
  docs.yml            # Build/publish docs (TypeDoc/Sphinx)
  release.yml         # semantic-release with bot token + OIDC
  on-merge-main.yml   # Orchestrates CI → docs → release
  on-merge-release.yml# Syncs main/release branches
  node-build-zip.yml  # Build + upload Node artifact
actions/              # Composite actions (ci/release/docs/utils)
configs/              # ESLint + Prettier configs
```

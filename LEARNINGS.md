# Choosing What to Prioritize from `shared-config` vs `ref-shared-config`

As a junior-friendly note, here’s why the merged setup leans on specific pieces from `shared-config` instead of `ref-shared-config`.

## Why prioritize `shared-config` pieces
- **Security posture**: Third-party actions are pinned to commit SHAs, reducing supply-chain drift. `ref-shared-config` often pulls floating versions (e.g., `@v4`), which can change silently.
- **Built-in audits**: Node CI runs `npm audit`; Python CI uses `uv` + `pip-audit`. `ref-shared-config`’s CI doesn’t audit by default.
- **Release hardening**: Release workflows/actions support OIDC trusted publishing for npm/PyPI and use a GitHub App bot token; `ref-shared-config` installs semantic-release at runtime without OIDC or pinning.
- **Commit hygiene**: PR flow can enforce conventional commits via a commitlint action; `ref-shared-config` lacks this step.
- **Language parity**: Python uses `uv` with lint/test/build options; Node is configurable for lint/test/build with skip flags. `ref-shared-config` has fixed Poetry commands and minimal knobs.
- **Local action references**: Using local `./actions/...` keeps everything self-contained, avoids fetching from `main`, and lets consumers pin the entire repo to a tag/SHA.

## What we borrowed from `ref-shared-config`
- **Ergonomic orchestration**: The `on-merge-main` pattern that chains CI → docs → release, plus the branch-sync `on-merge-release` workflow.
- **Artifact convenience**: A Node build+zip workflow for packaging outputs.

## How to think about structure
- Keeping composite actions outside `.github` (e.g., in `actions/`) is allowed and makes them reusable and testable locally. If you prefer everything under `.github/actions`, you can move them and adjust `uses:` paths; it’s a convention choice, not a rule.
- Referencing local actions (`uses: ./actions/...`) is safer and faster when you vend a bundled repo. Referencing remote paths (`owner/repo/.github/actions/...@tag`) is useful when consuming from another repo; in that case, pin to a tag or commit.

## Takeaways
- Start from the more secure, configurable base (`shared-config`), then layer ergonomics/convenience from `ref-shared-config`.
- Keep workflows pinned and auditable; add orchestration and packaging as needed.
- Decide on action location (`./actions` vs `.github/actions`) and `uses:` style (local vs remote) based on how you plan to distribute and consume the repo.***

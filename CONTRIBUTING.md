# Contributing to @mrcointreau/shared-config

Thank you for your interest in contributing to @mrcointreau/shared-config! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment for everyone.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [npm](https://www.npmjs.com/) >= 10
- [Git](https://git-scm.com/)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/shared-config.git
   cd shared-config
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Project Structure

```
.
├── .github/workflows/    # Reusable GitHub Actions workflows
├── actions/              # Composite GitHub Actions
│   ├── ci/               # CI actions (node, python)
│   ├── release/          # Release actions (node, python)
│   ├── docs/             # Documentation actions
│   └── utils/            # Utility actions
└── configs/              # Shared configurations (ESLint, Prettier)
```

## Development Workflow

### Working with Workflows

When modifying reusable workflows (`.github/workflows/*.yml`):

1. Test changes in a separate repository by referencing your fork
2. Ensure all inputs are properly documented
3. Use pinned action versions with commit SHAs for security
4. Follow the existing patterns for input validation

### Working with Composite Actions

When modifying composite actions (`actions/**/*.yml`):

1. Update the `action.yml` with clear descriptions
2. Document all inputs and outputs
3. Test the action in isolation before integrating

### Working with Configs

When modifying shared configurations (`configs/`):

1. Ensure backward compatibility
2. Document any new options or rules
3. Test with a sample project

## Making Changes

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). All commit messages must follow this format:

```
type(scope): brief description

Longer description if needed
```

**Types:**

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks (deps, CI, etc.)

**Scopes:**

- `ci` - CI workflow changes
- `pr` - PR workflow changes
- `release` - Release workflow changes
- `docs` - Documentation workflow changes
- `eslint` - ESLint config changes
- `prettier` - Prettier config changes
- `deps` - Dependency updates

**Examples:**

```
feat(ci): add support for custom install command
fix(release): correct npm provenance flag handling
docs: update README with new workflow inputs
chore(deps): update semantic-release to v24
```

### Pull Request Process

1. Ensure your branch is up to date with `main`
2. Verify all CI checks pass
3. Fill out the pull request template completely
4. Request review from maintainers
5. Address any feedback promptly

### Code Style

- Use 2-space indentation for YAML files
- Follow the existing code patterns
- Keep actions and workflows well-documented
- Use descriptive names for inputs and outputs

## Testing Changes

### Testing Workflows Locally

You can test workflow changes by:

1. Pushing to your fork
2. Creating a test repository that references your fork:
   ```yaml
   jobs:
     test:
       uses: YOUR_USERNAME/shared-config/.github/workflows/ci.yml@your-branch
       with:
         project-type: node
   ```

### Testing Composite Actions

Test composite actions by referencing them directly:

```yaml
steps:
  - uses: YOUR_USERNAME/shared-config/actions/ci/node@your-branch
    with:
      node-version: "20"
```

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Workflow/action version used
- Links to failed workflow runs (if applicable)
- Relevant logs or error messages

### Feature Requests

For feature requests, please include:

- A clear description of the feature
- The problem it solves
- Use cases and examples
- Any alternative solutions considered

## Release Process

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated versioning. Releases are triggered automatically when commits are merged to `main` (beta) or `release` (stable):

- `fix:` commits trigger a patch release
- `feat:` commits trigger a minor release
- `BREAKING CHANGE:` in commit body triggers a major release

## Questions?

If you have questions, feel free to:

- Open an [issue](https://github.com/mrcointreau/shared-config/issues)
- Start a [discussion](https://github.com/mrcointreau/shared-config/discussions)

---

Thank you for contributing!

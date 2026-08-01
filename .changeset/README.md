# Changesets

Version bumps and changelog entries are driven from this folder, so a release is
never a manual edit of `package.json` and `CHANGELOG.md`.

## Adding a changeset

Every pull request that changes shipped behaviour should include one:

```bash
npx changeset
```

Pick the bump (`patch` / `minor` / `major`), write a line describing the change
from a **consumer's** point of view, and commit the generated Markdown file
alongside your code.

## Releasing

```bash
npx changeset version   # consumes the files here, bumps the version, writes CHANGELOG.md
npm install             # refresh the lockfile
git commit -am "Release vX.Y.Z"
git tag vX.Y.Z
git push --follow-tags
```

Pushing the tag triggers `.github/workflows/release.yml`, which lints, tests,
builds, verifies the tag matches `package.json`, and publishes to npm with
provenance.

## Writing a good entry

Describe the change, not the diff:

- **Good** — "`showIf` now re-evaluates when `setContext` runs, so a step whose
  condition becomes false is skipped instead of staying on screen."
- **Bad** — "fix engine.ts"

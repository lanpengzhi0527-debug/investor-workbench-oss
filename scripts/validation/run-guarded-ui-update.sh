#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[[ -n "$ROOT" ]] || { echo "ERROR: run inside a git repository" >&2; exit 2; }
cd "$ROOT"

[[ -z "$(git status --porcelain)" ]] || { echo "ERROR: working tree must be clean" >&2; exit 3; }

BASE_SHA="$(git rev-parse HEAD)"
BRANCH="oss-guarded-update-$(date +%Y%m%d%H%M%S)"
git checkout -b "$BRANCH"

rollback() {
  git reset --hard "$BASE_SHA" >/dev/null 2>&1 || true
  echo "ROLLBACK_PERFORMED=yes"
}
trap 'rc=$?; if [[ $rc -ne 0 ]]; then rollback; fi' EXIT

# This candidate intentionally performs no automatic patching.
# A maintainer or coding agent may edit only after branch creation.
# The validation gate below must pass before any proposed merge.

npm test
bash scripts/validation/scan-public-boundary.sh

echo "GUARDED_UPDATE_VALIDATION=PASS"
echo "branch=$BRANCH"
echo "human_review_required=true"

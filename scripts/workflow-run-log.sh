#!/usr/bin/env bash
set -euo pipefail

# Log workflow execution metadata to security/workflow-run.ndjson
# Captures GitHub context and workflow inputs to support TS/Python consumers.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

OUT_DIR="${LOG_DIR:-$REPO_ROOT/security}"
LOG_FILE="$OUT_DIR/workflow-run.ndjson"

timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

mkdir -p "$OUT_DIR"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to write workflow execution logs" >&2
  exit 1
fi

jq -nc \
  --arg ts "$timestamp" \
  --arg workflow "${GITHUB_WORKFLOW:-}" \
  --arg workflow_ref "${GITHUB_WORKFLOW_REF:-}" \
  --arg repo "${GITHUB_REPOSITORY:-}" \
  --arg ref "${GITHUB_REF:-}" \
  --arg sha "${GITHUB_SHA:-}" \
  --arg actor "${GITHUB_ACTOR:-}" \
  --arg run_id "${GITHUB_RUN_ID:-}" \
  --arg run_attempt "${GITHUB_RUN_ATTEMPT:-}" \
  --arg event_name "${GITHUB_EVENT_NAME:-}" \
  --arg job "${JOB_NAME:-}" \
  --arg project_type "${PROJECT_TYPE:-}" \
  --arg working_dir "${WORKING_DIR:-}" \
  --arg skip_audit "${SKIP_AUDIT:-}" \
  --arg skip_lint "${SKIP_LINT:-}" \
  --arg skip_test "${SKIP_TEST:-}" \
  --arg skip_build "${SKIP_BUILD:-}" \
  --arg pre_test_script "${PRE_TEST_SCRIPT:-}" \
  --arg lint_command "${LINT_COMMAND:-}" \
  --arg test_command "${TEST_COMMAND:-}" \
  --arg build_command "${BUILD_COMMAND:-}" \
  '{
    timestamp: $ts,
    workflow: $workflow,
    workflow_ref: $workflow_ref,
    job: $job,
    repo: $repo,
    ref: $ref,
    sha: $sha,
    actor: $actor,
    run_id: $run_id,
    run_attempt: $run_attempt,
    event: $event_name,
    project_type: $project_type,
    working_directory: $working_dir,
    config: {
      skip_audit: $skip_audit,
      skip_lint: $skip_lint,
      skip_test: $skip_test,
      skip_build: $skip_build,
      pre_test_script: $pre_test_script,
      lint_command: $lint_command,
      test_command: $test_command,
      build_command: $build_command
    }
  }' >>"$LOG_FILE"

echo "Logged workflow execution to $LOG_FILE"

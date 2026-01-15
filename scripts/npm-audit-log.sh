#!/usr/bin/env bash
set -euo pipefail

# Run npm audit, capture JSON, and append a summarized record to security/vuln-log.ndjson.
# Designed to be non-mutating (no auto-fix); logs severity counts and advisories with fix availability.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

OUT_DIR="${OUT_DIR:-$REPO_ROOT/security}"
LOG_FILE="$OUT_DIR/vuln-log.ndjson"
RAW_JSON="$OUT_DIR/npm-audit.json"

timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

mkdir -p "$OUT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found in PATH" >&2
  exit 1
fi

# Run audit; tolerate failures to still log findings.
if npm audit --production --audit-level=moderate --json >"$RAW_JSON"; then
  audit_status="ok"
else
  audit_status="failed"
  echo "npm audit reported issues; continuing to log results." >&2
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to summarize npm audit output" >&2
  exit 1
fi

jq -c --arg ts "$timestamp" --arg status "$audit_status" '
  {
    timestamp: $ts,
    tool: "npm-audit",
    status: $status,
    summary: {
      total: (.metadata.vulnerabilities.total // 0),
      critical: (.metadata.vulnerabilities.critical // 0),
      high: (.metadata.vulnerabilities.high // 0),
      moderate: (.metadata.vulnerabilities.moderate // 0),
      low: (.metadata.vulnerabilities.low // 0)
    },
    advisories: [
      (.vulnerabilities // [] | .[] | {
        name,
        severity,
        via,
        range,
        dependency: .name,
        fixAvailable
      })
    ]
  }
' "$RAW_JSON" >>"$LOG_FILE"

echo "Logged audit results to $LOG_FILE"

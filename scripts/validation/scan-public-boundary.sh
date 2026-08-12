#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

fail=0
check_forbidden() {
  local label="$1" pattern="$2"
  if grep -RInE --exclude-dir=.git --exclude='scan-public-boundary.sh' --exclude='independent-release-scan.py' "$pattern" . >/tmp/iw_scan_matches 2>/dev/null; then
    echo "FAIL [$label]"
    cat /tmp/iw_scan_matches
    fail=1
  else
    echo "PASS [$label]"
  fi
}

check_forbidden "absolute_private_paths" '(/Users/|/home/[^/]+/|[A-Za-z]:\\Users\\)'
check_forbidden "private_project_names" '(hermes-workspace|hermes_capital_os)'
check_forbidden "private_financial_markers" '(IBKR|Interactive Brokers|account_id|transaction_id)'
check_forbidden "private_research_tickers" '\b(NBIS|MU|SNDK|AMD|CEG|COHR|LITE|CRDO|BTI|AAOI|TLN|VRT|CIEN|FN|APLD|ARM|CIFR|CORZ|CRWV|DRAM|EME|ETN|GLXY|HUT|IREN|NRG|PWR|VST|WULF|MEMORY)\b'
check_forbidden "credential_literals" '(api[_-]?key[[:space:]]*[:=][[:space:]]*[A-Za-z0-9_./+-]{16,}|secret[[:space:]]*[:=][[:space:]]*[A-Za-z0-9_./+-]{16,}|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY)'

if [[ "$fail" -ne 0 ]]; then
  echo "PUBLIC_BOUNDARY_SCAN=FAIL"
  exit 1
fi

echo "PUBLIC_BOUNDARY_SCAN=PASS"

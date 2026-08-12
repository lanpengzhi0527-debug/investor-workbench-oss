#!/usr/bin/env python3
"""Independent, standard-library-only scan for obvious public-release leaks."""
from __future__ import annotations

import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SELF = Path(__file__).resolve()
OTHER_SCANNER = ROOT / 'scripts/validation/scan-public-boundary.sh'
SKIP_DIRS = {'.git', 'node_modules', 'dist', 'artifacts'}
BINARY_SUFFIXES = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.zip', '.gz', '.pdf'}

# Keep patterns outside the shell scanner implementation and scan all public text.
patterns = {
    'private_absolute_path': re.compile(r'(?:/Users/[^/\s]+/|/home/[^/\s]+/|[A-Za-z]:\\Users\\)', re.I),
    'private_project_name': re.compile(r'(?:hermes-workspace|hermes_capital_os)', re.I),
    'private_financial_marker': re.compile(r'\b(?:IBKR|Interactive Brokers|account_id|transaction_id)\b', re.I),
    'private_research_ticker': re.compile(r'\b(?:NBIS|MU|SNDK|AMD|CEG|COHR|LITE|CRDO|BTI|AAOI|TLN|VRT|CIEN|FN|APLD|ARM|CIFR|CORZ|CRWV|DRAM|EME|ETN|GLXY|HUT|IREN|NRG|PWR|VST|WULF|MEMORY)\b'),
    'private_key_header': re.compile(r'BEGIN (?:RSA|OPENSSH|EC|DSA) PRIVATE KEY'),
    'github_token': re.compile(r'\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b'),
    'openai_style_key': re.compile(r'\bsk-[A-Za-z0-9_-]{20,}\b'),
    'aws_access_key': re.compile(r'\bAKIA[0-9A-Z]{16}\b'),
    'generic_secret_assignment': re.compile(r'(?i)\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*["\']?[A-Za-z0-9_./+\-=]{20,}'),
}

allow_entropy_files = {'SHA256SUMS'}
findings: list[str] = []

def entropy(s: str) -> float:
    if not s:
        return 0.0
    counts = {c: s.count(c) for c in set(s)}
    return -sum((n / len(s)) * math.log2(n / len(s)) for n in counts.values())

for path in ROOT.rglob('*'):
    if not path.is_file() or path in {SELF, OTHER_SCANNER}:
        continue
    rel = path.relative_to(ROOT)
    if any(part in SKIP_DIRS for part in rel.parts) or path.suffix.lower() in BINARY_SUFFIXES:
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue
    for label, pattern in patterns.items():
        for match in pattern.finditer(text):
            line = text.count('\n', 0, match.start()) + 1
            findings.append(f'{rel}:{line}: {label}: {match.group(0)[:80]}')
    if path.name not in allow_entropy_files:
        for line_no, line in enumerate(text.splitlines(), 1):
            for token in re.findall(r'[A-Za-z0-9_+/=-]{32,}', line):
                if len(set(token)) >= 12 and entropy(token) >= 4.5:
                    # Ignore ordinary prose/identifiers and documented hashes by requiring key-like punctuation context.
                    lowered = line.lower()
                    if any(word in lowered for word in ('key=', 'key:', 'token=', 'token:', 'secret=', 'secret:', 'password=', 'password:')):
                        findings.append(f'{rel}:{line_no}: high_entropy_secret_candidate: {token[:24]}…')

if findings:
    print('INDEPENDENT_RELEASE_SCAN=FAIL')
    for finding in findings:
        print(finding)
    sys.exit(1)

print('INDEPENDENT_RELEASE_SCAN=PASS')

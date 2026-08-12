#!/usr/bin/env python3
"""Deterministic browser-level smoke test using synthetic fixtures only.

The harness executes the repository's actual JavaScript modules in a browser by
building a temporary in-memory test bundle. It performs no network requests.
"""
from __future__ import annotations

import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(os.environ.get('IW_SMOKE_OUT', ROOT / 'artifacts/browser-smoke')).resolve()
OUT.mkdir(parents=True, exist_ok=True)

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print('BROWSER_SMOKE=SKIP playwright_not_installed')
    raise SystemExit(0)

browser_path = os.environ.get('IW_BROWSER') or shutil.which('chromium') or shutil.which('chromium-browser') or shutil.which('google-chrome')
if not browser_path:
    print('BROWSER_SMOKE=SKIP browser_not_found')
    raise SystemExit(0)


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding='utf-8')


def strip_module_syntax(source: str) -> str:
    source = re.sub(r'^\s*import\s+.*?;\s*$', '', source, flags=re.M)
    source = re.sub(r'\bexport\s+(?=(?:const|let|var|function|class)\b)', '', source)
    return source

# Dependency order mirrors src/app.js imports. The bundle is only a test artifact.
parts = [
    strip_module_syntax(read('examples/synthetic-portfolio/data.js')),
    strip_module_syntax(read('src/adapters/mockAdapter.js')),
    strip_module_syntax(read('src/research/renderer.js')),
    strip_module_syntax(read('src/agents/safety-policy.js')),
    strip_module_syntax(read('src/data-health/health.js')),
    strip_module_syntax(read('src/app.js')),
]
bundle = '\n\n'.join(parts)

html = read('index.html')
html = re.sub(r'<link\s+rel="stylesheet"\s+href="\.\/styles\.css"\s*\/?>', f'<style>{read("styles.css")}</style>', html)
html = re.sub(r'<script\s+type="module"\s+src="\.\/src\/app\.js"\s*></script>', '', html)

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=browser_path,
        headless=True,
        args=['--no-sandbox', '--disable-dev-shm-usage'],
    )
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.set_content(html, wait_until='domcontentloaded')
    page.add_script_tag(content=bundle)

    page.get_by_text('Synthetic NAV', exact=True).wait_for(timeout=5000)
    assert 'No trade execution' in page.locator('.safety-note').inner_text()
    assert 'Sources:' in page.locator('#source-health').inner_text()

    page.get_by_role('button', name='Portfolio', exact=True).click()
    page.get_by_text('NOVA', exact=True).wait_for(timeout=5000)

    page.get_by_role('button', name='Research', exact=True).click()
    page.locator('[data-research-id]').first.click()
    page.get_by_text('Scenario and research workflow demonstration only. No trade execution.', exact=True).wait_for(timeout=5000)
    assert page.locator('article.report').count() == 1

    page.get_by_role('button', name='Data Health', exact=True).click()
    page.get_by_text('synthetic-fixture', exact=True).wait_for(timeout=5000)

    page.get_by_role('button', name='Agents', exact=True).click()
    agents_text = page.locator('#app').inner_text()
    assert 'Not connected' in agents_text
    assert 'trade_execution' in agents_text
    assert 'shell_execution' in agents_text
    assert 'credential_access' in agents_text

    page.get_by_role('button', name='Overview', exact=True).click()
    page.screenshot(path=str(OUT / 'overview.png'), full_page=True)
    (OUT / 'final-dom.html').write_text(page.content(), encoding='utf-8')
    browser.close()

print('BROWSER_SMOKE=PASS')
print(f'screenshot={OUT / "overview.png"}')

# Browser smoke / visual regression

`browser_smoke.py` launches Chromium/Chrome through Playwright and executes the repository's actual JavaScript modules in an offline browser harness. It uses synthetic fixtures only and performs no network requests.

The smoke test checks:

- overview renders synthetic data
- portfolio navigation works
- research detail renders with the no-trade warning
- data-health renders the synthetic source
- agent control room remains disconnected and displays denied privileged capabilities
- a desktop screenshot can be produced

Rules:

1. No machine-specific absolute paths.
2. Output directory is configurable with `IW_SMOKE_OUT`.
3. Tests run only against synthetic fixtures.
4. Browser selection is explicit through `IW_BROWSER` or a known local binary.
5. No credentials are passed to the browser context.
6. Browser output is written under `artifacts/`, which is ignored by Git.

Optional dependency:

```bash
python3 -m pip install -r scripts/visual-regression/requirements-browser.txt
```

Run:

```bash
npm run smoke:browser
```

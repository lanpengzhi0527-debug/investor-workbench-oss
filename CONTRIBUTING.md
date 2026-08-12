# Contributing

Contributions are welcome.

Before opening a pull request:

1. Use only synthetic, public-domain, or otherwise redistributable test data.
2. Do not include API keys, credentials, real account data, private research, or machine-specific absolute paths.
3. Keep agent capabilities default-deny; new privileged capabilities require an explicit threat-model update.
4. Add tests for renderer, adapter, data-boundary, or safety-policy changes.
5. Run `npm run check`.
6. If Chromium or Google Chrome is available, run `npm run smoke:browser` for UI changes.
7. Describe any new filesystem, shell, network, browser, credential, dependency, or release behavior in the pull request.

Changes touching adapters, rendering, agent permissions, filesystem access, shell execution, networking, authentication, secrets, dependency installation, or release automation require explicit human maintainer review before merge.

# Investor Workbench OSS

Investor Workbench OSS is a local-first, auditable workspace for AI-assisted investment research. It separates research content, portfolio state, data provenance, and agent permissions into explicit trust boundaries so they can be inspected, tested, and extended without bundling private financial data or trade execution.

![Investor Workbench OSS synthetic overview](docs/assets/overview.png)

## What it includes

- Local-first browser workspace
- Synthetic portfolio and research fixtures
- Structured research reader with escaped content rendering
- Evidence and source-health concepts
- Default-deny agent capability policy
- Public-boundary and independent release scanners
- Guarded Git validation workflow
- Browser-level smoke test using synthetic data only

## Security posture

The public core intentionally provides **no trade execution, credential access, unrestricted shell execution, or arbitrary outbound agent networking**. Research content is treated as potentially untrusted. Agent capabilities are allowlisted and default-deny.

See [SECURITY.md](SECURITY.md) and [docs/security-model.md](docs/security-model.md).

## Run locally

Requirements: Node.js 20+ and Python 3.

```bash
npm test
npm run scan:boundary
npm run scan:release
npm run serve
```

Then open `http://localhost:8789`.

If Chromium or Google Chrome is installed, the release smoke test can be run with:

```bash
npm run smoke:browser
```

## Repository boundary

The demo uses synthetic fixtures only. A private or self-hosted deployment can implement its own adapter, research store, or data providers without placing those integrations in this repository. See [docs/architecture.md](docs/architecture.md), [docs/provenance.md](docs/provenance.md), and [docs/private-to-public-release-gate.md](docs/private-to-public-release-gate.md).

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md). Security-sensitive changes require explicit maintainer review.

## Status

`v0.1.0` establishes the public architecture and security boundaries. The project is early-stage and its interfaces may evolve.

## License

Apache License 2.0. See [LICENSE](LICENSE).

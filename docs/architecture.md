# Architecture

Investor Workbench OSS separates reusable product logic from private deployment data.

## Public core

- `src/app.js`: workspace composition and navigation.
- `src/research/renderer.js`: escaped research rendering.
- `src/adapters/mockAdapter.js`: synthetic reference adapter.
- `src/data-health/health.js`: source-health summarization.
- `src/agents/safety-policy.js`: explicit default-deny agent capability policy.

## Private deployment boundary

A private deployment may implement its own adapter, research store, portfolio data sources, or agent providers. Those integrations are outside the public repository and must not be required for the public demo to run.

## Security principle

Untrusted content must never directly authorize privileged actions. Rendering, agent execution, filesystem access, shell execution, networking, and credentials are separate trust boundaries.

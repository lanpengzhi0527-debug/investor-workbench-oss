# Security Policy

## Security model

Investor Workbench OSS is designed as a local-first, read-only research workspace. The public core does not provide trade execution, unrestricted shell execution, arbitrary outbound agent networking, or credential access.

## Primary trust boundaries

- Research content may be untrusted and must be escaped before HTML insertion.
- Adapters are privileged data providers and must be reviewed as code.
- Agent capabilities are allowlisted and default-deny.
- Untrusted research or prompt content must never directly authorize a privileged action.
- Automation scripts may modify files or Git state only inside explicit validation workflows.
- Third-party pull requests must not gain access to maintainer secrets by default.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting or a private security advisory rather than opening a public issue with exploit details.

If private reporting is unavailable, open a minimal public issue asking the maintainer for a private contact path without including sensitive technical details.

## Maintainer review requirements

Changes touching adapters, rendering, agent permissions, filesystem access, shell execution, networking, authentication, secrets, dependency installation, browser automation, or release automation require explicit maintainer review.

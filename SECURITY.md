# Security Policy

## Security model

Investor Workbench OSS is a local-first, read-only research workspace. The public core does not provide trade execution, unrestricted shell execution, arbitrary outbound agent networking, or credential access.

## Trust boundaries

- Research content is untrusted input and must be escaped before rendering.
- Adapters are privileged code and require review.
- Agent capabilities are explicit allowlists with default deny behavior.
- Privileged behavior requires maintainer review.

## Reporting

Please use private vulnerability reporting or a private security advisory. Do not publish exploit details in public issues.

# Security Model

Investor Workbench OSS treats data rendering and privileged actions as separate trust domains.

## Trust boundaries

### Research content

Research text, metadata, and adapter-provided strings are untrusted inputs. The reference renderer escapes active HTML before insertion into the DOM.

### Adapters

Adapters can supply portfolio, research, and source-health data. They are privileged code and should be reviewed independently from the data they return. The public reference adapter uses synthetic fixtures only.

### Agents

Agent actions are denied unless they appear on an explicit allowlist. The reference policy permits review, analysis, and report reading; trade execution, shell execution, arbitrary networking, and credential access are denied.

### Filesystem and shell automation

Maintenance scripts must operate inside explicit Git validation workflows, fail closed, and require human review before merge. Public automation must not depend on private filesystem paths or credentials.

### Network and credentials

The reference application requires no credentials and makes no outbound data-provider requests. A downstream integration that adds networking or secrets creates a new trust boundary and must document it separately.

## Non-goals

This repository is not a broker, order router, credential vault, or autonomous trading system.

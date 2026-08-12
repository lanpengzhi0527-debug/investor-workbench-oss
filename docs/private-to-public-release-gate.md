# Private → Public Release Gate

Every backport from a private deployment must pass all gates:

- G1: no secrets
- G2: no private absolute filesystem paths
- G3: no real account, portfolio, or transaction data
- G4: no private research content
- G5: no private adapter or production configuration
- G6: no unrestricted shell execution
- G7: no unexpected outbound network requests
- G8: no weakening of no-trade or agent permission boundaries
- G9: dependency changes reviewed
- G10: tests and boundary scan pass
- G11: diff is scoped to the intended public feature
- G12: human maintainer review required

Agent-related changes add:

- G13: untrusted input cannot authorize tool execution
- G14: filesystem scope is explicit
- G15: network scope is explicit
- G16: credentials never enter prompts, fixtures, or logs

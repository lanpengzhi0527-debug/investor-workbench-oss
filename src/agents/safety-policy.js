export const AGENT_CAPABILITIES = Object.freeze({
  allowed: ['review', 'analyze', 'read_report'],
  denied: ['trade_execution', 'shell_execution', 'arbitrary_network', 'credential_access']
});

export function authorizeAgentAction(action) {
  if (AGENT_CAPABILITIES.allowed.includes(action)) {
    return { allowed: true, reason: 'explicit_allowlist' };
  }
  return { allowed: false, reason: 'default_deny' };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, renderMarkdownish, renderResearchDetail } from '../src/research/renderer.js';
import { authorizeAgentAction, AGENT_CAPABILITIES } from '../src/agents/safety-policy.js';

test('renderer escapes active HTML', () => {
  const payload = '<img src=x onerror=alert(1)>';
  assert.equal(escapeHtml(payload), '&lt;img src=x onerror=alert(1)&gt;');
  assert.ok(!renderMarkdownish(payload).includes('<img'));
});

test('renderer escapes quotes and evidence values', () => {
  const html = renderResearchDetail({
    symbol: 'SYN',
    status: 'active',
    title: '" onmouseover="alert(1)',
    summary: '<script>alert(1)</script>',
    evidence: ['<img src=x onerror=alert(1)>'],
    body: '## Heading\n\n- <svg onload=alert(1)>'
  });
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('<svg'));
  assert.ok(html.includes('&quot; onmouseover=&quot;alert(1)'));
});

test('agent policy defaults to deny', () => {
  assert.equal(authorizeAgentAction('shell_execution').allowed, false);
  assert.equal(authorizeAgentAction('unknown_future_tool').allowed, false);
});

test('read-only review action is explicitly allowed', () => {
  assert.equal(authorizeAgentAction('review').allowed, true);
});

test('privileged capabilities remain explicitly denied', () => {
  for (const action of ['trade_execution', 'shell_execution', 'arbitrary_network', 'credential_access']) {
    assert.ok(AGENT_CAPABILITIES.denied.includes(action));
    assert.equal(authorizeAgentAction(action).allowed, false);
  }
});

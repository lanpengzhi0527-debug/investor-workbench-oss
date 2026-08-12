import { mockAdapter } from './adapters/mockAdapter.js';
import { renderResearchDetail, escapeHtml } from './research/renderer.js';
import { AGENT_CAPABILITIES } from './agents/safety-policy.js';
import { summarizeSourceHealth } from './data-health/health.js';

const pages = [
  ['overview', 'Overview'],
  ['portfolio', 'Portfolio'],
  ['research', 'Research'],
  ['decisions', 'Decisions'],
  ['data-health', 'Data Health'],
  ['agents', 'Agents']
];

let currentPage = 'overview';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function renderNav() {
  document.querySelector('#nav').innerHTML = pages
    .map(([id, label]) => `<button class="nav-button ${id === currentPage ? 'active' : ''}" data-page="${id}">${escapeHtml(label)}</button>`)
    .join('');
}

function renderOverview() {
  const p = mockAdapter.getPortfolio();
  return `<div class="grid">
    <div class="card"><div class="label">Synthetic NAV</div><div class="metric">${money(p.nav)}</div></div>
    <div class="card"><div class="label">Synthetic cash</div><div class="metric">${money(p.cash)}</div></div>
    <div class="card"><div class="label">Positions</div><div class="metric">${p.positions.length}</div></div>
  </div>`;
}

function renderPortfolio() {
  const p = mockAdapter.getPortfolio();
  return `<div class="card stack">${p.positions.map((position) => `
    <div class="row">
      <div><strong>${escapeHtml(position.symbol)}</strong><div class="label">${escapeHtml(position.name)} · ${escapeHtml(position.type)}</div></div>
      <div><strong>${money(position.marketValue)}</strong><div class="label">${(position.weight * 100).toFixed(1)}% · ${escapeHtml(position.risk)}</div></div>
    </div>`).join('')}</div>`;
}

function renderResearch() {
  const items = mockAdapter.getResearchIndex();
  return `<div class="stack">${items.map((item) => `
    <button class="card" style="text-align:left;cursor:pointer" data-research-id="${escapeHtml(item.id)}">
      <div class="label">${escapeHtml(item.symbol)} · ${escapeHtml(item.status)}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
    </button>`).join('')}</div>`;
}

function renderDecisions() {
  return `<div class="card"><h2>Decision log</h2><p>No real decisions are bundled. Integrators can supply a local adapter implementing their own decision schema.</p></div>`;
}

function renderDataHealth() {
  const snapshot = mockAdapter.getSourceHealth();
  return `<div class="card"><h2>Data Health</h2>${snapshot.sources.map((source) => `<div class="row"><span>${escapeHtml(source.id)}</span><span class="badge">${escapeHtml(source.status)}</span></div>`).join('')}</div>`;
}

function renderAgents() {
  return `<div class="card"><h2>Agents Control Room</h2>
    <p>Agent runner: <strong>Not connected</strong></p>
    <p>Allowed: ${AGENT_CAPABILITIES.allowed.map(escapeHtml).join(', ')}</p>
    <p>Denied: ${AGENT_CAPABILITIES.denied.map(escapeHtml).join(', ')}</p>
    <p class="warning">This OSS candidate does not expose shell, network, credential, or trade execution tools.</p>
  </div>`;
}

function render() {
  renderNav();
  const title = pages.find(([id]) => id === currentPage)?.[1] ?? 'Workbench';
  document.querySelector('#page-title').textContent = title;
  const health = summarizeSourceHealth(mockAdapter.getSourceHealth());
  document.querySelector('#source-health').textContent = health.label;

  const app = document.querySelector('#app');
  if (currentPage === 'overview') app.innerHTML = renderOverview();
  else if (currentPage === 'portfolio') app.innerHTML = renderPortfolio();
  else if (currentPage === 'research') app.innerHTML = renderResearch();
  else if (currentPage === 'decisions') app.innerHTML = renderDecisions();
  else if (currentPage === 'data-health') app.innerHTML = renderDataHealth();
  else if (currentPage === 'agents') app.innerHTML = renderAgents();
}

document.addEventListener('click', (event) => {
  const nav = event.target.closest('[data-page]');
  if (nav) {
    currentPage = nav.dataset.page;
    render();
    return;
  }
  const research = event.target.closest('[data-research-id]');
  if (research) {
    document.querySelector('#app').innerHTML = renderResearchDetail(mockAdapter.getResearchById(research.dataset.researchId));
  }
});

render();

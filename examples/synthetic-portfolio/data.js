export const syntheticPortfolio = {
  baseCurrency: 'USD',
  nav: 100000,
  cash: 18000,
  positions: [
    { symbol: 'NOVA', name: 'Nova Compute', type: 'stock', marketValue: 32000, weight: 0.32, risk: 'high' },
    { symbol: 'MEMX', name: 'Memory Systems Index', type: 'etf', marketValue: 27000, weight: 0.27, risk: 'medium' },
    { symbol: 'GRID', name: 'Grid Infrastructure', type: 'stock', marketValue: 23000, weight: 0.23, risk: 'medium' }
  ]
};

export const syntheticResearch = [
  {
    id: 'research-nova-001',
    symbol: 'NOVA',
    title: 'Nova Compute — Capacity Expansion Review',
    status: 'active',
    summary: 'Capacity growth is attractive, but funding needs and customer concentration require explicit review.',
    evidence: ['company_disclosed', 'estimate_only'],
    risks: ['Customer concentration', 'Financing requirements', 'Execution risk'],
    catalysts: ['Capacity commissioning', 'New customer wins'],
    body: `## Core thesis\n\nNova Compute is a synthetic example used to demonstrate the research renderer.\n\n## Evidence\n\n- Company-disclosed capacity plan\n- Scenario-only revenue estimate\n\n## Red lines\n\n- Funding plan becomes inconsistent with stated liquidity\n- Customer concentration rises materially`
  },
  {
    id: 'research-memx-001',
    symbol: 'MEMX',
    title: 'Memory Systems — Cycle Discipline Review',
    status: 'active',
    summary: 'The framework separates disclosed evidence from estimates and pending verification.',
    evidence: ['industry_source', 'company_disclosed', 'pending_event'],
    risks: ['Supply expansion', 'Pricing rollover'],
    catalysts: ['Contract pricing', 'Margin expansion'],
    body: `## Core thesis\n\nThis fixture demonstrates evidence labels without containing real investment research.\n\n## Pending verification\n\n- Contract pricing\n- Capacity additions\n- Margin progression`
  }
];

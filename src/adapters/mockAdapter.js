import { syntheticPortfolio, syntheticResearch } from '../../examples/synthetic-portfolio/data.js';

export const mockAdapter = Object.freeze({
  getPortfolio() {
    return structuredClone(syntheticPortfolio);
  },
  getResearchIndex() {
    return structuredClone(syntheticResearch);
  },
  getResearchById(id) {
    const item = syntheticResearch.find((entry) => entry.id === id);
    return item ? structuredClone(item) : null;
  },
  getSourceHealth() {
    return {
      status: 'actual',
      sources: [
        { id: 'synthetic-fixture', status: 'actual', updatedAt: '2026-01-01T00:00:00Z' }
      ]
    };
  }
});

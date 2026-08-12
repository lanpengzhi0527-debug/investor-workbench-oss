export function summarizeSourceHealth(snapshot) {
  const sources = Array.isArray(snapshot?.sources) ? snapshot.sources : [];
  if (!sources.length) return { status: 'partial', label: 'Sources: Partial' };
  const statuses = new Set(sources.map((source) => source.status));
  if (statuses.has('stale')) return { status: 'stale', label: 'Sources: Stale' };
  if (statuses.has('partial')) return { status: 'partial', label: 'Sources: Partial' };
  return { status: 'actual', label: 'Sources: OK' };
}

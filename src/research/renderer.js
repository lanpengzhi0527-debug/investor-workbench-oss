export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderMarkdownish(input) {
  const lines = String(input ?? '').split(/\r?\n/);
  const out = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) out.push('</ul>');
    listOpen = false;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      out.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      closeList();
      out.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
    } else if (line.startsWith('- ')) {
      if (!listOpen) {
        out.push('<ul>');
        listOpen = true;
      }
      out.push(`<li>${escapeHtml(line.slice(2))}</li>`);
    } else {
      closeList();
      out.push(`<p>${escapeHtml(line)}</p>`);
    }
  }
  closeList();
  return out.join('\n');
}

export function renderResearchDetail(item) {
  if (!item) return '<div class="card">Research item not found.</div>';
  const evidence = (item.evidence ?? [])
    .map((entry) => `<span class="evidence">${escapeHtml(entry)}</span>`)
    .join(' ');
  return `
    <article class="report">
      <div class="label">${escapeHtml(item.symbol)} · ${escapeHtml(item.status)}</div>
      <h1>${escapeHtml(item.title)}</h1>
      <p class="warning">Scenario and research workflow demonstration only. No trade execution.</p>
      <p>${escapeHtml(item.summary)}</p>
      <div>${evidence}</div>
      ${renderMarkdownish(item.body)}
    </article>`;
}

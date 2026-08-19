// ── State ──────────────────────────────────────────────────
const state = {
  lists: [
    {
      id: 1,
      name: 'List 1',
      text: 'best, top, cheap, ultimate',
      enabled: true,
    },
    {
      id: 2,
      name: 'List 2',
      text: 'laptop, smartphone, headphones',
      enabled: true,
    },
  ],
  nextId: 3,
  separatorType: 'space',
  customSeparator: '-',
  combinationMode: 'cartesian',
  maxWords: 2,
  caseTransform: 'as-is',
  wrapper: 'none',
  removeDuplicates: true,
  trimWords: true,
  searchQuery: '',
  results: [],
  displayLimit: 500,
  isCalculating: false,
  // Selection & Export
  selectedItems: new Set(),
  lastClickedIndex: -1,
  exportConfig: {
    scope: 'selected', // 'selected' | 'filtered' | 'all'
    format: 'txt', // 'txt' | 'csv' | 'xlsx' | 'json'
    delimiter: 'newline', // 'newline' | 'comma' | 'tab' | 'space' | 'semicolon' | 'custom'
    customDelimiter: ' | ',
    includeHeader: true,
  },
};

// ── DOM refs ───────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const els = {
  // Structural
  themeToggleBtn: $('themeToggleBtn'),
  inspectorToggle: $('inspectorToggle'),
  rightInspector: $('rightInspector'),

  // Canvas & Lists
  wordListsContainer: $('wordListsContainer'),
  addListBtn: $('addListBtn'),

  // Output
  outputCanvas: $('outputCanvas'),
  totalCountBadge: $('totalCountBadge'),
  selectedCountBadge: $('selectedCountBadge'),
  selectedCountNum: $('selectedCountNum'),
  calcTimeBadge: $('calcTimeBadge'),
  searchInput: $('searchInput'),
  exportBtn: $('exportBtn'),
  quickCopyBtn: $('quickCopyBtn'),
  selectAllCheckbox: $('selectAllCheckbox'),
  selectMenuBtn: $('selectMenuBtn'),
  selectMenu: $('selectMenu'),
  menuSelectAll: $('menuSelectAll'),
  menuDeselectAll: $('menuDeselectAll'),
  menuInvertSelection: $('menuInvertSelection'),

  // Export Modal Sheet
  exportModal: $('exportModal'),
  closeExportModalBtn: $('closeExportModalBtn'),
  modalCancelBtn: $('modalCancelBtn'),
  modalCopyBtn: $('modalCopyBtn'),
  modalDownloadBtn: $('modalDownloadBtn'),
  exportScopeSegmented: $('exportScopeSegmented'),
  scopeSelectedBtn: $('scopeSelectedBtn'),
  scopeFilteredBtn: $('scopeFilteredBtn'),
  scopeAllBtn: $('scopeAllBtn'),
  exportFormatSegmented: $('exportFormatSegmented'),
  textOptionsSection: $('textOptionsSection'),
  exportDelimiterSelect: $('exportDelimiterSelect'),
  exportCustomDelimRow: $('exportCustomDelimRow'),
  exportCustomDelimInput: $('exportCustomDelimInput'),
  csvOptionsSection: $('csvOptionsSection'),
  exportHeaderToggle: $('exportHeaderToggle'),
  exportPreviewBox: $('exportPreviewBox'),
  previewCountBadge: $('previewCountBadge'),

  // Toast
  macToast: $('macToast'),
  toastMessage: $('toastMessage'),

  // Inspector
  modeSelect: $('combinationModeSelect'),
  maxWordsInput: $('maxWordsInput'),
  maxWordsDecBtn: $('maxWordsDecBtn'),
  maxWordsIncBtn: $('maxWordsIncBtn'),
  separatorSelect: $('separatorTypeSelect'),
  customSepRow: $('customSepRow'),
  customSepInput: $('customSeparatorInput'),
  caseSelect: $('caseTransformSelect'),
  wrapperSelect: $('wrapperSelect'),
  removeDupsCheck: $('removeDuplicatesCheckbox'),
  trimCheck: $('trimWordsCheckbox'),
};

// ── Web Worker for Non-blocking Computation ────────────────
let worker = null;
let currentJobId = 0;
let debounceTimer = null;

const workerScript = `
function countWords(text, sep) {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  if (sep && sep !== ' ' && trimmed.includes(sep)) {
    return trimmed
      .split(sep)
      .flatMap((s) => s.trim().split(/\\s+/))
      .filter(Boolean).length;
  }
  return trimmed.split(/\\s+/).filter(Boolean).length;
}

function transformCase(text, caseTransform) {
  switch (caseTransform) {
    case 'lower':
      return text.toLowerCase();
    case 'upper':
      return text.toUpperCase();
    case 'title':
      return text.replace(
        /\\w\\S*/g,
        (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      );
    case 'camel': {
      const c = text
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, '');
      return c ? c.charAt(0).toLowerCase() + c.slice(1) : '';
    }
    case 'kebab':
      return text
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\\s_]+/g, '-')
        .toLowerCase();
    case 'snake':
      return text
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\\s-]+/g, '_')
        .toLowerCase();
    default:
      return text;
  }
}

function applyWrapper(w, wrapper) {
  switch (wrapper) {
    case 'quotes':
      return '"' + w + '"';
    case 'brackets':
      return '[' + w + ']';
    case 'braces':
      return '{' + w + '}';
    default:
      return w;
  }
}

self.onmessage = function(e) {
  const {
    jobId,
    active,
    sep,
    combinationMode,
    maxWords,
    caseTransform,
    wrapper,
    removeDuplicates,
  } = e.data;

  const t0 = performance.now();

  if (!active || active.length === 0) {
    self.postMessage({ jobId, results: [], calcTime: '0.0' });
    return;
  }

  let raw = [];

  if (combinationMode === 'cartesian') {
    if (maxWords && active.length > maxWords) {
      raw = [];
    } else {
      raw = active.reduce((acc, cur) => {
        if (acc.length === 0) return cur;
        const out = [];
        for (let i = 0; i < acc.length; i++) {
          for (let j = 0; j < cur.length; j++) {
            out.push(acc[i] + sep + cur[j]);
          }
        }
        return out;
      }, []);
    }
  } else if (combinationMode === 'zip') {
    const max = Math.max(...active.map((a) => a.length));
    for (let i = 0; i < max; i++) {
      const parts = active.map((a) => a[i]).filter(Boolean);
      if (parts.length) raw.push(parts.join(sep));
    }
  } else if (combinationMode === 'subsets') {
    // Early pruning when prefix length reaches maxWords
    (function subsets(arrs, curPrefix, depth) {
      if (depth === arrs.length) {
        if (curPrefix.length > 0) raw.push(curPrefix.join(sep));
        return;
      }
      // Branch 1: Skip current list
      subsets(arrs, curPrefix, depth + 1);
      // Branch 2: Pick from current list if below maxWords limit
      if (!maxWords || curPrefix.length < maxWords) {
        for (let i = 0; i < arrs[depth].length; i++) {
          subsets(arrs, [...curPrefix, arrs[depth][i]], depth + 1);
        }
      }
    })(active, [], 0);
  }

  // Filter token length if items contain multi-word elements
  if (maxWords && maxWords > 0) {
    raw = raw.filter((item) => countWords(item, sep) <= maxWords);
  }

  let final = raw.map((item) => {
    let r = transformCase(item, caseTransform);
    if (wrapper !== 'none') r = applyWrapper(r, wrapper);
    return r;
  });

  if (removeDuplicates) {
    final = Array.from(new Set(final));
  }

  const calcTime = (performance.now() - t0).toFixed(1);
  self.postMessage({ jobId, results: final, calcTime });
};
`;

function initWorker() {
  try {
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = function (e) {
      if (e.data.jobId === currentJobId) {
        state.results = e.data.results;
        state.isCalculating = false;
        pruneSelectedItems();
        renderOutput(e.data.calcTime);
      }
    };
    worker.onerror = function (err) {
      console.warn('Worker error, falling back to sync:', err);
      worker = null;
    };
  } catch (err) {
    console.warn('Worker initialization failed, fallback to main thread:', err);
    worker = null;
  }
}

// ── Init ───────────────────────────────────────────────────
function init() {
  initTheme();
  initWorker();
  renderLists();
  bindEvents();
  generateCombinations();
}

// ── Theme ──────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('wc_theme');
  const sys =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (sys ? 'dark' : 'light'));
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('wc_theme', theme);
}

// ── Render ─────────────────────────────────────────────────
function renderLists() {
  if (!els.wordListsContainer) return;
  els.wordListsContainer.innerHTML = state.lists
    .map((list) => {
      const count = parseWords(list.text).length;
      return `
        <div class="word-card ${list.enabled ? '' : 'disabled'}" data-id="${list.id}">
          <div class="card-header">
            <input type="text" class="card-title" value="${escapeHtml(list.name)}" data-action="rename" />
            <div class="card-actions">
              <span style="font-size:12px; color:var(--labels--secondary); margin-right:8px; display:flex; align-items:center">${count} words</span>
              <input type="checkbox" class="mac-toggle" style="margin-right:4px" data-action="toggle" ${list.enabled ? 'checked' : ''} />
              <button class="icon-btn" data-action="delete" title="Delete" style="width:20px;height:20px; color:var(--labels--tertiary)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>
          </div>
          <textarea class="card-textarea" placeholder="Enter words..." aria-label="${escapeHtml(list.name)}">${escapeHtml(list.text)}</textarea>
        </div>
      `;
    })
    .join('');
}

// ── Engine ─────────────────────────────────────────────────
function parseWords(text) {
  if (!text) return [];
  return text
    .split(/[\n,;]+/)
    .map((t) => (state.trimWords ? t.trim() : t))
    .filter((t) => t.length > 0);
}

function getSep() {
  if (state.separatorType === 'space') return ' ';
  if (state.separatorType === 'nothing') return '';
  return state.customSeparator;
}

function scheduleGeneration(delay = 100) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    generateCombinations();
  }, delay);
}

function generateCombinations() {
  state.displayLimit = 500;
  const jobId = ++currentJobId;
  const active = state.lists
    .filter((l) => l.enabled)
    .map((l) => parseWords(l.text))
    .filter((a) => a.length > 0);

  if (active.length === 0) {
    state.results = [];
    pruneSelectedItems();
    renderOutput(0);
    return;
  }

  const payload = {
    jobId,
    active,
    sep: getSep(),
    combinationMode: state.combinationMode,
    maxWords: state.maxWords,
    caseTransform: state.caseTransform,
    wrapper: state.wrapper,
    removeDuplicates: state.removeDuplicates,
  };

  if (worker) {
    state.isCalculating = true;
    worker.postMessage(payload);
  } else {
    // Fallback sync calculation
    runFallbackCalculation(payload);
  }
}

function runFallbackCalculation(p) {
  const t0 = performance.now();
  let raw = [];
  if (p.combinationMode === 'cartesian') {
    if (p.maxWords && p.active.length > p.maxWords) {
      raw = [];
    } else {
      raw = p.active.reduce((acc, cur) => {
        if (acc.length === 0) return cur;
        const out = [];
        for (let i = 0; i < acc.length; i++) {
          for (let j = 0; j < cur.length; j++) {
            out.push(acc[i] + p.sep + cur[j]);
          }
        }
        return out;
      }, []);
    }
  } else if (p.combinationMode === 'zip') {
    const max = Math.max(...p.active.map((a) => a.length));
    for (let i = 0; i < max; i++) {
      const parts = p.active.map((a) => a[i]).filter(Boolean);
      if (parts.length) raw.push(parts.join(p.sep));
    }
  } else if (p.combinationMode === 'subsets') {
    (function subsets(arrs, curPrefix, depth) {
      if (depth === arrs.length) {
        if (curPrefix.length > 0) raw.push(curPrefix.join(p.sep));
        return;
      }
      subsets(arrs, curPrefix, depth + 1);
      if (!p.maxWords || curPrefix.length < p.maxWords) {
        for (let i = 0; i < arrs[depth].length; i++) {
          subsets(arrs, [...curPrefix, arrs[depth][i]], depth + 1);
        }
      }
    })(p.active, [], 0);
  }

  let final = raw.map((item) => {
    let r = item;
    return r;
  });

  if (p.removeDuplicates) final = Array.from(new Set(final));
  state.results = final;
  pruneSelectedItems();
  renderOutput((performance.now() - t0).toFixed(1));
}

// ── Selection Management ───────────────────────────────────
function pruneSelectedItems() {
  if (state.selectedItems.size === 0) return;
  const currentSet = new Set(state.results);
  for (const item of state.selectedItems) {
    if (!currentSet.has(item)) {
      state.selectedItems.delete(item);
    }
  }
}

function getFilteredResults() {
  if (!state.searchQuery) return state.results;
  const q = state.searchQuery.toLowerCase();
  return state.results.filter((x) => x.toLowerCase().includes(q));
}

function updateSelectionUI(filtered = getFilteredResults()) {
  const totalSelected = state.selectedItems.size;

  // Selected badge in stats
  if (els.selectedCountBadge && els.selectedCountNum) {
    if (totalSelected > 0) {
      els.selectedCountNum.textContent = totalSelected.toLocaleString();
      els.selectedCountBadge.hidden = false;
    } else {
      els.selectedCountBadge.hidden = true;
    }
  }

  // Export button label
  if (els.exportBtn) {
    els.exportBtn.textContent =
      totalSelected > 0
        ? `Export (${totalSelected.toLocaleString()})…`
        : 'Export…';
  }

  // Master Checkbox state
  if (els.selectAllCheckbox) {
    if (filtered.length === 0 || totalSelected === 0) {
      els.selectAllCheckbox.checked = false;
      els.selectAllCheckbox.indeterminate = false;
    } else {
      let filteredSelectedCount = 0;
      for (let i = 0; i < filtered.length; i++) {
        if (state.selectedItems.has(filtered[i])) filteredSelectedCount++;
      }
      if (filteredSelectedCount === filtered.length && filtered.length > 0) {
        els.selectAllCheckbox.checked = true;
        els.selectAllCheckbox.indeterminate = false;
      } else if (filteredSelectedCount > 0) {
        els.selectAllCheckbox.checked = false;
        els.selectAllCheckbox.indeterminate = true;
      } else {
        els.selectAllCheckbox.checked = false;
        els.selectAllCheckbox.indeterminate = false;
      }
    }
  }
}

function renderOutput(ms) {
  if (!els.outputCanvas) return;
  const filtered = getFilteredResults();

  const shownCount = Math.min(filtered.length, state.displayLimit);
  if (filtered.length > state.displayLimit) {
    els.totalCountBadge.textContent = `Showing ${shownCount.toLocaleString()} of ${filtered.length.toLocaleString()}`;
  } else if (state.searchQuery) {
    els.totalCountBadge.textContent = `${filtered.length.toLocaleString()} / ${state.results.length.toLocaleString()}`;
  } else {
    els.totalCountBadge.textContent = state.results.length.toLocaleString();
  }

  if (ms !== undefined && els.calcTimeBadge)
    els.calcTimeBadge.textContent = `${ms}ms`;

  updateSelectionUI(filtered);

  if (filtered.length === 0) {
    els.outputCanvas.innerHTML = `<div class="empty-state">No combinations.</div>`;
    return;
  }

  const shown = filtered.slice(0, state.displayLimit);
  let html = shown
    .map((item, idx) => {
      const isSelected = state.selectedItems.has(item);
      return `
        <div class="output-line ${isSelected ? 'selected' : ''}" data-index="${idx}">
          <span class="output-line-index">${idx + 1}</span>
          <input type="checkbox" class="mac-checkbox item-checkbox" data-index="${idx}" ${isSelected ? 'checked' : ''} aria-label="Select row ${idx + 1}" />
          <span class="output-text">${escapeHtml(item)}</span>
        </div>
      `;
    })
    .join('');

  if (filtered.length > state.displayLimit) {
    html += `
      <div class="load-more-bar">
        <span>Showing <strong class="load-more-text">${shown.length.toLocaleString()}</strong> of <strong>${filtered.length.toLocaleString()}</strong> items</span>
        <div class="load-more-actions">
          <button type="button" class="mac-btn" id="loadMoreBtn">Load 500 More</button>
          <button type="button" class="mac-btn primary" id="showAllBtn">Show All (${filtered.length.toLocaleString()})</button>
        </div>
      </div>
    `;
  }

  els.outputCanvas.innerHTML = html;
}

// ── Toast ──────────────────────────────────────────────────
let toastTimer = null;
function showToast(message) {
  if (!els.macToast || !els.toastMessage) return;
  els.toastMessage.textContent = message;
  els.macToast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.macToast.classList.remove('show');
  }, 2200);
}

// ── Export Modal & Generator ───────────────────────────────
function getExportItems(scope = state.exportConfig.scope) {
  const filtered = getFilteredResults();
  if (scope === 'selected') {
    return state.results.filter((item) => state.selectedItems.has(item));
  } else if (scope === 'filtered') {
    return filtered;
  } else {
    return state.results;
  }
}

function getExportDelimiter() {
  switch (state.exportConfig.delimiter) {
    case 'newline':
      return '\n';
    case 'comma':
      return ', ';
    case 'tab':
      return '\t';
    case 'space':
      return ' ';
    case 'semicolon':
      return '; ';
    case 'custom':
      return state.exportConfig.customDelimiter || ' ';
    default:
      return '\n';
  }
}

function buildExportData(
  scope = state.exportConfig.scope,
  format = state.exportConfig.format,
) {
  const items = getExportItems(scope);

  if (format === 'txt') {
    const delim = getExportDelimiter();
    return {
      type: 'text',
      mime: 'text/plain;charset=utf-8',
      extension: 'txt',
      content: items.join(delim),
      count: items.length,
    };
  } else if (format === 'csv') {
    const lines = [];
    if (state.exportConfig.includeHeader) {
      lines.push('"Combination"');
    }
    for (const item of items) {
      lines.push('"' + String(item).replace(/"/g, '""') + '"');
    }
    return {
      type: 'text',
      mime: 'text/csv;charset=utf-8',
      extension: 'csv',
      content: lines.join('\r\n'),
      count: items.length,
    };
  } else if (format === 'json') {
    return {
      type: 'text',
      mime: 'application/json;charset=utf-8',
      extension: 'json',
      content: JSON.stringify(items, null, 2),
      count: items.length,
    };
  } else if (format === 'xlsx') {
    return {
      type: 'xlsx',
      extension: 'xlsx',
      items,
      count: items.length,
    };
  }
}

function updateExportModalPreview() {
  const data = buildExportData(
    state.exportConfig.scope,
    state.exportConfig.format,
  );
  if (!data) return;

  if (els.previewCountBadge) {
    els.previewCountBadge.textContent = `${data.count.toLocaleString()} items`;
  }

  if (els.exportPreviewBox) {
    if (data.count === 0) {
      els.exportPreviewBox.textContent = '(No items in selected scope)';
      return;
    }

    if (data.type === 'xlsx') {
      const sample = data.items.slice(0, 8);
      const rows = state.exportConfig.includeHeader
        ? ['[Header: Combination]']
        : [];
      sample.forEach((item, i) => rows.push(`Row ${i + 1}: ${item}`));
      if (data.items.length > 8)
        rows.push(`... and ${data.items.length - 8} more rows`);
      els.exportPreviewBox.textContent = rows.join('\n');
    } else {
      const sampleLines = data.content.split('\n').slice(0, 10);
      if (data.count > 10) sampleLines.push('...');
      els.exportPreviewBox.textContent = sampleLines.join('\n');
    }
  }
}

function setExportScope(scope) {
  state.exportConfig.scope = scope;
  if (els.exportScopeSegmented) {
    els.exportScopeSegmented.querySelectorAll('.mac-segment').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.scope === scope);
    });
  }
  updateExportModalPreview();
}

function setExportFormat(format) {
  state.exportConfig.format = format;
  if (els.exportFormatSegmented) {
    els.exportFormatSegmented
      .querySelectorAll('.mac-segment')
      .forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.format === format);
      });
  }

  if (els.textOptionsSection) {
    els.textOptionsSection.hidden = format !== 'txt';
  }
  if (els.csvOptionsSection) {
    els.csvOptionsSection.hidden = format !== 'csv' && format !== 'xlsx';
  }

  updateExportModalPreview();
}

function openExportModal() {
  if (!els.exportModal) return;
  const selectedCount = state.selectedItems.size;
  const filtered = getFilteredResults();
  const allCount = state.results.length;

  if (els.scopeSelectedBtn) {
    els.scopeSelectedBtn.textContent = `Selected (${selectedCount.toLocaleString()})`;
    els.scopeSelectedBtn.disabled = selectedCount === 0;
  }
  if (els.scopeFilteredBtn) {
    els.scopeFilteredBtn.textContent = `Filtered (${filtered.length.toLocaleString()})`;
    els.scopeFilteredBtn.style.display = state.searchQuery ? '' : 'none';
  }
  if (els.scopeAllBtn) {
    els.scopeAllBtn.textContent = `All (${allCount.toLocaleString()})`;
  }

  // Default active scope
  if (selectedCount > 0) {
    setExportScope('selected');
  } else if (state.searchQuery && filtered.length > 0) {
    setExportScope('filtered');
  } else {
    setExportScope('all');
  }

  setExportFormat(state.exportConfig.format);
  els.exportModal.hidden = false;
}

function closeExportModal() {
  if (els.exportModal) els.exportModal.hidden = true;
}

function downloadExportFile() {
  const data = buildExportData(
    state.exportConfig.scope,
    state.exportConfig.format,
  );
  if (!data || data.count === 0) {
    showToast('No items to export');
    return;
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const filename = `combinations-${dateStr}.${data.extension}`;

  if (data.type === 'xlsx') {
    if (window.XLSX) {
      const aoa = state.exportConfig.includeHeader ? [['Combination']] : [];
      data.items.forEach((item) => aoa.push([item]));
      const ws = window.XLSX.utils.aoa_to_sheet(aoa);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, 'Combinations');
      window.XLSX.writeFile(wb, filename);
      showToast(`Exported ${data.count.toLocaleString()} items to Excel`);
      closeExportModal();
    } else {
      showToast('Excel exporter unavailable');
    }
    return;
  }

  const blob = new Blob([data.content], { type: data.mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(
    `Exported ${data.count.toLocaleString()} items (${data.extension})`,
  );
  closeExportModal();
}

function copyExportToClipboard() {
  // If format is xlsx, copy formatted text for clipboard
  const format =
    state.exportConfig.format === 'xlsx' ? 'txt' : state.exportConfig.format;
  const data = buildExportData(state.exportConfig.scope, format);
  if (!data || data.count === 0) {
    showToast('No items to copy');
    return;
  }

  navigator.clipboard
    .writeText(data.content)
    .then(() => {
      showToast(`Copied ${data.count.toLocaleString()} items to clipboard`);
      closeExportModal();
    })
    .catch((err) => {
      console.warn('Clipboard write failed:', err);
      showToast('Failed to copy to clipboard');
    });
}

function quickCopy() {
  let items = [];
  let scopeLabel = '';
  if (state.selectedItems.size > 0) {
    items = state.results.filter((item) => state.selectedItems.has(item));
    scopeLabel = `${items.length.toLocaleString()} selected`;
  } else {
    items = getFilteredResults();
    scopeLabel = `${items.length.toLocaleString()} items`;
  }

  if (items.length === 0) {
    showToast('No items to copy');
    return;
  }

  navigator.clipboard
    .writeText(items.join('\n'))
    .then(() => {
      showToast(`Copied ${scopeLabel} to clipboard`);
    })
    .catch((err) => {
      console.warn('Clipboard write failed:', err);
      showToast('Failed to copy to clipboard');
    });
}

// ── Events ─────────────────────────────────────────────────
function bindEvents() {
  // Layout Toggles
  els.inspectorToggle?.addEventListener('click', () => {
    els.rightInspector.hidden = !els.rightInspector.hidden;
  });

  els.themeToggleBtn?.addEventListener('click', () => {
    setTheme(
      document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'light'
        : 'dark',
    );
  });

  // Lists
  els.addListBtn?.addEventListener('click', () => {
    state.lists.push({
      id: state.nextId++,
      name: `List ${state.lists.length + 1}`,
      text: '',
      enabled: true,
    });
    renderLists();
    generateCombinations();
  });

  els.wordListsContainer?.addEventListener('input', (e) => {
    const card = e.target.closest('.word-card');
    if (!card) return;
    const list = state.lists.find((l) => l.id === +card.dataset.id);
    if (e.target.classList.contains('card-textarea')) {
      list.text = e.target.value;
      const cnt = parseWords(list.text).length;
      card.querySelector('.card-actions span').textContent = `${cnt} words`;
      scheduleGeneration(100);
    } else if (e.target.classList.contains('card-title')) {
      list.name = e.target.value;
    }
  });

  els.wordListsContainer?.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const card = e.target.closest('.word-card');
      const list = state.lists.find((l) => l.id === +card.dataset.id);
      list.enabled = e.target.checked;
      card.classList.toggle('disabled', !list.enabled);
      generateCombinations();
    }
  });

  els.wordListsContainer?.addEventListener('click', (e) => {
    const btn = e.target.closest('.icon-btn');
    if (btn && btn.dataset.action === 'delete') {
      const id = +btn.closest('.word-card').dataset.id;
      state.lists = state.lists.filter((l) => l.id !== id);
      renderLists();
      generateCombinations();
    }
  });

  // Inspector
  els.modeSelect?.addEventListener('change', (e) => {
    state.combinationMode = e.target.value;
    generateCombinations();
  });

  // Max Words Stepper
  els.maxWordsInput?.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val === '') {
      state.maxWords = null;
    } else {
      const num = parseInt(val, 10);
      state.maxWords = isNaN(num) || num <= 0 ? null : num;
    }
    generateCombinations();
  });

  els.maxWordsDecBtn?.addEventListener('click', () => {
    let cur = state.maxWords === null ? 2 : state.maxWords;
    if (cur > 1) {
      cur--;
      state.maxWords = cur;
      els.maxWordsInput.value = cur;
    } else {
      state.maxWords = 1;
      els.maxWordsInput.value = 1;
    }
    generateCombinations();
  });

  els.maxWordsIncBtn?.addEventListener('click', () => {
    let cur = state.maxWords === null ? 1 : state.maxWords;
    cur++;
    state.maxWords = cur;
    els.maxWordsInput.value = cur;
    generateCombinations();
  });

  els.separatorSelect?.addEventListener('change', (e) => {
    state.separatorType = e.target.value;
    els.customSepRow.hidden = state.separatorType !== 'custom';
    generateCombinations();
  });
  els.customSepInput?.addEventListener('input', (e) => {
    state.customSeparator = e.target.value;
    scheduleGeneration(80);
  });
  els.caseSelect?.addEventListener('change', (e) => {
    state.caseTransform = e.target.value;
    generateCombinations();
  });
  els.wrapperSelect?.addEventListener('change', (e) => {
    state.wrapper = e.target.value;
    generateCombinations();
  });
  els.removeDupsCheck?.addEventListener('change', (e) => {
    state.removeDuplicates = e.target.checked;
    generateCombinations();
  });
  els.trimCheck?.addEventListener('change', (e) => {
    state.trimWords = e.target.checked;
    generateCombinations();
  });

  // Output Search Filter
  els.searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    state.displayLimit = 500;
    renderOutput();
  });

  // Infinite scroll on Output Canvas
  els.outputCanvas?.addEventListener('scroll', () => {
    const filtered = getFilteredResults();
    if (state.displayLimit < filtered.length) {
      const { scrollTop, scrollHeight, clientHeight } = els.outputCanvas;
      if (scrollTop + clientHeight >= scrollHeight - 120) {
        state.displayLimit += 500;
        renderOutput();
      }
    }
  });

  // Output Canvas Item Click / Selection & Load More
  els.outputCanvas?.addEventListener('click', (e) => {
    const filtered = getFilteredResults();

    if (e.target.id === 'loadMoreBtn' || e.target.closest('#loadMoreBtn')) {
      state.displayLimit += 500;
      renderOutput();
      return;
    }
    if (e.target.id === 'showAllBtn' || e.target.closest('#showAllBtn')) {
      state.displayLimit = filtered.length;
      renderOutput();
      return;
    }

    const line = e.target.closest('.output-line');
    if (!line) return;

    const index = parseInt(line.dataset.index, 10);
    const item = filtered[index];
    if (item === undefined) return;

    if (
      e.shiftKey &&
      state.lastClickedIndex >= 0 &&
      state.lastClickedIndex < filtered.length
    ) {
      const start = Math.min(state.lastClickedIndex, index);
      const end = Math.max(state.lastClickedIndex, index);
      const shouldSelect = !state.selectedItems.has(item);
      for (let i = start; i <= end; i++) {
        if (shouldSelect) {
          state.selectedItems.add(filtered[i]);
        } else {
          state.selectedItems.delete(filtered[i]);
        }
      }
    } else {
      if (state.selectedItems.has(item)) {
        state.selectedItems.delete(item);
      } else {
        state.selectedItems.add(item);
      }
    }

    state.lastClickedIndex = index;
    renderOutput();
  });

  // Master Checkbox Toggle
  els.selectAllCheckbox?.addEventListener('click', (e) => {
    const filtered = getFilteredResults();
    if (filtered.length === 0) return;

    let allSelected = true;
    for (const item of filtered) {
      if (!state.selectedItems.has(item)) {
        allSelected = false;
        break;
      }
    }

    if (allSelected) {
      for (const item of filtered) {
        state.selectedItems.delete(item);
      }
    } else {
      for (const item of filtered) {
        state.selectedItems.add(item);
      }
    }
    renderOutput();
  });

  // Selection Dropdown Menu
  els.selectMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (els.selectMenu) {
      els.selectMenu.hidden = !els.selectMenu.hidden;
    }
  });

  document.addEventListener('click', (e) => {
    if (
      els.selectMenu &&
      !els.selectMenu.hidden &&
      !e.target.closest('.mac-dropdown-wrap')
    ) {
      els.selectMenu.hidden = true;
    }
  });

  els.menuSelectAll?.addEventListener('click', () => {
    const filtered = getFilteredResults();
    for (const item of filtered) {
      state.selectedItems.add(item);
    }
    if (els.selectMenu) els.selectMenu.hidden = true;
    renderOutput();
  });

  els.menuDeselectAll?.addEventListener('click', () => {
    state.selectedItems.clear();
    if (els.selectMenu) els.selectMenu.hidden = true;
    renderOutput();
  });

  els.menuInvertSelection?.addEventListener('click', () => {
    const filtered = getFilteredResults();
    for (const item of filtered) {
      if (state.selectedItems.has(item)) {
        state.selectedItems.delete(item);
      } else {
        state.selectedItems.add(item);
      }
    }
    if (els.selectMenu) els.selectMenu.hidden = true;
    renderOutput();
  });

  // Quick Copy & Export Buttons
  els.quickCopyBtn?.addEventListener('click', quickCopy);
  els.exportBtn?.addEventListener('click', openExportModal);

  // Export Modal Controls
  els.closeExportModalBtn?.addEventListener('click', closeExportModal);
  els.modalCancelBtn?.addEventListener('click', closeExportModal);
  els.modalCopyBtn?.addEventListener('click', copyExportToClipboard);
  els.modalDownloadBtn?.addEventListener('click', downloadExportFile);

  els.exportModal?.addEventListener('click', (e) => {
    if (e.target === els.exportModal) closeExportModal();
  });

  els.exportScopeSegmented?.addEventListener('click', (e) => {
    const btn = e.target.closest('.mac-segment');
    if (btn && btn.dataset.scope && !btn.disabled) {
      setExportScope(btn.dataset.scope);
    }
  });

  els.exportFormatSegmented?.addEventListener('click', (e) => {
    const btn = e.target.closest('.mac-segment');
    if (btn && btn.dataset.format) {
      setExportFormat(btn.dataset.format);
    }
  });

  els.exportDelimiterSelect?.addEventListener('change', (e) => {
    state.exportConfig.delimiter = e.target.value;
    if (els.exportCustomDelimRow) {
      els.exportCustomDelimRow.hidden =
        state.exportConfig.delimiter !== 'custom';
    }
    updateExportModalPreview();
  });

  els.exportCustomDelimInput?.addEventListener('input', (e) => {
    state.exportConfig.customDelimiter = e.target.value;
    updateExportModalPreview();
  });

  els.exportHeaderToggle?.addEventListener('change', (e) => {
    state.exportConfig.includeHeader = e.target.checked;
    updateExportModalPreview();
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (els.exportModal && !els.exportModal.hidden) {
        closeExportModal();
        e.preventDefault();
      }
      if (els.selectMenu && !els.selectMenu.hidden) {
        els.selectMenu.hidden = true;
      }
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      openExportModal();
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
      if (document.activeElement === els.outputCanvas) {
        e.preventDefault();
        const filtered = getFilteredResults();
        for (const item of filtered) {
          state.selectedItems.add(item);
        }
        renderOutput();
      }
    }
  });
}

// ── Utils ──────────────────────────────────────────────────
function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

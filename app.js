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
  prefix: '',
  suffix: '',
  wrapper: 'none',
  removeDuplicates: true,
  trimWords: true,
  searchQuery: '',
  results: [],
  displayLimit: 500,
  isCalculating: false,
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
  calcTimeBadge: $('calcTimeBadge'),
  searchInput: $('searchInput'),
  exportBtn: $('exportBtn'),

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
  prefixInput: $('prefixInput'),
  suffixInput: $('suffixInput'),
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
    prefix,
    suffix,
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
    if (prefix || suffix) r = (prefix || '') + r + (suffix || '');
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
              <span style="font-size:11px; color:var(--labels--secondary); margin-right:8px; display:flex; align-items:center">${count} words</span>
              <input type="checkbox" class="mac-toggle" style="transform:scale(0.7); margin-right:4px" data-action="toggle" ${list.enabled ? 'checked' : ''} />
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
  const jobId = ++currentJobId;
  const active = state.lists
    .filter((l) => l.enabled)
    .map((l) => parseWords(l.text))
    .filter((a) => a.length > 0);

  if (active.length === 0) {
    state.results = [];
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
    prefix: state.prefix,
    suffix: state.suffix,
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
    if (p.prefix || p.suffix) r = (p.prefix || '') + r + (p.suffix || '');
    return r;
  });

  if (p.removeDuplicates) final = Array.from(new Set(final));
  state.results = final;
  renderOutput((performance.now() - t0).toFixed(1));
}

function renderOutput(ms = 0) {
  if (!els.outputCanvas) return;
  let items = state.results;
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    items = items.filter((x) => x.toLowerCase().includes(q));
  }

  els.totalCountBadge.textContent = state.searchQuery
    ? `${items.length} / ${state.results.length}`
    : state.results.length.toLocaleString();
  if (ms !== undefined && els.calcTimeBadge)
    els.calcTimeBadge.textContent = `${ms}ms`;

  if (items.length === 0) {
    els.outputCanvas.innerHTML = `<div class="empty-state">No combinations.</div>`;
    return;
  }

  const shown = items.slice(0, state.displayLimit);
  els.outputCanvas.innerHTML = shown
    .map((item) => `<div class="output-line">${escapeHtml(item)}</div>`)
    .join('');
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
        : 'dark'
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
  els.prefixInput?.addEventListener('input', (e) => {
    state.prefix = e.target.value;
    scheduleGeneration(80);
  });
  els.suffixInput?.addEventListener('input', (e) => {
    state.suffix = e.target.value;
    scheduleGeneration(80);
  });
  els.removeDupsCheck?.addEventListener('change', (e) => {
    state.removeDuplicates = e.target.checked;
    generateCombinations();
  });
  els.trimCheck?.addEventListener('change', (e) => {
    state.trimWords = e.target.checked;
    generateCombinations();
  });

  // Output
  els.searchInput?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderOutput();
  });

  // Export
  els.exportBtn?.addEventListener('click', () => {
    let items = state.results;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      items = items.filter((x) => x.toLowerCase().includes(q));
    }
    navigator.clipboard.writeText(items.join('\n'));
    els.exportBtn.textContent = 'Copied!';
    setTimeout(() => {
      els.exportBtn.textContent = 'Export…';
    }, 2000);
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

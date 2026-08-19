/**
 * Word Combiner Pro — macOS Native App Logic
 */

(function () {
  'use strict';

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
    caseTransform: 'as-is',
    prefix: '',
    suffix: '',
    wrapper: 'none',
    removeDuplicates: true,
    trimWords: true,
    searchQuery: '',
    results: [],
    displayLimit: 500,
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

  // ── Init ───────────────────────────────────────────────────
  function init() {
    initTheme();
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
      .map((list, idx) => {
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

  function transformCase(text) {
    switch (state.caseTransform) {
      case 'lower':
        return text.toLowerCase();
      case 'upper':
        return text.toUpperCase();
      case 'title':
        return text.replace(
          /\w\S*/g,
          (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
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
          .replace(/[\s_]+/g, '-')
          .toLowerCase();
      case 'snake':
        return text
          .replace(/([a-z])([A-Z])/g, '$1_$2')
          .replace(/[\s-]+/g, '_')
          .toLowerCase();
      default:
        return text;
    }
  }

  function applyWrapper(w) {
    switch (state.wrapper) {
      case 'quotes':
        return `"${w}"`;
      case 'brackets':
        return `[${w}]`;
      case 'braces':
        return `{${w}}`;
      default:
        return w;
    }
  }

  function generateCombinations() {
    const t0 = performance.now();
    const active = state.lists
      .filter((l) => l.enabled)
      .map((l) => parseWords(l.text))
      .filter((a) => a.length > 0);

    if (active.length === 0) {
      state.results = [];
      renderOutput(0);
      return;
    }

    const sep = getSep();
    let raw = [];

    if (state.combinationMode === 'cartesian') {
      raw = active.reduce((acc, cur) => {
        if (acc.length === 0) return cur;
        const out = [];
        for (const a of acc) for (const b of cur) out.push(a + sep + b);
        return out;
      }, []);
    } else if (state.combinationMode === 'zip') {
      const max = Math.max(...active.map((a) => a.length));
      for (let i = 0; i < max; i++) {
        const parts = active.map((a) => a[i]).filter(Boolean);
        if (parts.length) raw.push(parts.join(sep));
      }
    } else if (state.combinationMode === 'subsets') {
      (function subsets(arrs, prefix, depth) {
        if (depth === arrs.length) {
          if (prefix.length) raw.push(prefix.join(sep));
          return;
        }
        subsets(arrs, prefix, depth + 1);
        for (const w of arrs[depth]) subsets(arrs, [...prefix, w], depth + 1);
      })(active, [], 0);
    }

    let final = raw.map((item) => {
      let r = transformCase(item);
      if (state.wrapper !== 'none') r = applyWrapper(r);
      if (state.prefix || state.suffix) r = state.prefix + r + state.suffix;
      return r;
    });

    if (state.removeDuplicates) final = Array.from(new Set(final));

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
      : state.results.length;
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
        generateCombinations();
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
    els.separatorSelect?.addEventListener('change', (e) => {
      state.separatorType = e.target.value;
      els.customSepRow.hidden = state.separatorType !== 'custom';
      generateCombinations();
    });
    els.customSepInput?.addEventListener('input', (e) => {
      state.customSeparator = e.target.value;
      generateCombinations();
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
      generateCombinations();
    });
    els.suffixInput?.addEventListener('input', (e) => {
      state.suffix = e.target.value;
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

    // Output
    els.searchInput?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderOutput();
    });

    // Export (mock for now, copying to clipboard as default)
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
})();

/**
 * Word Combiner — Application Logic
 * Multi-list Cartesian / Subset / Zip combination engine
 * with case transforms, export (TXT, CSV, XLSX, MD, JSON), and real-time search.
 */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────
  const state = {
    lists: [
      { id: 1, name: 'List 1', text: 'best, top, cheap, ultimate', enabled: true },
      { id: 2, name: 'List 2', text: 'laptop, smartphone, headphones, monitor', enabled: true },
      { id: 3, name: 'List 3', text: 'deals, discounts, reviews, guide', enabled: true }
    ],
    nextId: 4,
    separatorType: 'space',   // 'space' | 'nothing' | 'custom'
    customSeparator: '-',
    combinationMode: 'cartesian', // 'cartesian' | 'subsets' | 'zip'
    caseTransform: 'as-is',
    prefix: '',
    suffix: '',
    wrapper: 'none',
    removeDuplicates: true,
    trimWords: true,
    searchQuery: '',
    results: [],
    displayLimit: 500
  };

  // ── Presets ────────────────────────────────────────────────
  const PRESETS = [
    {
      name: 'SEO Keywords',
      lists: [
        { name: 'Intent',   text: 'best, top, cheap, buy, review' },
        { name: 'Product',  text: 'gaming laptop, mechanical keyboard, 4k monitor' },
        { name: 'Modifier', text: '2026, online, deals, under $500' }
      ],
      separator: 'space',
      case: 'lower'
    },
    {
      name: 'Domain Ideas',
      lists: [
        { name: 'Prefix', text: 'super, hyper, quick, swift, smart, prime' },
        { name: 'Root',   text: 'stack, byte, flow, cloud, scale, sync' },
        { name: 'TLD',    text: '.com, .io, .ai, .dev, .app' }
      ],
      separator: 'nothing',
      case: 'lower'
    },
    {
      name: 'E-Commerce Tags',
      lists: [
        { name: 'Category', text: 'men, women, unisex, kids' },
        { name: 'Material', text: 'cotton, leather, linen, denim' },
        { name: 'Item',     text: 'jacket, sneakers, bag, hoodie' }
      ],
      separator: 'space',
      case: 'title'
    },
    {
      name: 'UTM Slugs',
      lists: [
        { name: 'Medium',   text: 'email, newsletter, social, cpc' },
        { name: 'Campaign', text: 'summer-sale, product-launch, promo' },
        { name: 'Audience', text: 'vip, new-users, leads' }
      ],
      separator: 'custom',
      customSep: '_',
      case: 'kebab'
    }
  ];

  // ── DOM refs ───────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const els = {
    themeToggleBtn:          $('themeToggleBtn'),
    themeIcon:               $('themeIcon'),
    wordListsContainer:      $('wordListsContainer'),
    addListBtn:              $('addListBtn'),
    clearAllListsBtn:        $('clearAllListsBtn'),
    separatorSegmented:      $('separatorSegmented'),
    customSeparatorWrapper:  $('customSeparatorWrapper'),
    customSeparatorInput:    $('customSeparatorInput'),
    combinationModeSelect:   $('combinationModeSelect'),
    caseTransformSelect:     $('caseTransformSelect'),
    wrapperSelect:           $('wrapperSelect'),
    prefixInput:             $('prefixInput'),
    suffixInput:             $('suffixInput'),
    removeDuplicatesCheckbox:$('removeDuplicatesCheckbox'),
    trimWordsCheckbox:       $('trimWordsCheckbox'),
    optionsToggleBtn:        $('optionsToggleBtn'),
    optionsContent:          $('optionsContent'),
    optionsChevron:          $('optionsChevron'),
    outputCanvas:            $('outputCanvas'),
    totalCountBadge:         $('totalCountBadge'),
    calcTimeBadge:           $('calcTimeBadge'),
    searchInput:             $('searchInput'),
    copyBtn:                 $('copyBtn'),
    exportDropdownBtn:       $('exportDropdownBtn'),
    exportMenu:              $('exportMenu'),
    toastContainer:          $('toastContainer'),
    presetsContainer:        $('presetsContainer')
  };

  // ── Init ───────────────────────────────────────────────────
  function init() {
    initTheme();
    renderPresets();
    renderLists();
    bindEvents();
    generateCombinations();
  }

  // ── Theme ──────────────────────────────────────────────────
  function initTheme() {
    const saved = localStorage.getItem('wc_theme');
    const sys   = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (sys ? 'dark' : 'light'));
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wc_theme', theme);
    if (!els.themeIcon) return;
    els.themeIcon.innerHTML = theme === 'dark'
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  // ── Presets ────────────────────────────────────────────────
  function renderPresets() {
    if (!els.presetsContainer) return;
    els.presetsContainer.innerHTML = PRESETS.map((p, i) =>
      `<button type="button" class="preset-chip" data-preset-index="${i}">${escapeHtml(p.name)}</button>`
    ).join('');
  }

  // ── Parsing ────────────────────────────────────────────────
  function parseWords(text) {
    if (!text) return [];
    return text.split(/[\n,;]+/)
      .map(t => state.trimWords ? t.trim() : t)
      .filter(t => t.length > 0);
  }

  // ── Render Lists ───────────────────────────────────────────
  function renderLists() {
    if (!els.wordListsContainer) return;
    els.wordListsContainer.innerHTML = state.lists.map((list, idx) => {
      const count = parseWords(list.text).length;
      return `
        <div class="word-card ${list.enabled ? '' : 'is-disabled'}" data-list-id="${list.id}">
          <div class="card-header">
            <div class="card-identity">
              <span class="list-index" aria-hidden="true">${idx + 1}</span>
              <input
                type="text"
                class="list-name-input"
                value="${escapeHtml(list.name)}"
                placeholder="List ${idx + 1}"
                data-action="rename"
                aria-label="List name"
              />
            </div>
            <div class="card-meta">
              <span class="word-count" aria-live="polite">${count} ${count === 1 ? 'word' : 'words'}</span>
              <label class="card-toggle" title="Enable / disable this list" aria-label="Enable list">
                <input type="checkbox" data-action="toggle" ${list.enabled ? 'checked' : ''} />
              </label>
              <div class="card-actions" role="toolbar" aria-label="List actions">
                ${idx > 0 ? `<button type="button" class="card-btn" data-action="move-up" title="Move up" aria-label="Move list up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg></button>` : ''}
                ${idx < state.lists.length - 1 ? `<button type="button" class="card-btn" data-action="move-down" title="Move down" aria-label="Move list down"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>` : ''}
                <button type="button" class="card-btn" data-action="duplicate" title="Duplicate list" aria-label="Duplicate list"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                <button type="button" class="card-btn" data-action="clear" title="Clear text" aria-label="Clear list text"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></button>
                ${state.lists.length > 1 ? `<button type="button" class="card-btn danger" data-action="delete" title="Delete list" aria-label="Delete list"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>` : ''}
              </div>
            </div>
          </div>
          <textarea
            class="list-textarea"
            placeholder="Enter words separated by commas or new lines…&#10;e.g. apple, banana, orange"
            aria-label="Words for ${escapeHtml(list.name)}"
          >${escapeHtml(list.text)}</textarea>
        </div>
      `;
    }).join('');
  }

  function addList() {
    state.lists.push({ id: state.nextId++, name: `List ${state.lists.length + 1}`, text: '', enabled: true });
    renderLists();
    generateCombinations();
    setTimeout(() => {
      const cards = els.wordListsContainer.querySelectorAll('.word-card');
      if (cards.length) cards[cards.length - 1].querySelector('.list-textarea').focus();
    }, 50);
  }

  // ── Combination Engine ─────────────────────────────────────
  function getSep() {
    if (state.separatorType === 'space')   return ' ';
    if (state.separatorType === 'nothing') return '';
    return state.customSeparator;
  }

  function transformCase(text) {
    switch (state.caseTransform) {
      case 'lower': return text.toLowerCase();
      case 'upper': return text.toUpperCase();
      case 'title': return text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      case 'camel': {
        const c = text.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
        return c ? c.charAt(0).toLowerCase() + c.slice(1) : '';
      }
      case 'kebab': return text.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
      case 'snake': return text.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase();
      default: return text;
    }
  }

  function applyWrapper(w) {
    switch (state.wrapper) {
      case 'quotes':         return `"${w}"`;
      case 'single-quotes':  return `'${w}'`;
      case 'brackets':       return `[${w}]`;
      case 'braces':         return `{${w}}`;
      case 'parentheses':    return `(${w})`;
      default:               return w;
    }
  }

  function generateCombinations() {
    const t0 = performance.now();
    const active = state.lists.filter(l => l.enabled).map(l => parseWords(l.text)).filter(a => a.length > 0);

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
      const max = Math.max(...active.map(a => a.length));
      for (let i = 0; i < max; i++) {
        const parts = active.map(a => a[i]).filter(Boolean);
        if (parts.length) raw.push(parts.join(sep));
      }
    } else if (state.combinationMode === 'subsets') {
      (function subsets(arrs, prefix, depth) {
        if (depth === arrs.length) { if (prefix.length) raw.push(prefix.join(sep)); return; }
        subsets(arrs, prefix, depth + 1);
        for (const w of arrs[depth]) subsets(arrs, [...prefix, w], depth + 1);
      })(active, [], 0);
    }

    let final = raw.map(item => {
      let r = transformCase(item);
      if (state.wrapper !== 'none') r = applyWrapper(r);
      if (state.prefix || state.suffix) r = state.prefix + r + state.suffix;
      return r;
    });

    if (state.removeDuplicates) final = Array.from(new Set(final));

    state.results = final;
    renderOutput((performance.now() - t0).toFixed(1));
  }

  // ── Render Output ──────────────────────────────────────────
  function renderOutput(ms = 0) {
    if (!els.outputCanvas) return;

    let items = state.results;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      items = items.filter(x => x.toLowerCase().includes(q));
    }

    if (els.totalCountBadge) {
      els.totalCountBadge.textContent = state.searchQuery
        ? `${items.length.toLocaleString()} of ${state.results.length.toLocaleString()}`
        : state.results.length.toLocaleString();
    }
    if (els.calcTimeBadge) els.calcTimeBadge.textContent = `${ms} ms`;

    if (items.length === 0) {
      els.outputCanvas.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="4"/>
            <line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/>
          </svg>
          <p>${state.results.length === 0 ? 'Add words to your lists to see combinations.' : `No results match "${escapeHtml(state.searchQuery)}"`}</p>
        </div>`;
      return;
    }

    const shown = items.slice(0, state.displayLimit);
    let html = shown.map((item, i) => `<div class="output-line" data-index="${i}">${escapeHtml(item)}</div>`).join('');

    if (items.length > state.displayLimit) {
      html += `<div style="padding: 12px 8px; text-align:center; color:var(--text-secondary); font-size:0.875rem; border-top:1px solid var(--border); margin-top:8px">
        Showing ${state.displayLimit.toLocaleString()} of ${items.length.toLocaleString()}.
        <button type="button" id="loadMoreBtn" style="margin-left:8px; font-size:inherit; color:var(--accent); background:none; border:none; cursor:pointer; font-family:inherit; font-weight:500">Show More</button>
      </div>`;
    }

    els.outputCanvas.innerHTML = html;

    const more = document.getElementById('loadMoreBtn');
    if (more) more.addEventListener('click', () => { state.displayLimit += 2000; renderOutput(ms); });
  }

  // ── Separator UI Sync ──────────────────────────────────────
  function syncSeparatorUI() {
    if (!els.separatorSegmented) return;
    els.separatorSegmented.querySelectorAll('.seg-btn').forEach(btn => {
      const active = btn.dataset.separator === state.separatorType;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    if (els.customSeparatorWrapper) {
      els.customSeparatorWrapper.hidden = state.separatorType !== 'custom';
    }
  }

  // ── Toast ──────────────────────────────────────────────────
  function toast(msg) {
    if (!els.toastContainer) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg><span>${escapeHtml(msg)}</span>`;
    els.toastContainer.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateX(-50%) translateY(-6px)';
      setTimeout(() => el.remove(), 220);
    }, 2400);
  }

  // ── Export Helpers ─────────────────────────────────────────
  function getExportData() {
    if (!state.searchQuery) return state.results;
    const q = state.searchQuery.toLowerCase();
    return state.results.filter(x => x.toLowerCase().includes(q));
  }

  function download(content, filename, mime) {
    const url = URL.createObjectURL(new Blob([content], { type: mime }));
    const a = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  }

  function exportTxt()  { const d = getExportData(); if (!d.length) return toast('No data to export'); download(d.join('\n'), 'word-combinations.txt', 'text/plain'); toast('Downloaded .txt'); }
  function exportCsv()  { const d = getExportData(); if (!d.length) return toast('No data to export'); download('Combination\n' + d.map(x => `"${x.replace(/"/g,'""')}"`).join('\n'), 'word-combinations.csv', 'text/csv'); toast('Downloaded .csv'); }
  function exportJson() { const d = getExportData(); if (!d.length) return toast('No data to export'); download(JSON.stringify({ total: d.length, combinations: d }, null, 2), 'word-combinations.json', 'application/json'); toast('Downloaded .json'); }
  function exportMd()   {
    const d = getExportData();
    if (!d.length) return toast('No data to export');
    let md = `# Word Combinations\n\n*Total: ${d.length}*\n\n| # | Combination |\n|---|---|\n`;
    d.slice(0, 2000).forEach((x, i) => md += `| ${i + 1} | ${x.replace(/\|/g, '\\|')} |\n`);
    if (d.length > 2000) md += `\n*…and ${d.length - 2000} more.*\n`;
    download(md, 'word-combinations.md', 'text/markdown');
    toast('Downloaded .md');
  }
  function exportXlsx() {
    const d = getExportData();
    if (!d.length) return toast('No data to export');
    if (window.XLSX) {
      const ws = window.XLSX.utils.json_to_sheet(d.map((v, i) => ({ '#': i + 1, Combination: v })));
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, 'Combinations');
      window.XLSX.writeFile(wb, 'word-combinations.xlsx');
      toast('Downloaded .xlsx');
    } else {
      toast('XLSX library not loaded — try refreshing.');
    }
  }

  // ── Event Binding ──────────────────────────────────────────
  function bindEvents() {

    // Theme
    els.themeToggleBtn?.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(cur === 'dark' ? 'light' : 'dark');
    });

    // Add list
    els.addListBtn?.addEventListener('click', addList);

    // Clear all
    els.clearAllListsBtn?.addEventListener('click', () => {
      state.lists.forEach(l => l.text = '');
      renderLists();
      generateCombinations();
      toast('Cleared all lists');
    });

    // Presets
    els.presetsContainer?.addEventListener('click', e => {
      const chip = e.target.closest('.preset-chip');
      if (!chip) return;
      const preset = PRESETS[parseInt(chip.dataset.presetIndex, 10)];
      if (!preset) return;
      state.lists = preset.lists.map(l => ({ id: state.nextId++, name: l.name, text: l.text, enabled: true }));
      state.separatorType = preset.separator;
      if (preset.customSep) state.customSeparator = preset.customSep;
      if (preset.case) { state.caseTransform = preset.case; if (els.caseTransformSelect) els.caseTransformSelect.value = preset.case; }
      syncSeparatorUI();
      renderLists();
      generateCombinations();
      toast(`Loaded "${preset.name}"`);
    });

    // Word list delegation
    els.wordListsContainer?.addEventListener('input', e => {
      const card = e.target.closest('.word-card');
      if (!card) return;
      const list = state.lists.find(l => l.id === +card.dataset.listId);
      if (!list) return;
      if (e.target.classList.contains('list-textarea')) {
        list.text = e.target.value;
        const badge = card.querySelector('.word-count');
        const cnt = parseWords(list.text).length;
        if (badge) badge.textContent = `${cnt} ${cnt === 1 ? 'word' : 'words'}`;
        generateCombinations();
      } else if (e.target.classList.contains('list-name-input')) {
        list.name = e.target.value;
      }
    });

    els.wordListsContainer?.addEventListener('click', e => {
      const card = e.target.closest('.word-card');
      if (!card) return;
      const idx  = state.lists.findIndex(l => l.id === +card.dataset.listId);
      if (idx === -1) return;

      const chk = e.target.closest('input[data-action="toggle"]');
      if (chk) {
        state.lists[idx].enabled = chk.checked;
        card.classList.toggle('is-disabled', !chk.checked);
        generateCombinations();
        return;
      }

      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;

      if (action === 'delete' && state.lists.length > 1) {
        state.lists.splice(idx, 1);
        renderLists(); generateCombinations();
      } else if (action === 'duplicate') {
        const orig = state.lists[idx];
        state.lists.splice(idx + 1, 0, { id: state.nextId++, name: `${orig.name} Copy`, text: orig.text, enabled: orig.enabled });
        renderLists(); generateCombinations();
      } else if (action === 'clear') {
        state.lists[idx].text = '';
        card.querySelector('.list-textarea').value = '';
        card.querySelector('.word-count').textContent = '0 words';
        generateCombinations();
      } else if (action === 'move-up' && idx > 0) {
        [state.lists[idx - 1], state.lists[idx]] = [state.lists[idx], state.lists[idx - 1]];
        renderLists(); generateCombinations();
      } else if (action === 'move-down' && idx < state.lists.length - 1) {
        [state.lists[idx], state.lists[idx + 1]] = [state.lists[idx + 1], state.lists[idx]];
        renderLists(); generateCombinations();
      }
    });

    // Separator
    els.separatorSegmented?.addEventListener('click', e => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      state.separatorType = btn.dataset.separator;
      syncSeparatorUI();
      generateCombinations();
    });

    els.customSeparatorInput?.addEventListener('input', e => { state.customSeparator = e.target.value; generateCombinations(); });

    // Advanced options
    els.combinationModeSelect?.addEventListener('change',  e => { state.combinationMode = e.target.value;  generateCombinations(); });
    els.caseTransformSelect?.addEventListener('change',    e => { state.caseTransform   = e.target.value;  generateCombinations(); });
    els.wrapperSelect?.addEventListener('change',          e => { state.wrapper         = e.target.value;  generateCombinations(); });
    els.prefixInput?.addEventListener('input',             e => { state.prefix          = e.target.value;  generateCombinations(); });
    els.suffixInput?.addEventListener('input',             e => { state.suffix          = e.target.value;  generateCombinations(); });
    els.removeDuplicatesCheckbox?.addEventListener('change', e => { state.removeDuplicates = e.target.checked; generateCombinations(); });
    els.trimWordsCheckbox?.addEventListener('change',        e => { state.trimWords        = e.target.checked; generateCombinations(); });

    // Advanced toggle
    els.optionsToggleBtn?.addEventListener('click', () => {
      const open = !els.optionsContent.hidden;
      els.optionsContent.hidden = open;
      els.optionsToggleBtn.setAttribute('aria-expanded', String(!open));
      if (els.optionsChevron) els.optionsChevron.style.transform = open ? '' : 'rotate(180deg)';
    });

    // Search
    els.searchInput?.addEventListener('input', e => { state.searchQuery = e.target.value; renderOutput(); });

    // Copy
    els.copyBtn?.addEventListener('click', () => {
      const d = getExportData();
      if (!d.length) return toast('No combinations to copy');
      copyText(d.join('\n'));
      toast(`Copied ${d.length.toLocaleString()} combinations`);
    });

    // Export dropdown
    els.exportDropdownBtn?.addEventListener('click', e => {
      e.stopPropagation();
      const hidden = els.exportMenu.hidden;
      els.exportMenu.hidden = !hidden;
      els.exportDropdownBtn.setAttribute('aria-expanded', String(hidden));
    });

    document.addEventListener('click', e => {
      if (!els.exportDropdownBtn?.contains(e.target) && !els.exportMenu?.contains(e.target)) {
        if (els.exportMenu) { els.exportMenu.hidden = true; els.exportDropdownBtn?.setAttribute('aria-expanded', 'false'); }
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && els.exportMenu && !els.exportMenu.hidden) {
        els.exportMenu.hidden = true;
        els.exportDropdownBtn?.setAttribute('aria-expanded', 'false');
        els.exportDropdownBtn?.focus();
      }
    });

    els.exportMenu?.addEventListener('click', e => {
      const item = e.target.closest('.menu-item');
      if (!item) return;
      els.exportMenu.hidden = true;
      els.exportDropdownBtn?.setAttribute('aria-expanded', 'false');
      const action = item.dataset.action;
      if (action === 'download-txt')  exportTxt();
      else if (action === 'download-csv')  exportCsv();
      else if (action === 'download-xlsx') exportXlsx();
      else if (action === 'download-md')   exportMd();
      else if (action === 'download-json') exportJson();
      else if (action === 'copy-comma') {
        const d = getExportData();
        copyText(d.join(', '));
        toast(`Copied ${d.length.toLocaleString()} comma-separated`);
      } else if (action === 'copy-json') {
        copyText(JSON.stringify(getExportData()));
        toast('Copied JSON array');
      }
    });

    // Keyboard shortcut: Cmd/Ctrl+Shift+C
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        const d = getExportData();
        if (!d.length) return;
        copyText(d.join('\n'));
        toast(`Copied ${d.length.toLocaleString()} combinations`);
      }
    });
  }

  // ── Utilities ──────────────────────────────────────────────
  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ── Boot ───────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/**
 * Apple-Designed Advanced Word Combiner
 * High performance, multi-list generator with smart delimiters, 
 * live metrics, case transformations, and versatile exports (TXT, CSV, XLSX, MD, JSON).
 */

(function () {
  'use strict';

  // --- State Management ---
  const state = {
    lists: [
      { id: 1, name: 'List 1', text: 'best, top, cheap, ultimate', enabled: true },
      { id: 2, name: 'List 2', text: 'laptop, smartphone, headphones, monitor', enabled: true },
      { id: 3, name: 'List 3', text: 'deals, discounts, reviews, guide', enabled: true }
    ],
    nextId: 4,
    separatorType: 'space', // 'space', 'nothing', 'custom'
    customSeparator: '-',
    combinationMode: 'cartesian', // 'cartesian', 'subsets', 'zip'
    caseTransform: 'as-is', // 'as-is', 'lower', 'upper', 'title', 'camel', 'kebab', 'snake'
    prefix: '',
    suffix: '',
    wrapper: 'none', // 'none', 'quotes', 'single-quotes', 'brackets', 'braces', 'parentheses'
    removeDuplicates: true,
    trimWords: true,
    searchQuery: '',
    results: [],
    displayLimit: 500
  };

  // --- DOM Elements ---
  const elements = {
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    wordListsContainer: document.getElementById('wordListsContainer'),
    addListBtn: document.getElementById('addListBtn'),
    clearAllListsBtn: document.getElementById('clearAllListsBtn'),
    separatorSegmented: document.getElementById('separatorSegmented'),
    customSeparatorWrapper: document.getElementById('customSeparatorWrapper'),
    customSeparatorInput: document.getElementById('customSeparatorInput'),
    combinationModeSelect: document.getElementById('combinationModeSelect'),
    caseTransformSelect: document.getElementById('caseTransformSelect'),
    wrapperSelect: document.getElementById('wrapperSelect'),
    prefixInput: document.getElementById('prefixInput'),
    suffixInput: document.getElementById('suffixInput'),
    removeDuplicatesCheckbox: document.getElementById('removeDuplicatesCheckbox'),
    trimWordsCheckbox: document.getElementById('trimWordsCheckbox'),
    optionsToggleBtn: document.getElementById('optionsToggleBtn'),
    optionsContent: document.getElementById('optionsContent'),
    optionsChevron: document.getElementById('optionsChevron'),
    outputCanvas: document.getElementById('outputCanvas'),
    totalCountBadge: document.getElementById('totalCountBadge'),
    calcTimeBadge: document.getElementById('calcTimeBadge'),
    searchInput: document.getElementById('searchInput'),
    copyBtn: document.getElementById('copyBtn'),
    exportDropdownBtn: document.getElementById('exportDropdownBtn'),
    exportMenu: document.getElementById('exportMenu'),
    toastContainer: document.getElementById('toastContainer'),
    presetsContainer: document.getElementById('presetsContainer')
  };

  // --- Presets Data ---
  const PRESETS = [
    {
      name: '🔍 SEO Keywords',
      lists: [
        { name: 'Intent', text: 'best, top, cheap, buy, review' },
        { name: 'Product', text: 'gaming laptop, mechanical keyboard, 4k monitor' },
        { name: 'Modifier', text: '2026, online, deals, under $500' }
      ],
      separator: 'space',
      case: 'lower'
    },
    {
      name: '🌐 Domain Ideas',
      lists: [
        { name: 'Prefix', text: 'super, hyper, quick, swift, smart, prime' },
        { name: 'Root', text: 'stack, byte, flow, cloud, scale, sync' },
        { name: 'TLD', text: '.com, .io, .ai, .dev, .app' }
      ],
      separator: 'nothing',
      case: 'lower'
    },
    {
      name: '🏷️ E-Commerce Tags',
      lists: [
        { name: 'Category', text: 'men, women, unisex, kids' },
        { name: 'Material', text: 'cotton, leather, linen, denim' },
        { name: 'Item', text: 'jacket, sneakers, bag, hoodie' }
      ],
      separator: 'space',
      case: 'title'
    },
    {
      name: '⚡ URL / UTM Slugs',
      lists: [
        { name: 'Medium', text: 'email, newsletter, social, cpc' },
        { name: 'Campaign', text: 'summer-sale, product-launch, promo' },
        { name: 'Audience', text: 'vip, new-users, leads' }
      ],
      separator: 'custom',
      customSep: '_',
      case: 'kebab'
    }
  ];

  // --- Initialization ---
  function init() {
    initTheme();
    renderPresets();
    renderLists();
    bindEvents();
    generateCombinations();
  }

  // --- Theme Handling ---
  function initTheme() {
    const savedTheme = localStorage.getItem('apple_word_combiner_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(activeTheme);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('apple_word_combiner_theme', theme);
    if (elements.themeIcon) {
      elements.themeIcon.innerHTML = theme === 'dark' 
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }

  // --- Presets Rendering ---
  function renderPresets() {
    if (!elements.presetsContainer) return;
    elements.presetsContainer.innerHTML = PRESETS.map((p, idx) => `
      <button type="button" class="preset-chip" data-preset-index="${idx}">
        ${p.name}
      </button>
    `).join('');
  }

  // --- Parse Input Words ---
  function parseWordsFromText(text) {
    if (!text || typeof text !== 'string') return [];
    // Split by newlines, commas, or semicolons
    const tokens = text.split(/[\n,;]+/);
    const result = [];
    for (let token of tokens) {
      let t = state.trimWords ? token.trim() : token;
      if (t.length > 0) {
        result.push(t);
      }
    }
    return result;
  }

  // --- Word Lists Management ---
  function renderLists() {
    if (!elements.wordListsContainer) return;
    
    elements.wordListsContainer.innerHTML = state.lists.map((list, index) => {
      const parsedWords = parseWordsFromText(list.text);
      const wordCount = parsedWords.length;
      return `
        <div class="word-list-card ${list.enabled ? '' : 'disabled'}" data-list-id="${list.id}">
          <div class="word-list-header">
            <div class="list-identity">
              <span class="list-tag">${index + 1}</span>
              <input type="text" class="list-title-input" value="${escapeHtml(list.name)}" placeholder="List ${index + 1}" data-action="rename" title="Click to rename list" />
            </div>
            <div class="list-meta">
              <span class="word-count-chip">${wordCount} ${wordCount === 1 ? 'word' : 'words'}</span>
              <label class="checkbox-label" title="Enable / disable this list" style="margin: 0;">
                <input type="checkbox" data-action="toggle" ${list.enabled ? 'checked' : ''} />
              </label>
              <div class="list-card-actions">
                ${index > 0 ? `<button type="button" class="btn btn-ghost btn-sm btn-icon" data-action="move-up" title="Move Up"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg></button>` : ''}
                ${index < state.lists.length - 1 ? `<button type="button" class="btn btn-ghost btn-sm btn-icon" data-action="move-down" title="Move Down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg></button>` : ''}
                <button type="button" class="btn btn-ghost btn-sm btn-icon" data-action="duplicate" title="Duplicate List"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
                <button type="button" class="btn btn-ghost btn-sm btn-icon" data-action="clear" title="Clear text"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg></button>
                ${state.lists.length > 1 ? `<button type="button" class="btn btn-ghost btn-sm btn-icon" data-action="delete" title="Delete list" style="color: var(--danger);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>` : ''}
              </div>
            </div>
          </div>
          <textarea class="list-textarea" placeholder="Enter words separated by commas or new lines...&#10;e.g. apple, banana, orange">${escapeHtml(list.text)}</textarea>
        </div>
      `;
    }).join('');
  }

  function addList() {
    state.lists.push({
      id: state.nextId++,
      name: `List ${state.lists.length + 1}`,
      text: '',
      enabled: true
    });
    renderLists();
    generateCombinations();
    // Focus the new textarea
    setTimeout(() => {
      const cards = elements.wordListsContainer.querySelectorAll('.word-list-card');
      if (cards.length > 0) {
        const lastCard = cards[cards.length - 1];
        const textarea = lastCard.querySelector('.list-textarea');
        if (textarea) textarea.focus();
      }
    }, 50);
  }

  // --- Combinations Generator Core Engine ---
  function getEffectiveSeparator() {
    if (state.separatorType === 'space') return ' ';
    if (state.separatorType === 'nothing') return '';
    return state.customSeparator;
  }

  function transformCase(text, type) {
    if (!text) return '';
    switch (type) {
      case 'lower':
        return text.toLowerCase();
      case 'upper':
        return text.toUpperCase();
      case 'title':
        return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
      case 'camel': {
        const cleaned = text.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
        return cleaned ? cleaned.charAt(0).toLowerCase() + cleaned.slice(1) : '';
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

  function applyWrapper(word, wrapperType) {
    switch (wrapperType) {
      case 'quotes':
        return `"${word}"`;
      case 'single-quotes':
        return `'${word}'`;
      case 'brackets':
        return `[${word}]`;
      case 'braces':
        return `{${word}}`;
      case 'parentheses':
        return `(${word})`;
      default:
        return word;
    }
  }

  function generateCombinations() {
    const startTime = performance.now();
    
    // Get active word arrays
    const activeLists = state.lists
      .filter(l => l.enabled)
      .map(l => parseWordsFromText(l.text))
      .filter(arr => arr.length > 0);

    if (activeLists.length === 0) {
      state.results = [];
      renderOutput(0);
      return;
    }

    const sep = getEffectiveSeparator();
    let rawResults = [];

    if (state.combinationMode === 'cartesian') {
      // Standard Cartesian Product
      rawResults = activeLists.reduce((acc, currList) => {
        if (acc.length === 0) return currList;
        const temp = [];
        for (let i = 0; i < acc.length; i++) {
          for (let j = 0; j < currList.length; j++) {
            temp.push(acc[i] + sep + currList[j]);
          }
        }
        return temp;
      }, []);
    } else if (state.combinationMode === 'zip') {
      // Zip line by line
      const maxLen = Math.max(...activeLists.map(l => l.length));
      for (let i = 0; i < maxLen; i++) {
        const parts = [];
        for (let list of activeLists) {
          if (i < list.length) {
            parts.push(list[i]);
          }
        }
        if (parts.length > 0) {
          rawResults.push(parts.join(sep));
        }
      }
    } else if (state.combinationMode === 'subsets') {
      // All combinations of lengths from 1 to N
      function getSubsets(arrs, prefix = [], depth = 0) {
        if (depth === arrs.length) {
          if (prefix.length > 0) {
            rawResults.push(prefix.join(sep));
          }
          return;
        }
        // Option 1: omit this list
        getSubsets(arrs, prefix, depth + 1);
        // Option 2: pick each word from this list
        for (let word of arrs[depth]) {
          getSubsets(arrs, [...prefix, word], depth + 1);
        }
      }
      getSubsets(activeLists);
    }

    // Apply Case, Wrapper, Prefix, Suffix
    let finalResults = [];
    const hasPrefix = Boolean(state.prefix);
    const hasSuffix = Boolean(state.suffix);

    for (let item of rawResults) {
      let transformed = transformCase(item, state.caseTransform);
      if (state.wrapper !== 'none') {
        transformed = applyWrapper(transformed, state.wrapper);
      }
      if (hasPrefix || hasSuffix) {
        transformed = `${state.prefix}${transformed}${state.suffix}`;
      }
      finalResults.push(transformed);
    }

    // Deduplicate if requested
    if (state.removeDuplicates) {
      finalResults = Array.from(new Set(finalResults));
    }

    state.results = finalResults;
    const duration = (performance.now() - startTime).toFixed(1);
    renderOutput(duration);
  }

  // --- Output Rendering & Filtering ---
  function renderOutput(calcTimeMs = 0) {
    if (!elements.outputCanvas) return;

    let filtered = state.results;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      filtered = state.results.filter(item => item.toLowerCase().includes(q));
    }

    // Update Badges
    if (elements.totalCountBadge) {
      if (state.searchQuery) {
        elements.totalCountBadge.textContent = `${filtered.length.toLocaleString()} of ${state.results.length.toLocaleString()}`;
      } else {
        elements.totalCountBadge.textContent = `${state.results.length.toLocaleString()}`;
      }
    }

    if (elements.calcTimeBadge) {
      elements.calcTimeBadge.textContent = `${calcTimeMs} ms`;
    }

    if (filtered.length === 0) {
      if (state.results.length === 0) {
        elements.outputCanvas.innerHTML = `
          <div class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="4"></rect>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="16"></line>
            </svg>
            <p>Add words to your lists to generate combinations instantly.</p>
          </div>
        `;
      } else {
        elements.outputCanvas.innerHTML = `
          <div class="empty-state">
            <p>No results match "<strong>${escapeHtml(state.searchQuery)}</strong>"</p>
          </div>
        `;
      }
      return;
    }

    // Limit DOM rendering for smoothness if very large
    const displayItems = filtered.slice(0, state.displayLimit);
    let html = displayItems.map((item, idx) => `
      <div class="output-line" data-index="${idx}">${escapeHtml(item)}</div>
    `).join('');

    if (filtered.length > state.displayLimit) {
      html += `
        <div style="padding: 0.75rem 0.25rem; text-align: center; color: var(--text-secondary); font-size: 0.8rem; border-top: 1px dashed var(--border-light); margin-top: 0.5rem;">
          Showing first ${state.displayLimit.toLocaleString()} of ${filtered.length.toLocaleString()} items. (All ${filtered.length.toLocaleString()} will be copied/exported).
          <button type="button" class="btn btn-secondary btn-sm" id="loadMoreBtn" style="margin-left: 0.5rem;">Show More</button>
        </div>
      `;
    }

    elements.outputCanvas.innerHTML = html;

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        state.displayLimit += 2000;
        renderOutput(calcTimeMs);
      });
    }
  }

  // --- Copy & Export Engine ---
  function showToast(message, type = 'normal') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px) scale(0.95)';
      setTimeout(() => toast.remove(), 200);
    }, 2200);
  }

  function getExportData() {
    let data = state.results;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      data = state.results.filter(item => item.toLowerCase().includes(q));
    }
    return data;
  }

  function copyToClipboard(format = 'newline') {
    const data = getExportData();
    if (data.length === 0) {
      showToast('No combinations to copy');
      return;
    }

    let textToCopy = '';
    if (format === 'newline') {
      textToCopy = data.join('\n');
    } else if (format === 'comma') {
      textToCopy = data.join(', ');
    } else if (format === 'json') {
      textToCopy = JSON.stringify(data, null, 2);
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast(`Copied ${data.length.toLocaleString()} combinations!`);
    }).catch(() => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(`Copied ${data.length.toLocaleString()} combinations!`);
    });
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportTxt() {
    const data = getExportData();
    if (data.length === 0) return showToast('No data to export');
    downloadFile(data.join('\n'), 'word-combinations.txt', 'text/plain;charset=utf-8');
    showToast('Downloaded .txt file');
  }

  function exportCsv() {
    const data = getExportData();
    if (data.length === 0) return showToast('No data to export');
    const csvContent = 'Combination\n' + data.map(item => `"${item.replace(/"/g, '""')}"`).join('\n');
    downloadFile(csvContent, 'word-combinations.csv', 'text/csv;charset=utf-8');
    showToast('Downloaded .csv file');
  }

  function exportJson() {
    const data = getExportData();
    if (data.length === 0) return showToast('No data to export');
    const jsonContent = JSON.stringify({
      total: data.length,
      separator: state.separatorType === 'custom' ? state.customSeparator : state.separatorType,
      combinations: data
    }, null, 2);
    downloadFile(jsonContent, 'word-combinations.json', 'application/json;charset=utf-8');
    showToast('Downloaded .json file');
  }

  function exportMarkdown() {
    const data = getExportData();
    if (data.length === 0) return showToast('No data to export');
    
    // Create comprehensive markdown document with list and table
    let md = `# Word Combinations\n\n`;
    md += `*Total items: ${data.length}*\n\n`;
    md += `| # | Combination |\n`;
    md += `|---|---|\n`;
    data.slice(0, 2000).forEach((item, index) => {
      md += `| ${index + 1} | ${item.replace(/\|/g, '\\|')} |\n`;
    });
    if (data.length > 2000) {
      md += `\n*...and ${data.length - 2000} more items.*\n`;
    }
    
    downloadFile(md, 'word-combinations.md', 'text/markdown;charset=utf-8');
    showToast('Downloaded .md file');
  }

  function exportXlsx() {
    const data = getExportData();
    if (data.length === 0) return showToast('No data to export');

    if (window.XLSX) {
      const rows = data.map((val, idx) => ({ Index: idx + 1, Combination: val }));
      const worksheet = window.XLSX.utils.json_to_sheet(rows);
      const workbook = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Combinations');
      window.XLSX.writeFile(workbook, 'word-combinations.xlsx');
      showToast('Downloaded .xlsx workbook');
    } else {
      // Fallback: Excel XML Spreadsheet 2003
      let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Combinations">
  <Table>
   <Row><Cell><Data ss:Type="String">Index</Data></Cell><Cell><Data ss:Type="String">Combination</Data></Cell></Row>
`;
      data.forEach((item, i) => {
        xml += `   <Row><Cell><Data ss:Type="Number">${i + 1}</Data></Cell><Cell><Data ss:Type="String">${escapeXml(item)}</Data></Cell></Row>\n`;
      });
      xml += `  </Table>
 </Worksheet>
</Workbook>`;
      downloadFile(xml, 'word-combinations.xls', 'application/vnd.ms-excel');
      showToast('Downloaded Excel file');
    }
  }

  // --- Helpers ---
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeXml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // --- Event Bindings ---
  function bindEvents() {
    // Theme toggle
    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
      });
    }

    // Add List
    if (elements.addListBtn) {
      elements.addListBtn.addEventListener('click', addList);
    }

    // Clear All Lists
    if (elements.clearAllListsBtn) {
      elements.clearAllListsBtn.addEventListener('click', () => {
        state.lists.forEach(l => l.text = '');
        renderLists();
        generateCombinations();
        showToast('Cleared all word lists');
      });
    }

    // Preset selection
    if (elements.presetsContainer) {
      elements.presetsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.preset-chip');
        if (!chip) return;
        const idx = parseInt(chip.getAttribute('data-preset-index'), 10);
        const preset = PRESETS[idx];
        if (!preset) return;

        state.lists = preset.lists.map((l, i) => ({
          id: state.nextId++,
          name: l.name,
          text: l.text,
          enabled: true
        }));

        state.separatorType = preset.separator;
        if (preset.customSep) state.customSeparator = preset.customSep;
        if (preset.case) state.caseTransform = preset.case;

        // Update UI controls
        updateSeparatorUI();
        if (elements.caseTransformSelect) elements.caseTransformSelect.value = state.caseTransform;

        renderLists();
        generateCombinations();
        showToast(`Loaded "${preset.name}" preset`);
      });
    }

    // Word Lists Delegation (Text typing, Delete, Duplicate, Move, Toggle, Rename)
    if (elements.wordListsContainer) {
      elements.wordListsContainer.addEventListener('input', (e) => {
        const card = e.target.closest('.word-list-card');
        if (!card) return;
        const listId = parseInt(card.getAttribute('data-list-id'), 10);
        const list = state.lists.find(l => l.id === listId);
        if (!list) return;

        if (e.target.classList.contains('list-textarea')) {
          list.text = e.target.value;
          // Update live counter badge
          const countBadge = card.querySelector('.word-count-chip');
          const count = parseWordsFromText(list.text).length;
          if (countBadge) countBadge.textContent = `${count} ${count === 1 ? 'word' : 'words'}`;
          generateCombinations();
        } else if (e.target.classList.contains('list-title-input')) {
          list.name = e.target.value;
        }
      });

      elements.wordListsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        const checkbox = e.target.closest('input[data-action="toggle"]');
        const card = e.target.closest('.word-list-card');
        if (!card) return;
        const listId = parseInt(card.getAttribute('data-list-id'), 10);
        const index = state.lists.findIndex(l => l.id === listId);
        if (index === -1) return;

        if (checkbox) {
          state.lists[index].enabled = checkbox.checked;
          card.classList.toggle('disabled', !checkbox.checked);
          generateCombinations();
          return;
        }

        if (!btn) return;
        const action = btn.getAttribute('data-action');

        if (action === 'delete') {
          if (state.lists.length <= 1) return;
          state.lists.splice(index, 1);
          renderLists();
          generateCombinations();
        } else if (action === 'duplicate') {
          const original = state.lists[index];
          state.lists.splice(index + 1, 0, {
            id: state.nextId++,
            name: `${original.name} (Copy)`,
            text: original.text,
            enabled: original.enabled
          });
          renderLists();
          generateCombinations();
        } else if (action === 'clear') {
          state.lists[index].text = '';
          const textarea = card.querySelector('.list-textarea');
          if (textarea) textarea.value = '';
          const countBadge = card.querySelector('.word-count-chip');
          if (countBadge) countBadge.textContent = '0 words';
          generateCombinations();
        } else if (action === 'move-up') {
          if (index > 0) {
            const temp = state.lists[index];
            state.lists[index] = state.lists[index - 1];
            state.lists[index - 1] = temp;
            renderLists();
            generateCombinations();
          }
        } else if (action === 'move-down') {
          if (index < state.lists.length - 1) {
            const temp = state.lists[index];
            state.lists[index] = state.lists[index + 1];
            state.lists[index + 1] = temp;
            renderLists();
            generateCombinations();
          }
        }
      });
    }

    // Separator segmented control
    if (elements.separatorSegmented) {
      elements.separatorSegmented.addEventListener('click', (e) => {
        const btn = e.target.closest('.segment-btn');
        if (!btn) return;
        const sepValue = btn.getAttribute('data-separator');
        state.separatorType = sepValue;
        updateSeparatorUI();
        generateCombinations();
      });
    }

    // Custom separator text input
    if (elements.customSeparatorInput) {
      elements.customSeparatorInput.addEventListener('input', (e) => {
        state.customSeparator = e.target.value;
        generateCombinations();
      });
    }

    // Combination mode
    if (elements.combinationModeSelect) {
      elements.combinationModeSelect.addEventListener('change', (e) => {
        state.combinationMode = e.target.value;
        generateCombinations();
      });
    }

    // Case transform
    if (elements.caseTransformSelect) {
      elements.caseTransformSelect.addEventListener('change', (e) => {
        state.caseTransform = e.target.value;
        generateCombinations();
      });
    }

    // Wrapper
    if (elements.wrapperSelect) {
      elements.wrapperSelect.addEventListener('change', (e) => {
        state.wrapper = e.target.value;
        generateCombinations();
      });
    }

    // Prefix & Suffix
    if (elements.prefixInput) {
      elements.prefixInput.addEventListener('input', (e) => {
        state.prefix = e.target.value;
        generateCombinations();
      });
    }
    if (elements.suffixInput) {
      elements.suffixInput.addEventListener('input', (e) => {
        state.suffix = e.target.value;
        generateCombinations();
      });
    }

    // Deduplicate & Trim
    if (elements.removeDuplicatesCheckbox) {
      elements.removeDuplicatesCheckbox.addEventListener('change', (e) => {
        state.removeDuplicates = e.target.checked;
        generateCombinations();
      });
    }
    if (elements.trimWordsCheckbox) {
      elements.trimWordsCheckbox.addEventListener('change', (e) => {
        state.trimWords = e.target.checked;
        generateCombinations();
      });
    }

    // Options accordion toggle
    if (elements.optionsToggleBtn) {
      elements.optionsToggleBtn.addEventListener('click', () => {
        const isOpen = elements.optionsContent.classList.contains('open');
        elements.optionsContent.classList.toggle('open', !isOpen);
        if (elements.optionsChevron) {
          elements.optionsChevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    }

    // Search query
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderOutput(0);
      });
    }

    // Primary Copy Button
    if (elements.copyBtn) {
      elements.copyBtn.addEventListener('click', () => copyToClipboard('newline'));
    }

    // Export Dropdown menu toggle
    if (elements.exportDropdownBtn && elements.exportMenu) {
      elements.exportDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.exportMenu.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.export-dropdown-wrapper')) {
          elements.exportMenu.classList.remove('show');
        }
      });

      elements.exportMenu.addEventListener('click', (e) => {
        const item = e.target.closest('.export-menu-item');
        if (!item) return;
        const action = item.getAttribute('data-action');
        elements.exportMenu.classList.remove('show');

        switch (action) {
          case 'copy-newline':
            copyToClipboard('newline');
            break;
          case 'copy-comma':
            copyToClipboard('comma');
            break;
          case 'copy-json':
            copyToClipboard('json');
            break;
          case 'download-txt':
            exportTxt();
            break;
          case 'download-csv':
            exportCsv();
            break;
          case 'download-xlsx':
            exportXlsx();
            break;
          case 'download-md':
            exportMarkdown();
            break;
          case 'download-json':
            exportJson();
            break;
        }
      });
    }

    // Global keyboard shortcuts (⌘+Shift+C / Ctrl+Shift+C to copy all)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copyToClipboard('newline');
      }
    });
  }

  function updateSeparatorUI() {
    if (!elements.separatorSegmented) return;
    elements.separatorSegmented.querySelectorAll('.segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-separator') === state.separatorType);
    });

    if (elements.customSeparatorWrapper) {
      elements.customSeparatorWrapper.classList.toggle('visible', state.separatorType === 'custom');
      if (state.separatorType === 'custom' && elements.customSeparatorInput) {
        elements.customSeparatorInput.value = state.customSeparator;
        elements.customSeparatorInput.focus();
      }
    }
  }

  // --- Run on Load ---
  document.addEventListener('DOMContentLoaded', init);
})();

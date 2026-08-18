# Apple HIG — Layout, Grid & Responsive System

---

## Spacing Philosophy

Apple's whitespace is the product's pedestal. The space around content is as
important as the content itself — it is not wasted space, it is structural.

### The fundamental rules:

- Every tile begins with **at least 64px of air above its headline** and 48–64px below
- Product renders are never crowded — nearest content is **at least 40px away**
- Section vertical padding: **80px** inside any product tile (`--space-section`)
- Tiles stack edge-to-edge with **0 gap** — the color change is the only divider
- Card padding: **24px** (`--space-lg`) internally
- Button padding: 8–11px vertical, 15–22px horizontal
- Footer is the only area that breaks this pattern — deliberately dense for information density

---

## Grid & Container

### Max content widths:

| Context                            | Max Width          |
| ---------------------------------- | ------------------ |
| Text-heavy sections (environment)  | ~980px             |
| Product grids (store, accessories) | ~1440px            |
| Product tiles (homepage hero)      | Full-bleed (100vw) |

### Column patterns:

- **5-column**: Accessories grid at full desktop
- **4-column**: Store grid at desktop
- **3-column**: Utility grid, tablets
- **2-column**: Side-by-side tiles, occasional homepage sections
- **1-column**: All product tile heroes (centered stack)

### Gutters:

- Between cards in utility grid: **20–24px**

### CSS grid template:

```css
/* Utility card grid — starts at 5-col, collapses responsively */
.utility-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--space-xl);
}

/* Product tile — always full-bleed */
.product-tile {
  width: 100%;
  padding: var(--space-section) var(--space-xl); /* 80px vertical */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
```

---

## Responsive Breakpoints

8 breakpoints. The critical ones for most builds: 1440px, 1068px, 834px, 640px.

| Name             | Width       | Key Changes                                                     |
| ---------------- | ----------- | --------------------------------------------------------------- |
| Wide desktop     | ≥1441px     | Content locks at 1440px; margins absorb extra width             |
| Desktop          | 1069–1440px | Full layout; 4–5 col grids; 1440px content max                  |
| Small desktop    | 1024–1068px | Tiles use 2/3 width with margin gutters; h1 stays at 40px       |
| Tablet landscape | 834–1023px  | Global nav fully expanded; 3-col utility grids → 2-col          |
| Tablet portrait  | 736–833px   | Global nav collapses to hamburger; sub-nav hides category chips |
| Large phone      | 641–735px   | Tiles → tighter padding (48px vs 80px); fine-print wraps        |
| Phone            | 420–640px   | Single-column stack; renders scale to 80% tile width; h1 → 34px |
| Small phone      | ≤419px      | Single column; sub-nav collapses to name + CTA only; h1 → 28px  |

### Key responsive breakpoint CSS:

```css
/* Hero typography collapses */
.hero-headline {
  font-size: 56px; /* hero-display */
}

@media (max-width: 1068px) {
  .hero-headline {
    font-size: 40px;
  } /* display-lg */
}

@media (max-width: 640px) {
  .hero-headline {
    font-size: 34px;
  } /* display-md */
}

@media (max-width: 419px) {
  .hero-headline {
    font-size: 28px;
  } /* lead */
}

/* Global nav collapse */
@media (max-width: 834px) {
  .global-nav .nav-links {
    display: none;
  }
  .global-nav .hamburger {
    display: flex;
  }
  .global-nav .logo {
    margin: 0 auto;
  }
}

/* Utility grid collapse */
@media (max-width: 1440px) {
  .utility-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 1068px) {
  .utility-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 834px) {
  .utility-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .utility-grid {
    grid-template-columns: 1fr;
  }
}

/* Product tile padding tightens on mobile */
@media (max-width: 735px) {
  .product-tile {
    padding: 48px var(--space-xl);
  }
}
```

---

## Navigation Collapsing Strategy

### Global nav:

- Desktop: Full horizontal link row
- ≤834px: Apple logo + hamburger + bag icon only

### Sub-nav:

- Desktop: Category name + inline links + primary CTA
- Mobile: Category name + primary CTA only; links move into hamburger tray

### Product tiles:

- Desktop: 2-column → 1-column at 834px
- Padding tightens: 80px → 48px at small phone

### Utility grids (store, accessories):

5-col (desktop) → 4-col (1440px) → 3-col (1068px) → 2-col (834px) → 1-col (640px)

---

## Photography & Image Rules

- **Hero imagery**: Full-bleed, 21:9 or taller on homepage; 16:9 on environment/shop
- **Product renders**: PNG/WebP with transparency; rest on surface tile with product shadow
- **No rounded corners on hero images** — full-bleed rectangular always
- **Rounding appears only** on inline card imagery (`--radius-sm` 8px) and utility card images
- **Accessory grid**: Square 1:1 crops at `--radius-lg` (18px), centered with 20–40px internal padding
- **Responsive srcset**: Breakpoint-matched crops; CDN-optimized WebP; lazy-loading default
- **Hero above-fold**: Loads eagerly (no lazy-loading)
- **Art direction at mobile**: Photography may switch crop to taller aspect ratio

---

## Touch Targets

- **Minimum**: 44×44px for all interactive elements
- `button-primary`: lands at ~44×100px (pill radius makes hit area more generous)
- `button-icon-circular`: exactly 44×44px
- Global nav utility links: ~32×80px (precision desktop actions, replaced by hamburger at ≤834px)

---

## Visual Hierarchy Principles

1. **Most important content top-left** (reading order; accounts for RTL support)
2. **Alignment conveys organization** — align components to make scanning easier
3. **Progressive disclosure** — reveal content progressively; don't show everything at once
4. **Surface-color change = divider** — never use decorative borders/lines between sections
5. **Whitespace = pedestal** — space around content communicates importance

---

## Do's

- Use `#0066cc` for every interactive element — links, pill CTAs, focus signals
- Set headlines in hero-display or display-lg with negative letter-spacing
- Run body copy at 17px / 400 / line-height 1.47 / tracking -0.374px
- Alternate product-tile-light and product-tile-dark for full-bleed section rhythm
- Reserve `--radius-pill` for primary CTA and action elements (search, chips, sticky bar CTA)
- Apply the single product shadow only to product renders resting on a surface
- Use `transform: scale(0.95)` as the active/press state on every button
- Keep the global nav `#000000` — it's the only place pure black appears
- Extend content/backgrounds to full viewport edges

---

## Don'ts

- Don't introduce a second accent color
- Don't add shadows to cards, buttons, or text
- Don't use gradients as decorative backgrounds
- Don't set body copy at weight 500 — ladder is 300 / 400 / 600 / 700
- Don't round full-bleed tiles — tiles are always rectangular and edge-to-edge
- Don't tighten line-height below 1.47 for body copy
- Don't mix radii grammars — compact utility = sm (8px), cards = lg (18px), actions = pill
- Don't use `#2997ff` (Sky Link Blue) on light surfaces — it is dark-tile only
- Don't add motion to UI interactions that occur frequently — keep micro-interactions subtle
- Don't place controls or critical information at the very bottom of a window/page (macOS)
- Don't use weight 500 anywhere
- Don't approximate hex values — use the exact tokens from tokens.md

---

## RTL (Right-to-Left) Support

When building for RTL languages (Arabic, Hebrew, etc.):

- Flip horizontal layout directions: leading → trailing swap
- Mirror navigation (hamburger moves to left, logo to right)
- Use logical CSS properties: `margin-inline-start` instead of `margin-left`
- Do not mirror icons that have universal directional meaning (play, audio)
- Do mirror icons with directional meaning (back arrow, forward arrow, chevrons)
- Test with real RTL content — translated text often expands 30–40% in length

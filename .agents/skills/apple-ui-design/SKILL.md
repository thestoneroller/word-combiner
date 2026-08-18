---
name: apple-ui-design
description: >
  Apple Human Interface Guidelines (HIG) design system for building premium,
  Apple-quality web interfaces. Provides exact design tokens, component specs,
  typography rules, color system, layout principles, and interaction patterns
  reverse-engineered from Apple's web presence. Use this skill whenever building
  or reviewing a UI that should feel clean, minimal, premium, or Apple-inspired —
  even if the user doesn't say "Apple". Triggers on: clean UI, modern design,
  premium, minimal, polished, HIG, Apple style, beautiful interface, great UX,
  product page, landing page, dashboard, web app design.
---

# Apple Human Interface Guidelines — UI Design Skill

This skill encodes Apple's complete web design language: exact tokens, component
patterns, layout rules, and the psychological principles that make Apple's
interfaces feel effortless. Follow this document fully before touching pixels.

---

## Workflow

### Step 1 — Understand the surface type

Identify what surface this is: **hero/marketing**, **utility/app**, or **store/product**.
Each uses the same token system at a different "volume":

- Marketing → full-bleed tiles, photography-first, generous whitespace
- Utility/App → utility cards, sidebar, denser controls
- Store/Product → configurator chips, floating sticky bar, accessory grid

### Step 2 — Read design tokens (always)

Every build requires the exact values in `references/tokens.md`.
Load it before writing any CSS or styles. Never approximate or substitute.

### Step 3 — Apply core rules (non-negotiable)

These rules are absolute — no exceptions:

1. **One accent color only.** Every interactive element — links, pill CTAs, focus
   rings — uses Action Blue `#0066cc`. No second brand color exists.

2. **One shadow only.** `rgba(0, 0, 0, 0.22) 3px 5px 30px 0` applies exclusively
   to product photography resting on a surface. Zero shadows on cards, buttons,
   text, or chrome.

3. **Body text at 17px, not 16px.** This defines Apple's "reading, not scanning"
   editorial pace.

4. **Negative letter-spacing on display text.** Hero: −0.28px. Body+: −0.374px.
   This produces the signature "Apple tight" headline cadence.

5. **Weight ladder: 300 / 400 / 600 / 700.** Weight 500 is deliberately absent.
   Body = 400. Strong inline = 600. Display = 600. Rare airy moments = 300.

6. **Active/press state = `transform: scale(0.95)`.** This is the system-wide
   micro-interaction. Never use `brightness()` or `opacity` as the primary press signal.

7. **Tile alternation IS the section divider.** Light tile → Dark tile → Light tile.
   No borders, no shadows, no decorative lines between sections. Color change does the work.

8. **Rounded only where the grammar says.** Pill (9999px) = actions only.
   18px = utility cards. 8px = compact utility buttons. Full-bleed tiles = 0.
   Never mix radii grammars.

### Step 4 — Pick components

Load `references/components.md` when implementing specific UI elements.
Each component entry is self-contained with exact values.

### Step 5 — Apply layout

Load `references/layout.md` for grid, whitespace philosophy, and responsive
breakpoints. Whitespace rules are as important as the colors.

### Step 6 — Verify principles

Load `references/principles.md` to check decisions against Apple's psychological
framework. Every UI decision should trace back to a principle.

---

## Quick-Reference: The Most Critical Tokens

These are required on every build. Full tables are in `references/tokens.md`.

### Colors (most-used)

| Token          | Value   | Use                                                 |
| -------------- | ------- | --------------------------------------------------- |
| Action Blue    | #0066cc | ALL interactive elements — links, CTAs, focus rings |
| Focus Blue     | #0071e3 | Keyboard focus ring only (outline: 2px solid)       |
| Sky Link Blue  | #2997ff | Links on dark tiles only                            |
| Ink            | #1d1d1f | All headlines + body text on light surfaces         |
| Body-on-Dark   | #ffffff | All text on dark tiles and global nav               |
| Canvas         | #ffffff | Primary light surface                               |
| Parchment      | #f5f5f7 | Alternating light tile, footer, sub-nav             |
| Surface-Tile-1 | #272729 | Primary dark tile                                   |
| Surface-Black  | #000000 | Global nav bar ONLY                                 |
| Hairline       | #e0e0e0 | Utility card borders                                |
| Divider-Soft   | #f0f0f0 | Secondary button rings                              |

### Typography (most-used)

| Role         | Size | Weight | Line-H | Tracking | Use                           |
| ------------ | ---- | ------ | ------ | -------- | ----------------------------- |
| hero-display | 56px | 600    | 1.07   | -0.28px  | Page hero headline            |
| display-lg   | 40px | 600    | 1.10   | 0        | Tile headline each section    |
| tagline      | 21px | 600    | 1.19   | +0.231px | Sub-nav name, tile subhead    |
| body         | 17px | 400    | 1.47   | -0.374px | All paragraph text            |
| body-strong  | 17px | 600    | 1.24   | -0.374px | Inline emphasis               |
| caption      | 14px | 400    | 1.43   | -0.224px | Secondary labels, button text |
| nav-link     | 12px | 400    | 1.0    | -0.12px  | Global nav items              |

Font stack: `SF Pro Display, system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
Non-Apple platforms: substitute **Inter** with `letter-spacing: -0.01em` at display sizes.

### Spacing

| Token   | Value | Use                        |
| ------- | ----- | -------------------------- |
| xxs     | 4px   | Micro adjustments          |
| xs      | 8px   | Tight inline spacing       |
| sm      | 12px  | Control padding            |
| md      | 17px  | Body rhythm unit           |
| lg      | 24px  | Card internal padding      |
| xl      | 32px  | Component gaps             |
| xxl     | 48px  | Sub-section gaps           |
| section | 80px  | Full tile vertical padding |

### Border Radius

| Token | Value  | Where                                   |
| ----- | ------ | --------------------------------------- |
| none  | 0px    | Full-bleed tiles                        |
| xs    | 5px    | Rare inline chip                        |
| sm    | 8px    | Compact utility buttons                 |
| md    | 11px   | Pearl secondary capsule                 |
| lg    | 18px   | Store / utility cards                   |
| pill  | 9999px | Primary CTA, search, configurator chips |
| full  | 9999px | Circular icon buttons over photography  |

---

## Gotchas

- Do NOT use #0071e3 as the primary interactive color — that is the focus-ring
  variant. Action Blue #0066cc is the brand interactive color.

- Do NOT add box-shadow to cards or panels. Elevation comes from surface-color
  change, not shadows. The only shadow is on product photography.

- Do NOT set body text to 16px. The 17px body is non-negotiable.

- Do NOT use gradients as decorative backgrounds. Atmosphere comes from
  photography and surface alternation, never CSS gradients.

- Do NOT round full-bleed tiles. Tiles touch viewport edges with 0 radius.

- Do NOT use Sky Link Blue (#2997ff) on light surfaces — exclusively for dark tiles.

- Do NOT use weight 500 anywhere.

---

## Reference Files

Load these on demand when implementing specific areas:

- `references/tokens.md` — Complete token tables: full color palette, all 15
  typography styles, spacing, radius. Load when writing CSS variables or style sheets.

- `references/components.md` — Every component with exact specs: global-nav,
  sub-nav-frosted, all button variants, product tiles, utility cards, configurator
  chips, search input, floating sticky bar, footer. Load when implementing a
  specific UI element.

- `references/layout.md` — Grid, whitespace philosophy, responsive breakpoints
  (8 breakpoints from <=419px to >=1441px), collapsing strategy, image behavior,
  and do's & don'ts. Load when structuring page layout.

- `references/principles.md` — The psychological and philosophical framework:
  Clarity/Deference/Depth, plus the 7 HIG principles with actionable sub-rules.
  Load when making design decisions or reviewing an existing UI.

- `references/foundations.md` — **Writing/voice rules, branding guidelines, SF Symbols
  system (rendering modes, animations, custom symbols), full accessibility specs with
  exact contrast ratios, and RTL layout rules.** Load when writing copy, choosing icons,
  implementing accessibility, or building RTL-aware layouts.

- `references/behaviors.md` — **When to use which component and how it should behave.**
  Covers: button roles/types, the toggle decision tree (switch vs. checkbox vs. radio),
  segmented controls, text field validation, alert/sheet/popover selection guide,
  toolbar grouping rules, sidebar/tab-bar rules, progress indicator types, and chart
  design rules. Load when deciding between similar components or implementing interaction logic.

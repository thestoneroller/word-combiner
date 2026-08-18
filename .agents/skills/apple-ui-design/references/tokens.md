# Apple HIG — Complete Design Tokens

Every value here is sourced from analysis of Apple's live web pages (homepage,
store, environment, iPhone buy page, accessories). Use these verbatim — never
approximate. Always set these as CSS custom properties at `:root`.

---

## Color Palette

### Brand & Interactive

| Name          | Token                     | Hex       | Use                                                      |
| ------------- | ------------------------- | --------- | -------------------------------------------------------- |
| Action Blue   | `--color-primary`         | `#0066cc` | Every interactive element: links, pill CTAs, focus roots |
| Focus Blue    | `--color-primary-focus`   | `#0071e3` | Keyboard focus ring (`outline: 2px solid`) ONLY          |
| Sky Link Blue | `--color-primary-on-dark` | `#2997ff` | In-copy links on dark tiles where Action Blue disappears |

### Light Surfaces

| Name      | Token                      | Hex       | Use                                                                       |
| --------- | -------------------------- | --------- | ------------------------------------------------------------------------- |
| Canvas    | `--color-canvas`           | `#ffffff` | Primary content surface, utility cards, store tiles                       |
| Parchment | `--color-canvas-parchment` | `#f5f5f7` | Alternating light tiles, footer, sub-nav background                       |
| Pearl     | `--color-surface-pearl`    | `#fafafc` | Secondary button fill (lighter than parchment so button reads against it) |

### Dark Surfaces

| Name             | Token                    | Hex       | Use                                                                                         |
| ---------------- | ------------------------ | --------- | ------------------------------------------------------------------------------------------- |
| Surface Tile 1   | `--color-surface-tile-1` | `#272729` | Primary dark tile on homepage product grid                                                  |
| Surface Tile 2   | `--color-surface-tile-2` | `#2a2a2c` | Dark tile adjacent to Tile 1 — micro-step lighter for separation                            |
| Surface Tile 3   | `--color-surface-tile-3` | `#252527` | Bottom-of-stack and embedded video frames                                                   |
| Surface Black    | `--color-surface-black`  | `#000000` | Global nav bar ONLY. Pure black is reserved for nav.                                        |
| Chip Translucent | `--color-surface-chip`   | `#d2d2d7` | Base hex of translucent chip over photography — use at ~64% alpha: `rgba(210,210,215,0.64)` |

### Text

| Name         | Token                  | Hex       | Use                                                                |
| ------------ | ---------------------- | --------- | ------------------------------------------------------------------ |
| Ink          | `--color-ink`          | `#1d1d1f` | All headlines + body on light surfaces. Near-black not pure black. |
| Body         | `--color-body`         | `#1d1d1f` | Same as ink — Apple uses one near-black for all light-surface text |
| Body-on-Dark | `--color-body-on-dark` | `#ffffff` | All text on dark tiles and global nav                              |
| Body Muted   | `--color-body-muted`   | `#cccccc` | Secondary copy on dark tiles where pure white is too loud          |
| Ink Muted 80 | `--color-ink-muted-80` | `#333333` | Body text on Pearl button surface                                  |
| Ink Muted 48 | `--color-ink-muted-48` | `#7a7a7a` | Disabled button text, fine-print, footer body                      |
| On Primary   | `--color-on-primary`   | `#ffffff` | Text on Action Blue buttons                                        |
| On Dark      | `--color-on-dark`      | `#ffffff` | Text on any dark tile surface                                      |

### Borders & Hairlines

| Name         | Token                  | Hex       | Use                                                         |
| ------------ | ---------------------- | --------- | ----------------------------------------------------------- |
| Divider Soft | `--color-divider-soft` | `#f0f0f0` | Secondary button ring — often applied as `rgba(0,0,0,0.04)` |
| Hairline     | `--color-hairline`     | `#e0e0e0` | 1px border on utility cards and configurator chips          |

### No Gradients

Apple's color system has **zero gradient tokens**. Decorative depth comes from
photography, not CSS gradients. Never add gradient backgrounds.

---

## Typography

### Font Families

```css
/* Display: headlines at 19px and up */
--font-display:
  'SF Pro Display', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

/* Body/UI: body copy, captions, buttons, links below 20px */
--font-body:
  'SF Pro Text', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace: code samples */
--font-mono:
  ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace;
```

**Non-Apple platform substitute**: Use **Inter** (Google Fonts, variable).

- Set `letter-spacing: -0.01em` on display sizes (Inter runs slightly wider than SF Pro)
- Tighten line-height by 0.03 for body (Inter's taller x-height needs less leading)
- `font-feature-settings: "ss03"` approximates SF Pro's rounded "a"

### Complete Style Table

| Style            | Font    | Size | Weight | Line-H | Letter-Spacing | Use                                                 |
| ---------------- | ------- | ---- | ------ | ------ | -------------- | --------------------------------------------------- |
| `hero-display`   | Display | 56px | 600    | 1.07   | −0.28px        | Hero headline — the signature Apple tight tracking  |
| `display-lg`     | Display | 40px | 600    | 1.10   | 0              | Tile headline atop every product tile               |
| `display-md`     | Text    | 34px | 600    | 1.47   | −0.374px       | Section heads at text-face proportions              |
| `lead`           | Display | 28px | 400    | 1.14   | +0.196px       | Product tile subcopy                                |
| `lead-airy`      | Text    | 24px | 300    | 1.5    | 0              | Environment-page lead paragraphs (rare weight 300)  |
| `tagline`        | Display | 21px | 600    | 1.19   | +0.231px       | Sub-tile tagline, sub-nav category name             |
| `body-strong`    | Text    | 17px | 600    | 1.24   | −0.374px       | Inline strong emphasis                              |
| `body`           | Text    | 17px | 400    | 1.47   | −0.374px       | Default paragraph — NOT 16px                        |
| `dense-link`     | Text    | 17px | 400    | 2.41   | 0              | Footer/store utility link columns (relaxed leading) |
| `caption-strong` | Text    | 14px | 600    | 1.29   | −0.224px       | Emphasized captions                                 |
| `caption`        | Text    | 14px | 400    | 1.43   | −0.224px       | Secondary captions, button labels                   |
| `button-large`   | Text    | 18px | 300    | 1.0    | 0              | Store hero CTAs (rare weight 300)                   |
| `button-utility` | Text    | 14px | 400    | 1.29   | −0.224px       | Utility/nav button labels                           |
| `fine-print`     | Text    | 12px | 400    | 1.0    | −0.12px        | Fine-print, footer body                             |
| `micro-legal`    | Text    | 10px | 400    | 1.3    | −0.08px        | Micro legal disclaimers                             |
| `nav-link`       | Text    | 12px | 400    | 1.0    | −0.12px        | Global nav menu items                               |

### Typography Principles

- **Negative tracking at display sizes.** Every style at 17px+ carries slight tightening
  (−0.12px to −0.374px). Never tighten at 12px or below.
- **Body at 17px.** The extra pixel over SaaS-standard 16px defines the brand.
- **Weight 300 is real and rare.** Two uses: `button-large` (18px) and `lead-airy` (24px).
- **Weight 600 for headlines, not 700.** 700 is only used when extra assertion is needed.
- **Line-height is context-specific.** Display: 1.07–1.19 (tight). Body: 1.47.
  Footer link stacks: 2.41 (relaxed). The 2.41 is intentional — it makes dense columns scannable.
- **Weight ladder: 300 / 400 / 600 / 700.** Weight 500 is absent by design.

---

## Spacing System

Base unit: **8px**. Sub-base values (2, 4, 5, 6, 7) for typographic micro-adjustments only.
Structural layout always snaps to 8/12/16/20/24.

| Token   | Value | CSS Var           | Use                                       |
| ------- | ----- | ----------------- | ----------------------------------------- |
| xxs     | 4px   | `--space-xxs`     | Micro adjustments                         |
| xs      | 8px   | `--space-xs`      | Tight inline spacing                      |
| sm      | 12px  | `--space-sm`      | Control padding                           |
| md      | 17px  | `--space-md`      | Body rhythm unit (matches body font size) |
| lg      | 24px  | `--space-lg`      | Card internal padding                     |
| xl      | 32px  | `--space-xl`      | Component gaps                            |
| xxl     | 48px  | `--space-xxl`     | Sub-section gaps                          |
| section | 80px  | `--space-section` | Full tile vertical padding                |

### Critical spacing rules:

- Section vertical padding: 80px inside any product tile
- Tiles stack edge-to-edge with **0 gap** between them (color change = divider)
- Card padding: 24px (lg) internal to utility grid cards
- Minimum space between product render and nearest content: 40px
- Hero headline: minimum 64px air above it

---

## Border Radius

| Token | Value  | CSS Var         | Use                                                          |
| ----- | ------ | --------------- | ------------------------------------------------------------ |
| none  | 0px    | `--radius-none` | Full-bleed product tiles — tiles are always rectangular      |
| xs    | 5px    | `--radius-xs`   | Inline links styled as subtle chips (rare)                   |
| sm    | 8px    | `--radius-sm`   | Compact utility buttons (Sign In, Bag), inline card imagery  |
| md    | 11px   | `--radius-md`   | White Pearl Button capsules                                  |
| lg    | 18px   | `--radius-lg`   | Store utility cards, accessories grid cards                  |
| pill  | 9999px | `--radius-pill` | Primary CTAs, sub-nav buy button, configurator chips, search |
| full  | 9999px | `--radius-full` | Circular controls floating over photography (44×44px)        |

**Rule**: Never mix radii grammars. Compact utility = sm. Cards = lg. Actions = pill.
Nothing in between except the rare Pearl Button (md).

---

## Elevation & Depth

Apple's elevation system is deliberately minimal:

| Level          | Treatment                                                     | Use                                                    |
| -------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| Flat           | No shadow, no border                                          | Full-bleed tiles, global nav, footer, body sections    |
| Soft hairline  | `1px rgba(0,0,0,0.08) border`                                 | Utility cards, sub-nav separator                       |
| Backdrop blur  | `backdrop-filter: saturate(180%) blur(20px)` on Parchment 80% | Sub-nav, floating sticky bar                           |
| Product shadow | `rgba(0,0,0,0.22) 3px 5px 30px 0`                             | Product renders resting on a surface — THE ONLY SHADOW |

**Shadow philosophy**: Apple uses exactly **one** drop-shadow, applied to product
photography — never to cards, buttons, or text. Elevation in chrome comes from
(a) surface color change (light ↔ dark tile) and (b) backdrop-blur on sticky bars.

---

## CSS Custom Properties Template

```css
:root {
  /* === COLORS === */
  --color-primary: #0066cc;
  --color-primary-focus: #0071e3;
  --color-primary-on-dark: #2997ff;
  --color-on-primary: #ffffff;
  --color-on-dark: #ffffff;

  --color-canvas: #ffffff;
  --color-canvas-parchment: #f5f5f7;
  --color-surface-pearl: #fafafc;
  --color-surface-tile-1: #272729;
  --color-surface-tile-2: #2a2a2c;
  --color-surface-tile-3: #252527;
  --color-surface-black: #000000;
  --color-surface-chip: rgba(210, 210, 215, 0.64);

  --color-ink: #1d1d1f;
  --color-body: #1d1d1f;
  --color-body-on-dark: #ffffff;
  --color-body-muted: #cccccc;
  --color-ink-muted-80: #333333;
  --color-ink-muted-48: #7a7a7a;

  --color-hairline: #e0e0e0;
  --color-divider-soft: #f0f0f0;

  /* === TYPOGRAPHY === */
  --font-display:
    'SF Pro Display', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body:
    'SF Pro Text', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:
    ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace;

  /* === SPACING === */
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 17px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;
  --space-section: 80px;

  /* === BORDER RADIUS === */
  --radius-none: 0px;
  --radius-xs: 5px;
  --radius-sm: 8px;
  --radius-md: 11px;
  --radius-lg: 18px;
  --radius-pill: 9999px;
  --radius-full: 9999px;

  /* === SHADOWS === */
  /* The one and only shadow — product photography ONLY */
  --shadow-product: rgba(0, 0, 0, 0.22) 3px 5px 30px 0;

  /* === ANIMATIONS === */
  --ease-apple: cubic-bezier(0.25, 0.1, 0.25, 1);
  --duration-micro: 150ms;
  --duration-base: 300ms;
  --duration-enter: 500ms;
}
```

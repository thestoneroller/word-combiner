# Apple macOS System Tokens (apple.css)

This file documents Apple's **native macOS design token system** — the exact CSS
custom properties exported from Apple's macOS component kit (Figma/Framer source).

These tokens are **distinct from the web/marketing tokens in `tokens.md`**:
- `tokens.md` → Apple's **web design language** (apple.com, marketing, store)
- This file → Apple's **native macOS UI** (AppKit/SwiftUI component spec for web replicas)

Use these when building **utility/app surfaces** that should feel like native macOS:
panels, inspectors, settings windows, sidebars, tables, form controls.

---

## Color System Architecture

Apple's color system uses 5 semantic layers. Always reference by semantic name,
never by hex — so light/dark switching happens automatically.

### Layer 1 — Labels (Text)

Labels are the primary way to express text hierarchy. Always use the semantic
label, not a hardcoded hex.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--labels--primary` | `rgba(0,0,0,0.85)` | `rgba(255,255,255,0.85)` | Primary body text, headings |
| `--labels--secondary` | `rgba(0,0,0,0.5)` | `rgba(255,255,255,0.55)` | Secondary text, captions, hints |
| `--labels--tertiary` | `rgba(0,0,0,0.25)` | `rgba(255,255,255,0.25)` | Placeholder text, disabled labels |
| `--labels--quaternary` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` | Ghost text, barely visible |
| `--labels--quinary` | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` | Ultra-subtle separators in text |
| `--labels--white` | `#ffffff` | `#ffffff` | Text on colored fills only |

**Vibrant variants** (for use on blurred/translucent backgrounds):

| Token | Light | Dark |
|-------|-------|------|
| `--labels---vibrant--primary` | `#1a1a1a` | `#f5f5f5` |
| `--labels---vibrant--secondary` | `#727272` | `#8a8a8a` |
| `--labels---vibrant--tertiary` | `#bfbfbf` | `#404040` |
| `--labels---vibrant--quaternary` | `#d9d9d9` | `#262626` |
| `--labels---vibrant--quinary` | `#e6e6e6` | `#111111` |

---

### Layer 2 — Fills (Backgrounds)

Fills are used for control backgrounds, selection states, and surface tinting.

**Opaque fills** (for solid backgrounds):

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--fills---opaque--primary` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` | Control hover, list selection |
| `--fills---opaque--secondary` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` | Alternate row backgrounds |
| `--fills---opaque--tertiary` | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` | Sidebar item hover |
| `--fills---opaque--quaternary` | `rgba(0,0,0,0.03)` | `rgba(255,255,255,0.03)` | Very subtle tint |
| `--fills---opaque--quinary` | `rgba(0,0,0,0.02)` | `rgba(255,255,255,0.02)` | Nearly invisible |

**Vibrant fills** (for use behind backdrop-filter blur — "frosted glass"):

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--fills---vibrant--primary` | `#d9d9d9` | `#242424` | Sidebar selection over vibrancy |
| `--fills---vibrant--secondary` | `#e6e6e6` | `#141414` | Secondary panel background |
| `--fills---vibrant--tertiary` | `#f2f2f2` | `#0d0d0d` | Tertiary panel |
| `--fills---vibrant--quaternary` | `#f7f7f7` | `#090909` | Subtle area behind vibrancy |
| `--fills---vibrant--quinary` | `#fbfbfb` | `#070707` | Near-white/near-black vibrancy |

---

### Layer 3 — Window Background

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--window-background` | `#ffffff` | `#1e1e1e` | Primary app window surface |

---

### Layer 4 — Grays

| Token | Light/Dark | Use |
|-------|------------|-----|
| `--grays--black` | `#000000` | Absolute black |
| `--grays--white` | `#ffffff` | Absolute white |
| `--grays--gray` | `#8e8e93` (light) / `#98989f` (dark) | Neutral gray for icons, strokes |

---

### Layer 5 — Accent Colors

Apple provides 12 accent colors, each with a standard and vibrant variant.
The **vibrant** variant is slightly more saturated — use on blurred/frosted surfaces.

| Name | Light Hex | Dark Hex |
|------|-----------|----------|
| Red | `#ff383c` | `#ff4245` |
| Orange | `#ff8d28` | `#ff9230` |
| Yellow | `#ffcc00` | `#ffd600` |
| Green | `#34c759` | `#30d158` |
| Mint | `#00c8b3` | `#00dac3` |
| Teal | `#00c3d0` | `#00d2e0` |
| Cyan | `#00c0e8` | `#3cd3fe` |
| Blue | `#0088ff` | `#0091ff` |
| Indigo | `#6155f5` | `#6d7cff` |
| Purple | `#cb30e0` | `#db34f2` |
| Pink | `#ff2d55` | `#ff375f` |
| Brown | `#ac7f5e` | `#b78a66` |

**Vibrant variants** are prefixed `--accents---vibrant--{name}`.

**Default interactive accent** = Blue (`--accents--blue`).
This is the macOS equivalent of Action Blue `#0066cc` from the web token system.

> [!NOTE]
> The macOS Blue (`#0088ff` light / `#0091ff` dark) is NOT the same as Apple web
> Action Blue (`#0066cc`). macOS UI uses a brighter, more saturated blue. For web
> interfaces, always use `#0066cc`. For native-feeling app UIs, use `--accents--blue`.

---

### Layer 6 — Miscellaneous Semantic Tokens

These are component-specific semantic values:

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--miscellaneous--alerts--overlay` | `rgba(171,171,171,0.6)` | `rgba(23,23,23,0.62)` | Alert/modal scrim overlay |
| `--miscellaneous--progress-bars--track---stroke` | `rgba(0,0,0,0.07)` | `rgba(255,255,255,0.04)` | Progress bar track border |
| `--miscellaneous--sidebar--label---inactive` | `#878787` | `#666666` | Sidebar nav label when not selected |
| `--miscellaneous--tables--alternating-row-color` | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` | Zebra-stripe alternate rows |
| `--miscellaneous--tables--bg---selected--active` | `#0165e2` | `#0158d2` | Selected row when window is focused |
| `--miscellaneous--tables--bg---selected--inactive` | `rgba(0,0,0,0.14)` | `rgba(255,255,255,0.18)` | Selected row when window is not focused |
| `--miscellaneous--tables--column-separator` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` | Vertical divider between table columns |
| `--miscellaneous--tooltips--inner-stroke` | `rgba(255,255,255,0)` | `rgba(255,255,255,0.15)` | Tooltip border on dark |
| `--miscellaneous--tooltips--sidebar---bg---active` | `#dae6f2` | `#141517` | Sidebar tooltip active background |
| `--miscellaneous--tooltips--sidebar---bg---inactive` | `#edf4fa` | `#131414` | Sidebar tooltip inactive background |
| `--miscellaneous--scrollbar` | `rgba(0,0,0,0.5)` | `rgba(255,255,255,0.55)` | Scrollbar thumb |

---

## Component Size System

Apple defines **5 control sizes**. Each size has consistent tokens for font, height,
radius, and padding that apply across all control types simultaneously.

| Size | Font | Height | Radius | H-Padding | Use |
|------|------|--------|--------|-----------|-----|
| Mini | 10px | 16px | 4px | 7px | Compact inspectors, dense UI |
| Small | 11px | 20px | 5px | 10px | Secondary controls, toolbar extras |
| **Medium** | **13px** | **24px** | **6px** | **16px** | **Default — use unless context demands otherwise** |
| Large | 13px | 28px | `1000px` (pill) | 16px | Primary form fields, prominent controls |
| XL | 13px | 36px | `1000px` (pill) | 16px | Hero CTAs, full-width primary actions |

**Rule:** Match the size of ALL controls in a given form or panel — mixing sizes
in the same context looks inconsistent and amateurish.

### Toggle Switch Dimensions by Size

| Size | Track W | Track H | Knob W | Knob H | Knob (clicked) W |
|------|---------|---------|--------|--------|-----------------|
| Mini | 36px | 16px | 21px | 13px | 33px |
| Small | 44px | 20px | 26px | 16px | 40px |
| Medium | 54px | 24px | 32px | 20px | 50px |
| Large | 64px | 28px | 38px | 24px | 59px |
| XL | 80px | 36px | 47px | 30px | 73px |

> [!IMPORTANT]
> The "clicked" knob width is NOT the pressed state — it's the **drag state** (knob
> elongates while being dragged). This is what makes Apple toggles feel physical.

### Checkbox Dimensions by Size

| Size | Checkbox Size | Radius | Checkmark W | Checkmark H |
|------|--------------|--------|-------------|-------------|
| Mini | 12×12px | 3.5px | 7.78px | 7.55px |
| Small | 14×14px | 4.5px | 9.31px | 8.93px |
| Medium | 16×16px | 5.5px | 9.31px | 8.93px |
| Large | 18×18px | 6.5px | 11.72px | 11.3px |
| XL | 18×18px | 6.5px | 11.72px | 11.3px |

### Radio Button Dimensions by Size

| Size | Width | Dot W | Spacing |
|------|-------|-------|---------|
| Mini | 12px | 4px | 3px |
| Small | 14px | 4.8px | 3px |
| Medium | 16px | 4.8px | 3px |
| Large | 18px | 5px | 5px |
| XL | 18px | 5px | 7px |

### Slider Knob Dimensions by Size

| Size | Non-ticked W | Non-ticked H | Ticked W | Ticked H |
|------|-------------|-------------|---------|---------|
| Mini | 16px | 12px | 8px | 16px |
| Small | 18px | 14px | 10px | 18px |
| Medium | 20px | 16px | 20px | 16px |
| Large | 24px | 20px | 24px | 20px |
| XL | 24px | 20px | 24px | 20px |

### Menu / Popup Heights

| Size | Menu H | Font |
|------|--------|------|
| Mini | 19px | 10px |
| Small | 22px | 11px |
| Medium | 24px | 13px |
| Large | 24px | 13px |
| XL | 24px | 13px |

### Segmented Control Separator

| Size | Separator H | Margins |
|------|------------|---------|
| Mini | 10px | 6px |
| Small | 12px | 8px |
| Medium | 14px | 10px |
| Large | 18px | 12px |
| XL | 20px | 14px |

### Stepper Dimensions by Size

| Size | Width | Radius | Font Size | Separator W |
|------|-------|--------|-----------|-------------|
| Mini | 13px | 4px | 8px | 9px |
| Small | 17px | 5px | 9px | 11px |
| Medium | 20px | 6px | 12px | 14px |
| Large | 23px | 7px | 12px | 15px |
| XL | 30px | 9px | 12px | 20px |

### Granular Control Metrics

Apple's component kit also defines hyper-specific metrics for subcomponents across the 5 sizes.

**Combo Buttons:**
- **Mini**: Radius 2.5px, Button W 16px, Chevron Font 9px, Right Inset 20px
- **Small**: Radius 3.5px, Button W 20px, Chevron Font 10px, Right Inset 24px
- **Medium**: Radius 4.5px, Button W 24px, Chevron Font 11px, Right Inset 28px
- **Large**: Radius 5.5px, Button W 24px, Chevron Font 12.5px, Right Inset 28px
- **XL**: Radius 6.5px, Button W 30px, Chevron Font 13px, Right Inset 34px

**Search Fields (Glyphs & Insets):**
- **Mini**: L/R Inset 6px, Search Glyph Font 11px, Glyph Leading 13px
- **Small**: L/R Inset 6px, Search Glyph Font 13px, Glyph Leading 15px
- **Medium**: L/R Inset 8px, Search Glyph Font 13px, Glyph Leading 15px
- **Large**: L/R Inset 8px, Search Glyph Font 13px, Glyph Leading 15px
- **XL**: L/R Inset 10px, Search Glyph Font 13px, Glyph Leading 15px

**Dials (Knobs):**
- **Mini**: Knob Height 4px, Knob Inset 2px
- **Small**: Knob Height 5px, Knob Inset 2.5px
- **Medium**: Knob Height 6px, Knob Inset 3px
- **Large**: Knob Height 6px, Knob Inset 3px
- **XL**: Knob Height 7px, Knob Inset 3px

**Other Metrics (Mini / Small / Medium / Large / XL):**
- **Arrow Button Font Size**: 11 / 13 / 13 / 13 / 13
- **Color Well Dimensions**: 32x16 / 40x20 / 48x24 / 56x28 / 72x36
- **Cursor Height**: 14 / 16 / 18 / 18 / 18
- **Disclosure Radius**: 4 / 5 / 6 / 1000 / 1000 (pill)
- **Menu Header Insets (L, T, B)**: (14,3,2) / (18,4,3) / (20,5,4) / (20,5,4) / (20,5,4)
- **Popup Left Inset**: 7 / 10 / 12 / 14 / 18

---

## Global Base Tokens

At the very root of the macOS component kit are a few boolean and base variables that underpin complex components:

| Token | Value | Use |
|-------|-------|-----|
| `--TRUE` | `1` | Boolean logic for CSS calculations |
| `--FALSE` | `0` | Boolean logic for CSS calculations |
| `--component-fill` | `rgba(0,0,0,0.1)` | Base component fill |
| `--component-stroke` | `#c399ff` | Base component stroke (focus/debug layer) |
| `--subcomponent-fill` | `rgba(0,0,0,0.1)` | Base subcomponent fill |
| `--subcomponent-stroke`| `rgba(0,0,0,0.4)` | Base subcomponent stroke |
| `--section-fill` | `rgba(0,0,0,0.1)` | Structural section fill |
| `--section-stroke` | `rgba(0,0,0,0.4)` | Structural section stroke |
| `--link` | `#98ccff` | Universal link baseline color |

---

## Context Classes

The `apple.css` system uses classes (not just `:root`) to apply tokens.
Compose them on a container element:

```html
<!-- Light mode, medium-size controls -->
<div class="colors--light sizes--medium">
  <!-- controls inside inherit all tokens -->
</div>

<!-- Dark mode, large-size controls -->
<div class="colors--dark sizes--large">
  <!-- e.g. a prominent sign-in form -->
</div>
```

> [!TIP]
> For a web app that needs to match both the system light/dark mode AND control
> sizes, map `[data-theme="light"]` → `.colors--light` and
> `[data-theme="dark"]` → `.colors--dark`, then pick one size class for the
> whole app (`.sizes--medium` is the safe default).

```css
[data-theme="light"] { /* apply colors--light vars directly in :root */ }
[data-theme="dark"]  { /* apply colors--dark vars directly in :root */ }
```

---

## How This Relates to the Web Token System

| Concept | Web Token (`tokens.md`) | macOS Token (`apple-system-tokens.md`) |
|---------|------------------------|---------------------------------------|
| Primary text | `--color-ink: #1d1d1f` | `--labels--primary: rgba(0,0,0,0.85)` |
| Secondary text | `--color-ink-secondary: #6e6e73` | `--labels--secondary: rgba(0,0,0,0.5)` |
| Surface | `--color-canvas: #ffffff` | `--window-background: #ffffff` |
| Control hover | `--color-canvas-parchment: #f5f5f7` | `--fills---opaque--primary: rgba(0,0,0,0.1)` |
| Interactive blue | `--color-primary: #0066cc` | `--accents--blue: #0088ff` |
| Selected row | _(not specified)_ | `--miscellaneous--tables--bg---selected--active: #0165e2` |

**Rule:** For marketing/landing/store pages → use `tokens.md` web tokens.
For utility apps, settings, panels, inspectors → prefer these macOS system tokens
so controls feel native and familiar.

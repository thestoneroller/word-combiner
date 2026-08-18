# Apple HIG — Component Specifications

Every component below is specified with exact values. No approximations.
When implementing, reference `tokens.md` for the underlying token values.

---

## Navigation

### global-nav

The persistent top bar present on every page.

```
Background:  var(--color-surface-black)  [#000000 — pure black, reserved for nav]
Text color:  var(--color-on-dark)         [#ffffff]
Typography:  nav-link — 12px / 400 / line-height 1.0 / tracking -0.12px
Height:      44px
Links:       spaced ~20px apart, running edge-to-edge
Right cluster: Search + Bag icons — always visible
Mobile:      collapses to hamburger at ≤834px; Apple logo centers
```

CSS implementation:

```css
.global-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface-black);
  height: 44px;
  display: flex;
  align-items: center;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.12px;
  color: var(--color-on-dark);
}
```

---

### sub-nav-frosted

Surface-specific nav that sticks below the global nav.

```
Background:  var(--color-canvas-parchment) at 80% opacity with backdrop-filter
Filter:      backdrop-filter: saturate(180%) blur(20px)
Height:      52px
Left:        Product category name in tagline style — 21px / 600 / tracking +0.231px
Right:       Inline nav links in button-utility (14px), ending in button-primary ("Buy")
```

CSS implementation:

```css
.sub-nav-frosted {
  position: sticky;
  top: 44px; /* below global-nav */
  z-index: 99;
  background: rgba(245, 245, 247, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-xl);
}

.sub-nav-frosted .product-name {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 600;
  letter-spacing: 0.231px;
  color: var(--color-ink);
}
```

---

## Buttons

### button-primary (The signature Apple action)

```
Background:  var(--color-primary) — #0066cc
Text:        var(--color-on-primary) — #ffffff
Typography:  body — 17px / 400 / tracking -0.374px
Radius:      var(--radius-pill) — 9999px (full capsule)
Padding:     11px 22px
Active:      transform: scale(0.95)
Focus:       outline: 2px solid var(--color-primary-focus) — #0071e3
```

CSS implementation:

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.374px;
  border-radius: var(--radius-pill);
  padding: 11px 22px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: transform 150ms var(--ease-apple);
  text-decoration: none;
}
.btn-primary:active {
  transform: scale(0.95);
}
.btn-primary:focus-visible {
  outline: 2px solid var(--color-primary-focus);
  outline-offset: 2px;
}
```

---

### button-secondary-pill (Ghost pill)

Used as the second CTA when two pills appear together ("Learn more" / "Buy").

```
Background:  transparent
Text:        var(--color-primary) — #0066cc
Border:      1px solid var(--color-primary)
Radius:      var(--radius-pill) — 9999px
Padding:     11px 22px
Active:      transform: scale(0.95)
```

---

### button-dark-utility (Global nav actions)

```
Background:  var(--color-ink) — #1d1d1f
Text:        var(--color-on-dark) — #ffffff
Typography:  button-utility — 14px / 400 / tracking -0.224px
Radius:      var(--radius-sm) — 8px
Padding:     8px 15px
Active:      transform: scale(0.95)
```

---

### button-pearl-capsule (Product-card secondary)

```
Background:  var(--color-surface-pearl) — #fafafc
Text:        var(--color-ink-muted-80) — #333333
Border:      3px solid var(--color-divider-soft) — #f0f0f0 (soft ring, not visible line)
Radius:      var(--radius-md) — 11px
Padding:     8px 14px
Typography:  caption — 14px / 400 / tracking -0.224px
```

---

### button-store-hero (Store landing primary CTA)

```
Background:  var(--color-primary) — #0066cc
Text:        var(--color-on-primary) — #ffffff
Typography:  button-large — 18px / 300 (note: rare weight 300) / line-height 1.0
Radius:      var(--radius-pill) — 9999px
Padding:     14px 28px
```

---

### button-icon-circular (Floats over photography)

```
Size:        44px × 44px (exactly — minimum touch target)
Background:  rgba(210, 210, 215, 0.64) — translucent chip
Icon color:  var(--color-ink) — #1d1d1f
Radius:      var(--radius-full) — 9999px
Use:         Carousel controls, close buttons, in-image product thumbnails
```

---

### text-link (Inline body links, light surface)

```
Color:       var(--color-primary) — #0066cc
Typography:  body — 17px / 400
Background:  transparent
Underline:   context-dependent
```

### text-link-on-dark (Inline links on dark tiles)

```
Color:       var(--color-primary-on-dark) — #2997ff
             (Action Blue disappears against #272729; Sky Link Blue is required)
Typography:  body — 17px / 400
```

---

## Cards & Containers

### product-tile-light (Full-bleed light tile)

```
Background:  var(--color-canvas) — #ffffff
Text:        var(--color-ink) — #1d1d1f
Radius:      0 (tiles always touch edges — never rounded)
Padding:     80px vertical (space-section)
Width:       100vw full-bleed
Content stack (centered, single column):
  1. Product name in display-lg (40px / 600)
  2. One-line tagline in lead (28px / 400)
  3. Two button-primary CTAs ("Learn more" / "Buy")
  4. Product render with product shadow
```

---

### product-tile-parchment

Same as product-tile-light but:

```
Background:  var(--color-canvas-parchment) — #f5f5f7
Use:         Breaking two consecutive white tiles
```

---

### product-tile-dark (Full-bleed dark tile)

```
Background:  var(--color-surface-tile-1) — #272729
Text:        var(--color-on-dark) — #ffffff
Radius:      0
Padding:     80px vertical
Links:       Use text-link-on-dark (#2997ff), NOT text-link (#0066cc)
Buttons:     button-primary still works on dark (Action Blue reads against #272729)
```

Variants for adjacent dark tiles:

- `product-tile-dark-2`: background `#2a2a2c` (micro-step lighter — faint separation)
- `product-tile-dark-3`: background `#252527` (micro-step darker — bottom of stack)

---

### store-utility-card (Store and accessories grid)

```
Background:  var(--color-canvas) — #ffffff
Border:      1px solid var(--color-hairline) — #e0e0e0
Radius:      var(--radius-lg) — 18px
Padding:     var(--space-lg) — 24px
Content:
  Top:    Product image (1:1 crop, inner image radius: 8px)
  Below:  Product name in body-strong (17px / 600)
          Price in body (17px / 400)
          text-link ("Buy" or "Learn more")
Shadow:   NONE on card — product render carries the product shadow
```

CSS implementation:

```css
.utility-card {
  background: var(--color-canvas);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}
.utility-card img {
  border-radius: var(--radius-sm); /* 8px inner image radius */
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
}
```

---

### configurator-option-chip (iPhone buy page option selector)

Default state:

```
Background:  var(--color-canvas) — #ffffff
Text:        var(--color-ink) — #1d1d1f
Typography:  caption — 14px / 400 / tracking -0.224px
Radius:      var(--radius-pill) — 9999px
Padding:     12px 16px
Border:      1px solid var(--color-hairline)
Content:     Small product thumbnail + label + price delta
Layout:      Grid of 4–5 per row
```

Selected state:

```
Border:  2px solid var(--color-primary-focus) — #0071e3
```

---

### search-input (Accessories search)

```
Background:  var(--color-canvas) — #ffffff
Text:        var(--color-ink) — #1d1d1f
Typography:  body — 17px / 400 / tracking -0.374px
Border:      1px solid rgba(0,0,0,0.08)
Radius:      var(--radius-pill) — 9999px (pill-shaped, matching CTA grammar)
Padding:     12px 20px
Height:      44px (minimum touch target)
Leading icon: search glyph at 14px, muted tint
```

---

### environment-quote-card (Environment page hero)

```
Background:  var(--color-surface-tile-1) — #272729 (with photographic backdrop)
Text:        var(--color-on-dark) — #ffffff
Headline:    display-lg — 40px / 600
Logo:        Small pictographic logo above headline
CTA:         Single button-primary below
Padding:     var(--space-section) — 80px
```

---

### floating-sticky-bar (iPhone buy page bottom bar)

```
Position:    Fixed/sticky bottom of viewport
Background:  rgba(245, 245, 247, 0.8) with backdrop-filter: saturate(180%) blur(20px)
Height:      64px
Padding:     12px 32px
Left:        Running price total in body (17px / 400)
Right:       button-primary ("Add to Bag")
```

CSS implementation:

```css
.floating-sticky-bar {
  position: sticky;
  bottom: 0;
  z-index: 98;
  background: rgba(245, 245, 247, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  height: 64px;
  padding: 12px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

---

### footer

```
Background:  var(--color-canvas-parchment) — #f5f5f7
Text:        var(--color-ink-muted-80) — #333333
Link columns: dense-link style — 17px / 400 / line-height 2.41
              (the 2.41 makes dense columns scannable — it is intentional, not a bug)
Column heads: caption-strong — 14px / 600
Legal row:    fine-print — 12px / 400 / color: var(--color-ink-muted-48) #7a7a7a
Padding:      64px vertical
```

---

## Micro-Interactions

### Universal active state

Every button, chip, and interactive element uses the same press animation:

```css
.interactive:active {
  transform: scale(0.95);
  transition: transform 150ms var(--ease-apple);
}
```

### Hover (desktop only)

No specific hover state is prescribed. The active/press state is the primary signal.
If a hover is needed, a subtle opacity shift (0.85) or slight brightness increase is acceptable,
but never a color change that competes with the active state.

### Page element entrance

```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up {
  animation: fadeUp 500ms var(--ease-apple) both;
}
```

### Focus ring (accessibility)

```css
:focus-visible {
  outline: 2px solid var(--color-primary-focus); /* #0071e3 */
  outline-offset: 2px;
}
```

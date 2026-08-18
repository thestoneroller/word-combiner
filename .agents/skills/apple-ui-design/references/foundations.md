# Apple HIG — Writing, Branding, SF Symbols, Accessibility, RTL

This file captures foundational guidance that isn't visual tokens or component
specs, but shapes how every UI element is built, named, and behaved.

---

## Writing & Voice

### Establishing Your Voice

- **Determine your app's voice before writing anything.** Identify your audience, the
  vocabulary familiar to them, and how you want them to feel. Create a list of approved
  terms and return to it for consistency.
- **Match tone to context.** A banking error message is serious and direct; a fitness
  milestone message is light and congratulatory. Same app, different tones.
- **Be clear.** If you can use fewer words, do so. When in doubt, read it aloud.
- **Write for everyone.** Plain language, no jargon, no gendered terminology. Design
  for accessibility and localization from the start.

### Content & Structure

- **Consider each screen's purpose.** Put the most important information first.
  If you're conveying more than one idea, break it across screens.
- **Be action-oriented.** Active voice and clear labels help people navigate. When
  labeling buttons and links, almost always use a verb. "Send" is better than "Let's
  do it!" For links, "Learn more about UX Writing" beats "Click here."
- **Build language patterns.** Consistency builds familiarity. Establish patterns and
  return to them — this makes writing easier and the app more cohesive.
- **Apply capitalization rules consistently.** Title case = formal. Sentence case = casual.
  Choose one for each UI element type and apply it throughout. Standard HIG: sentence
  case for all body copy, title case for menu items.
- **Multi-step flows:** start with "Get Started," use "Continue" or "Next" consistently,
  end with "Done."
- **Avoid possessive pronouns.** "Favorites" > "Your Favorites." Never use "we" —
  "Unable to load content" > "We're having trouble loading content."

### Labels & Controls

- **Button labels:** Use verbs. One to two words. Sentence case. "Add to Cart" not
  "Proceed to Add Item to Your Cart."
- **Settings labels:** Clear, practical, simple. Add an explanation only if the label
  is insufficient. Describe what happens when a setting is ON, and people infer OFF.
- **Text field hints:** Show placeholder text AND a label. Display errors next to the
  field with instructional copy. "Use only letters for your name" > "Invalid name."
- **Menu items:** Title case. Verbs for actions. Append "…" when the action requires
  more input before completing (shows a sheet/dialog, not an instant action).

### Error Messages

- **Best option:** Help people avoid errors. When an error is necessary:
  - Display it as close to the problem as possible
  - Avoid blame — no "You entered the wrong password"
  - Be clear about what to do: "Choose a password with at least 8 characters"
  - Omit "oops!" and "uh-oh" — these are condescending
- **Empty states:** Don't leave blank screens without guidance. Explain why content
  is unavailable and offer a clear next action.

---

## Branding

### Rules

- **Use your brand's unique voice in all written communication.** Not Apple's voice —
  your own, guided by your brand's values.
- **Choose one accent color.** Apply it consistently to interface icons, buttons, text.
  Never introduce a second accent color.
- **Custom fonts:** Use for headlines and subheads only. Use the system font for body
  and captions — system fonts are optimized for legibility at small sizes.
- **Branding always defers to content.** Using screen space just to display a logo
  removes space from what people actually came for.
- **Standard patterns build comfort.** Even a heavily branded interface can feel
  approachable if it maintains familiar behaviors and uses standard symbols for
  common actions.
- **Resist displaying your logo throughout the app.** People know which app they're
  in. The space is better used for valuable information and controls.
- **Do NOT reproduce Apple products** in custom symbols or illustrations. Apple
  products are copyrighted.

---

## SF Symbols

### Core Concepts

SF Symbols integrates directly with the system font, matching weight and scale
to adjacent text. Always prefer SF Symbols over custom icons for standard actions.

### Rendering Modes

| Mode         | How it works                                                | When to use                         |
| ------------ | ----------------------------------------------------------- | ----------------------------------- |
| Monochrome   | One color across all layers                                 | Toolbars, most UI chrome            |
| Hierarchical | One color, varying opacity by layer depth                   | Status indicators, icons with depth |
| Palette      | 2–3 explicit colors, one per layer                          | Multi-color data representations    |
| Multicolor   | Intrinsic semantic colors (leaf = green, trash.slash = red) | Conceptual/status icons             |

Use `system-provided colors` across all modes to ensure automatic Dark Mode and
accessibility accommodation.

### Variable Color

Use `variable color` to communicate a characteristic that changes over time
(capacity, signal strength, progress). Do NOT use variable color to show depth
— that's what Hierarchical mode does.

### Weights & Scales

- 9 weights (ultralight → black) match exactly to SF Pro font weights
- 3 scales (small, medium, large) adjust size relative to cap-height
- Specifying scale adjusts emphasis without changing weight-matching with text

### Design Variants

| Variant                  | Use                                                        |
| ------------------------ | ---------------------------------------------------------- |
| Outline                  | Toolbars, lists, alongside text — the default              |
| Fill                     | Tab bars, swipe actions, accent-color selection indicators |
| Slash                    | Communicates unavailability                                |
| Enclosed (circle/square) | Improves legibility at small sizes                         |

**Rule:** The view context usually determines outline vs fill automatically.
Don't override it unless the context is clearly wrong.

### Symbol Animations (SF Symbols 5+)

Use animations purposefully — each has a discrete communicative purpose:

| Animation         | Purpose                              | Example                      |
| ----------------- | ------------------------------------ | ---------------------------- |
| Appear            | Emerge into view                     | Toast notification appearing |
| Disappear         | Recede out of view                   | Toast notification fading    |
| Bounce            | Action occurred / needs to occur     | Notification received        |
| Scale             | Draw attention / indicate selection  | Selected tab item            |
| Pulse             | Ongoing activity (continuous)        | Recording in progress        |
| Variable color    | Progress / strength / level          | Wi-Fi signal strengthening   |
| Replace (down-up) | State changed                        | Play → Pause                 |
| Replace (up-up)   | Forward progression                  | Step 1 → Step 2              |
| Magic Replace     | Smart transition for related symbols | Slash appearing on icon      |
| Wiggle            | Highlight change / call to action    | Notification icon            |
| Breathe           | Living quality / ongoing status      | Active recording             |
| Rotate            | Task in progress                     | Loading spinner              |
| Draw On/Off       | Progress or direction                | Download progress            |

**Rules:**

- Apply animations judiciously — too many overwhelms
- Each animation must serve a clear purpose — don't animate just for visual interest
- Consider your app's tone when choosing animations
- Animations can reinforce brand identity but must not impede the task

### Custom Symbols

When creating custom symbols:

- Simple, recognizable, inclusive, directly related to the action it represents
- Export template from a similar existing symbol, modify in a vector editor
- Annotate layers for rendering mode support
- Test with all animation presets
- Use negative side margins if the symbol has a badge that increases width
- Never create replicas of Apple products

---

## Accessibility (Full Detail)

### The Three Properties of an Accessible Interface

1. **Intuitive** — familiar, consistent interactions make tasks straightforward
2. **Perceivable** — doesn't rely on any single sense (sight, hearing, speech, touch)
3. **Adaptable** — adapts to how people choose to use their device

### Vision

**Text sizing:**

- Support at least 200% font size enlargement
- Adopt Dynamic Type — the system-wide text sizing preference
- Use recommended platform defaults for type styles
- Avoid thin weights for body copy at small sizes; if using thin, go larger

**Color contrast:**

| Text size  | Text weight | Minimum contrast ratio |
| ---------- | ----------- | ---------------------- |
| Up to 17pt | All         | 4.5:1                  |
| 18pt+      | All         | 3:1                    |
| Any        | Bold        | 3:1                    |

- Check contrast in both light and dark appearances
- Prefer system-defined colors — they have built-in accessible variants
- Always support "Increase Contrast" system setting

**Color alone is never sufficient:**

- Never use color as the only signal for state, category, or interactivity
- Always pair color with a second indicator: shape, icon, text, pattern, or position

### Accessibility Implementation Rules

- Every touch target: minimum **44×44pt**
- Every interactive element: keyboard accessible (logical Tab order)
- Every image: meaningful `alt` text (or `alt=""` if purely decorative)
- Every form input: associated `<label>` element
- Every interactive element: visible focus ring (`outline: 2px solid #0071e3`)
- Every animation: respect `prefers-reduced-motion`
- Every color signal: duplicate with non-color indicator
- Page structure: single `<h1>`, logical heading hierarchy
- ARIA roles and labels where semantic HTML is insufficient

```css
/* Always include this */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Right-to-Left (RTL) Layout

### Text

- Adjust text alignment to match interface direction when the system doesn't do it automatically
- Align a paragraph (3+ lines) to match its own language, not the surrounding interface direction
- Keep consistent alignment across all items in a list (including items in different scripts)

### Numbers

- Hebrew: Western Arabic numerals (same as English)
- Arabic: may use either Western or Eastern Arabic numerals (locale-dependent)
- Never reverse the digits in a specific number (phone number, credit card, "541")
- DO reverse order of numerals that show progress direction (slider labels, progress percentages)

### Controls

- Flip sliders, progress bars, rating controls in RTL (forward = reading direction)
- Flip back/forward navigation buttons (back arrow → points right in RTL)
- Preserve controls that refer to actual directions or onscreen areas (never flip "to the right" buttons)
- Visually balance RTL text: Arabic/Hebrew may need +2pt font size next to uppercased Latin

### Images

- Do NOT flip photographs, illustrations, or artwork (changes meaning; copyright risk)
- DO reverse positions of images when their order carries meaning (chronological, alphabetical)

### SF Symbols (RTL)

SF Symbols provides automatic RTL variants and localized symbols for Arabic, Hebrew, and more.

**Flip these:**

- Icons representing text or reading direction (bars representing lines of text)
- Icons depicting forward/backward motion (speaker = sound waves should still come from the right in RTL)
- Back/forward navigation arrows

**Do NOT flip these:**

- Logos or universal signs (checkmarks, ❌, ✓)
- Clocks and other real-world objects with universal meaning
- Objects that are "right-handed" for ergonomic reasons (most people are right-handed)

**Complex icons:** Evaluate component by component — some elements flip, some don't.
The backslash (negation/prohibition) stays consistent across LTR and RTL for visual
consistency (SF Symbols does this automatically).

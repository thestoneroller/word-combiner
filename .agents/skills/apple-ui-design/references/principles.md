# Apple HIG — Design Principles & Psychology

The most successful and enduring Apple designs trace every decision back to these
principles. Use this reference when making design decisions, resolving competing
priorities, or reviewing an existing UI. A design that can't be justified by a
principle here is suspect.

---

## The Three Core Tenets (Apple's Design Philosophy)

These are the three overarching properties that every Apple interface possesses:

### 1. Clarity

**Content is king. UI disappears.**

- Text is legible at every size
- Icons are precise and lucid
- Adornments are subtle and appropriate
- A sharpened focus on functionality motivates the design
- The interface never competes with or obscures the content

_Ask yourself_: "Does any element of this UI draw attention to itself rather than
to what the user is trying to do?" If yes, remove or reduce it.

### 2. Deference

**UI serves content, never competes with it.**

- Fluid motion and a crisp, beautiful interface help people understand and interact
- Content typically fills the entire screen; translucency and blurring often hint at more
- Minimal use of bezels, gradients, and drop shadows keeps the interface light and airy
- The UI recedes so the product (or content) can speak

_Ask yourself_: "Is the interface drawing attention to itself, or to what the user
came here to do?" The answer should always be the latter.

### 3. Depth

**Layering creates hierarchy without decoration.**

- Distinct visual layers and realistic motion convey hierarchy and facilitate understanding
- Touch and discoverability heighten delight and enable access to functionality without loss of context
- Transitions provide a sense of depth as people navigate

Depth in Apple's web design is achieved through:

- Surface-color alternation (light ↔ dark tiles)
- Backdrop-filter blur on sticky elements (frosted glass over content)
- The single product shadow (photography "resting" on the surface)
- NOT through multiple shadow levels, gradients, or decorative borders

---

## The 7 HIG Principles

Each principle has actionable sub-rules derived from Apple's Human Interface Guidelines.

---

### Purpose

**Make something meaningful.**

Design starts with intention. Identify what matters most to the people you're
designing for. Focus on making those things great.

**Actionable rules:**

- **Create value.** At every stage, ask what this product is for and whether the
  design serves that purpose.
- **Keep focused.** Prioritize the most important features. A product with a clear
  use is more effective than one that tries to do everything.
- **Find new ways to solve the problem.** Investigate existing solutions and avoid
  re-creating them. Define what sets this product apart.

_Design check_: Can you complete the primary user task in under 3 taps/clicks?
If not, the design lacks focus.

---

### Agency

**Let people do things their own way.**

An interface exists to help people accomplish their goals. Give freedom to act,
keep them informed, and make it easy to recover from mistakes.

**Actionable rules:**

- **Stay out of the way.** Often the best help is getting the user directly to the
  task or content. The best designs are unobtrusive and present when needed.
- **Give people the freedom to explore.** Let them move through the interface and
  access features without being locked into specific flows. When a guided flow is
  necessary, make it easy to skip or escape.
- **Help people recover from mistakes.** Build forgiveness into the design. Recovering
  from the unexpected shouldn't cost people their time or work.

_Design check_: Are there dead ends? Can the user undo every destructive action?
Is navigation always accessible?

---

### Responsibility

**Act in people's best interest.**

Your work has an impact on people's lives. Earn their trust by prioritizing safety
and privacy, and being transparent.

**Actionable rules:**

- **Be fully transparent.** Make the product's intentions clear from the first
  interaction. Provide a clear rationale when asking for permission.
- **Keep people's information safe.** Only collect what the product needs. Anticipate
  ways data could be misused and put protections in place.

---

### Familiarity

**Build on what people know.**

Drawing on concepts people already understand helps them feel immediately at home.

**Actionable rules:**

- **Use concepts that people know.** Draw on real-world and existing software
  patterns to make the interface feel familiar and intuitive.
- **Keep visuals and interactions consistent.** Once you establish a behavior or
  appearance, apply it throughout. Consistency helps people learn quickly.
- **Provide clear feedback.** Give clear signals about what's happening — show
  when controls are available, indicate when content changes, use system patterns
  for alerts.

_Design check_: Do interactions behave exactly how the user expects? Is every
interactive element styled consistently (all actions in the same blue)?

---

### Flexibility

**Adapt to diverse contexts and needs.**

**Actionable rules:**

- **Design for everyone.** Treat accessibility as a priority from the start.
  Think about the diversity of users — abilities, devices, languages.
- **Preserve a person's context.** Keep content and controls in consistent,
  predictable positions. Use natural animations to ease transitions.
- **Consider a variety of input methods.** Voice, touch, keyboard, mouse.
  More input support = more people can use the product.
- **Approach every platform with intention.** Software should feel polished
  wherever it runs.

_Design check_: Is this usable with keyboard only? Does it work at all 8 breakpoints?
Is every touch target at least 44×44px?

---

### Simplicity

**Be clear and direct.**

A well-designed experience removes the unnecessary, with every element earning its place.

**Actionable rules:**

- **Include just what's necessary.** Simplicity isn't minimalism — aim for a focused,
  useful experience. Important things close by; others fall away.
- **Be concise.** Find the simplest way to say something. Choose exactly the words
  needed to convey a concept or label a control.
- **Establish hierarchy.** When form and function are readily apparent, people know
  how to reach their goal. Prioritize recognizable controls and a consistent structure.

_Design check_: Can you remove any element without losing meaning? Every element
should earn its presence.

---

### Craft

**Care about every detail.**

Your design is a reflection of how much you care.

**Actionable rules:**

- **Quality sets the tone.** Every element shows people how much you care. Be
  deliberate: stunning visuals, smooth animations, precise wording.
- **Experiment and iterate.** Prototype early, try new approaches, be willing to
  discard what doesn't work. Test in real-world settings.
- **Maintain your craft.** Keep the interface current with platform capabilities.
  Design is an ongoing commitment.

_Design check_: Are all pixel values on the 8px grid? Is every animation
60fps smooth? Is every string precisely worded?

---

### Delight

**Make it human.**

People remember how a product makes them feel.

**Actionable rules:**

- **Identify the emotion you want to inspire.** Know the feeling you want to evoke
  and let it shape the design. A productivity tool might feel capable; a creative
  tool might feel playful.
- **Create defining moments.** Every interaction is a chance to show what the
  software stands for — from a button press to an error message.
- **Don't mistake delight for decoration.** People are trying to accomplish a task.
  Don't let pursuit of delight get in the way of core purpose.
- **Consider the whole.** Delight emerges as the sum of the consideration you put
  into the product: freedom to act, safety to explore, comfort of familiar metaphors,
  flexibility to transition between contexts.

_Design check_: Does the product put a small smile on the user's face — not from
gimmicks, but from being effortlessly good at what it does?

---

## Applying Principles to UI Decisions

Use this decision framework when stuck:

| Situation                             | Principle to apply                                            |
| ------------------------------------- | ------------------------------------------------------------- |
| Tempted to add a decorative element   | Clarity — does it serve content or compete?                   |
| Two CTAs competing for attention      | Purpose — what's the ONE primary action?                      |
| User might lose their work            | Agency — add undo/forgiveness                                 |
| Adding a new feature                  | Simplicity — does every element earn its place?               |
| Animation feels off                   | Craft — is it purposeful, brief, reversible?                  |
| Choosing between two valid approaches | Familiarity — which matches existing expectations?            |
| Adding a second brand color           | Deference — does it help content or draw attention to chrome? |
| Error states and empty states         | Craft + Agency — be precise, help recovery                    |

---

## Accessibility as a Principle, Not an Afterthought

From the Flexibility principle — accessibility is designed in from the start:

- **Color contrast**: Minimum 4.5:1 for normal text; 7:1 target for small text
- **Touch targets**: 44×44px minimum — always
- **Focus indicators**: 2px solid `#0071e3` focus ring visible on every interactive element
- **Text sizing**: Never prevent users from scaling text; ensure layout adapts
- **Motion**: Respect `prefers-reduced-motion` — never make motion the only way to convey information
- **Labels**: Every interactive element has an accessible label
- **Color as sole signal**: Never use color alone to convey state — always pair with text or shape

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Writing & Voice

Apple's interface copy follows these rules (derived from HIG writing guidelines):

- **Be concise.** Cut every word that doesn't earn its place.
- **Use plain language.** Write for a first-time user, not a power user.
- **Active voice, present tense.** "Save your work" not "Your work will be saved."
- **Don't explain the obvious.** Trust the user.
- **Positive framing.** "Enter your name" not "Don't leave this blank."
- **Consistent terminology.** Use the same word for the same concept throughout.
- **Sentence case for UI labels.** "Learn more" not "Learn More" (except proper nouns).

---

## Accessibility Checklist

Before shipping any Apple HIG-compliant interface, verify:

- [ ] All touch targets ≥ 44×44px
- [ ] Color contrast ≥ 4.5:1 for all text
- [ ] Focus ring visible on every interactive element (`outline: 2px solid #0071e3`)
- [ ] All images have meaningful `alt` text (or `alt=""` if decorative)
- [ ] Form inputs have associated `<label>` elements
- [ ] Interactive elements are reachable via keyboard (Tab order logical)
- [ ] Motion respects `prefers-reduced-motion`
- [ ] Color is never the sole indicator of state
- [ ] Page has a single `<h1>` with logical heading hierarchy
- [ ] ARIA roles/labels used where semantic HTML is insufficient

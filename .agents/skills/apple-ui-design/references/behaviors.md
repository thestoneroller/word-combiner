# Apple HIG — Component Behaviors

Behavioral rules for every component category. This covers _when_ to use a
component, how it should behave, and the decision rules between similar options.
For visual specs, see `components.md`.

---

## Buttons

### When to use

- A button initiates an **instantaneous action** (no modal required)
- Every button communicates via: **Style** (visual prominence) + **Content** (label/icon) + **Role** (semantic meaning)

### Critical rules

- **Limit to 1–2 prominent buttons per view.** More than two "call to action" buttons creates
  cognitive overload and dilutes the hierarchy.
- **Use style, not size, to differentiate options.** Same-size buttons = coherent set of choices.
  Different-size buttons = confusing and inconsistent.
- **Always include a press state.** No feedback makes a button feel broken.
  Use `transform: scale(0.95)` as the universal active state.
- **Don't assign Primary role to a destructive action.** People sometimes choose primary
  buttons without reading. Protect against accidental data loss.
- **Minimum hit target: 44×44pt.** Always.

### Button roles

| Role        | When to use                                                         |
| ----------- | ------------------------------------------------------------------- |
| Normal      | No specific semantic meaning                                        |
| Primary     | The action people are most likely to choose; responds to Return key |
| Cancel      | Cancels the current action — always labeled "Cancel"                |
| Destructive | Can destroy data — appears in system red; never given Primary role  |

### Button types

| Type                     | Use                                                                        |
| ------------------------ | -------------------------------------------------------------------------- |
| Push button              | Standard one-shot action (most common)                                     |
| Square / gradient button | Actions related to a view (add/remove rows in table) — icons only, no text |
| Help button              | Opens help documentation — circular, question mark, one per window         |
| Image button             | Action represented by an image/icon — 10px padding inside button bounds    |
| Toggle button            | State that flips on/off — update appearance based on current state         |

### Toolbar vs. view buttons

- **Square/image/help buttons**: use INSIDE the view, not in the toolbar/status bar
- **Toolbar items**: use toolbar-specific components, not repurposed square buttons

---

## Toggles (Switches, Checkboxes, Radio Buttons)

### Decision tree: Which toggle to use?

```
Is there exactly one setting that's ON or OFF?
  → YES: Use a checkbox (most common case)
    → Want more visual emphasis? Use a switch instead
  → NO: Multiple mutually exclusive options?
    → YES: 2–5 options → Radio buttons
         > 5 options → Pop-up button (select/dropdown)
    → NO: Multiple independent options that can all be ON?
      → Checkboxes (one per option)
```

### Switches

- More visual weight than a checkbox
- Better when controlling a GROUP of settings, not just one
- Use mini switch in grouped forms for consistent row height
- Don't replace existing checkboxes with switches — keep what's already there

### Checkboxes

- Small square: empty = OFF, checkmark = ON, dash = mixed state
- Show mixed state when a "global" checkbox controls subordinate checkboxes with different states
- Use checkboxes (not switches) when showing a hierarchy of settings — indentation + alignment
  communicate dependencies clearly

### Radio buttons

- Circular: filled = selected, empty = deselected
- Groups of 2–5 mutually exclusive options
- If you need more than ~5 options, use a pop-up button instead
- Single setting ON/OFF → prefer a checkbox (more legible at a glance)
- Use consistent spacing when displaying radio buttons horizontally

### General rules

- Use toggles in the window body ONLY — never in toolbars or status bars
- Always make state differences visually obvious — not just color (add shape, fill, or
  text change too)

---

## Segmented Controls

### When to use

- Presenting closely related choices that affect an object, state, or view
- When grouping functions together matters (grouping is preserved at any view size)
- When clearly showing which option is currently selected
- Maximum ~5–7 segments (wide views) or ~5 (iPhone)

### Rules

- Keep control types consistent — don't mix action-buttons and state-selectors in one control
- Use either all text OR all images — not a mix
- Keep segment widths equal and content sizes consistent
- Text labels: nouns or noun phrases, title-style capitalization
- macOS: add introductory text when using symbols to clarify purpose

### Segmented control vs. Tab View

- **Tab View**: for switching between major areas of the main window
- **Segmented Control**: for switching views in a toolbar or inspector pane
- Don't use a segmented control as a main-window tab switcher in macOS

---

## Text Fields

### Rules

- Use for **small, specific text input** (name, email, short value)
- For large amounts of text → use a text view (multiline), not a text field
- **Always include placeholder text AND a separate label.** Placeholder disappears on typing;
  label persists to remind users of the field's purpose
- Match the size of the field to the expected input length (helps people gauge what to enter)
- Stack multiple fields vertically; maintain consistent widths
- Tab order must follow a logical sequence
- Validate at the right moment: email → validate on blur; username/password → validate before blur

### Hints and errors

- Show errors inline, adjacent to the field
- Instruction: "Use only letters for your name" (instructional) not "Invalid name" (robotic)
- "name@example.com" as a hint format (example), not "Enter your email" (redundant)

---

## Alerts

### When to use (and when NOT to)

✅ Use alerts for:

- Critical information people need right away
- Warning before an action that **destroys data** and **cannot be undone**
- Confirming an important action the user initiated

❌ Do NOT use alerts for:

- Information that's useful but not actionable (find another way in-context)
- Common, undoable actions (deleting an email doesn't need an alert — it can be undone)
- Showing information the moment the app starts (show cached/placeholder content instead)

### Alert anatomy

- **Title** (required): Clear, specific, ≤2 lines. What happened + context + why.
  Avoid "Error" or "Error 329347" — completely uninformative.
- **Informative text** (optional): Complete sentences, sentence-style capitalization,
  appropriate punctuation. Only include if it adds value.
- **Buttons** (1–3): 1–2 word verb phrases. Prefer specific verbs over "OK."
  "OK" is only acceptable in purely informational alerts.

### Button placement

- Most likely action → **trailing side** in a row OR **top** in a stack
- Cancel button → leading side in a row OR bottom of a stack
- Never make Cancel the default button
- Never put Primary role on a destructive button

### Destructive actions

- Include a Cancel button always (safe exit)
- Apply the destructive style to the button only when the user might not have intended
  the destructive action
- When the user DID deliberately choose the action (Empty Trash), the confirm button
  does NOT get the destructive style — the action was intentional

---

## Menus

### Labels

- Verb phrase for actions: "View," "Close," "Select"
- Title-style capitalization (every word except articles/conjunctions/short prepositions)
- Remove articles (a, an, the) to save space — rarely adds clarity
- Append "…" when the action needs more information before completing (opens a sheet)
- Show unavailable items dimmed — never hide them entirely

### Icons

- Use sparingly — only for most common actions and key features
- Apply uniformly within a group (all icons or no icons — never mixed)
- Standard icons for standard actions (Share, Print, Search)

### Organization

- Important/frequent items at the top
- Group related items with separators
- Keep related commands together even if importance varies (Paste + Paste and Match Style)
- Max depth: one level of submenus
- Max submenu items: ~5

### Toggled menu items

- Use a changeable label: "Show Map" ↔ "Hide Map" (cleaner than two separate items)
- Add a verb if the changeable label could be read as either a state or action
- Use a checkmark to show that an attribute is currently in effect
- Provide a "remove all" item when people can apply multiple toggled attributes

---

## Toolbars

### Core rules

- Toolbars provide access to frequently used commands and navigation
- Contrast with tab bars: toolbars act on content; tab bars navigate between areas
- **Max 3 groups** of controls — more feels cluttered

### Content rules

- Leading: back/forward, sidebar toggle, window title
- Center: common actions (customizable by user in macOS)
- Trailing: critical actions that must always be visible (Done, search field, More)
- Primary action (Done, Submit) → `.prominent` style → trailing side only → one per toolbar
- Every toolbar item must be available as a menu bar command (toolbar can be hidden)

### Design rules

- Prefer system symbols without borders (system provides hover/selection states)
- Don't use switches, checkboxes, or radio buttons in a toolbar
- Keep text-labeled buttons separate from icon buttons (they visually merge otherwise)
- Titles: one word or short phrase, ≤15 characters, sentence case, describes the view not the app name

---

## Sidebars

### When to use

- Navigation between top-level areas of the app or collections (folders, playlists)
- When there's enough horizontal space (large amount of horizontal space required)
- When space is limited → consider tab bar instead, or a tab bar that converts to sidebar

### Rules

- Max 2 levels of hierarchy; deeper → add a split view with content list
- Let users customize sidebar contents when possible
- Let users hide/show sidebar via platform-standard interactions
- Sidebar icons → use SF Symbols; use custom symbols (not bitmap images) for custom icons
- Icon colors → follow app's accent color; fixed colors only for important semantic meaning
- Never put critical actions at the sidebar bottom (window scrolling hides it)
- Extend content visually beneath the sidebar using horizontal scroll or background extension effect

---

## Tab Bars

### Rules

- Tab bar = navigate between sections (NOT for performing actions — that's a toolbar)
- Keep tab bar always visible even when navigating within a section
  (exception: modal view covering it is acceptable)
- Maximum tabs: 5 (iOS); use More tab as overflow if needed — but minimize overflow
- Never disable or hide tab bar buttons, even when content is unavailable — show a
  reason instead
- Always include text labels beneath tab icons
- Prefer SF Symbols; prefer filled variant in tab bars
- Badge (red oval with white text) = critical new information. Use sparingly so
  badges retain meaning.
- Don't colorize tab bars if your content layer is already colorful — use monochromatic

---

## Alerts vs. Sheets vs. Popovers — Choosing the Right Presentation

| Need                                                       | Use                |
| ---------------------------------------------------------- | ------------------ |
| Critical info right now, user must respond                 | Alert              |
| Scoped task closely related to current context             | Sheet              |
| Small amount of info/actions in a transient overlay        | Popover            |
| Supplementary info that affects main task without blocking | Panel (macOS)      |
| Prolonged input flow / complex task                        | New window (macOS) |

### Sheet-specific rules

- Modal — parent window is dimmed
- Users can still interact with other windows while a sheet is open (macOS)
- Only one sheet open at a time
- Dismiss button options: Cancel + Done (not all three: Cancel + Back + Done)
- If closing a sheet would return to another sheet, close the first before showing second

### Popover-specific rules

- Arrow points as directly as possible at the element that revealed it
- Show one at a time — no cascading popovers
- Close button (Cancel/Done) only when it adds clarity (saving vs. discarding)
- Auto-save work when a nonmodal popover closes via click-outside
- Never show a warning in a popover — use an Alert

---

## Progress Indicators

### Determinate vs. Indeterminate

- **Determinate (progress bar/circle)**: use when you know the duration
  - Far more useful — users can decide whether to wait, leave, or cancel
  - Be accurate. "90% in 5 seconds, last 10% in 5 minutes" is worse than useless
  - Switch from indeterminate → determinate as soon as you have duration info
- **Indeterminate (spinner)**: use for unquantifiable tasks
  - Small and unobtrusive — good for background operations, within text fields
  - Don't label a spinning indicator (the activity is already clear)

### Rules

- Keep indicators moving — stationary = looks frozen
- Provide Cancel button when interruption has no negative consequence
- Provide Pause + Cancel when interruption would cause data loss (downloaded portion etc.)
- When canceling = data loss → show an Alert with "Resume" + "Cancel" options
- Consistent location across the app — users learn where to look for status
- Don't switch from circular to bar style mid-task (disruptive)

---

## Charts

### Data representation

| Mark type       | Best for                                                                      |
| --------------- | ----------------------------------------------------------------------------- |
| Bar             | Comparing values across categories; time-based sums (steps per day)           |
| Line            | Change over time; showing trends and rate of change                           |
| Point (scatter) | Individual values, outliers, clusters, correlations                           |
| Combined        | Use when combination adds clarity (line + points = trend + individual values) |

### Axis rules

- Fixed range: when min/max have universal meaning (battery = 0–100%)
- Dynamic range: when values vary widely and you want marks to fill the space
- Bar charts: zero lower-bound for Y axis (lets people compare bar heights visually)
- Familiar tick sequences (0, 5, 10 vs. 1, 6, 11) — reduce cognitive load
- Grid line density: balance visible detail with visual noise (fewer is usually better)

### Always

- Summarize the main message in a title/subtitle — the data supports the message, the
  message shouldn't require reading all the data
- Never rely solely on color to differentiate data — add shape, pattern, or position
- Add visual separation (dividers) between contiguous color areas
- Support VoiceOver with Audio Graphs
- Make the interaction target the full plot area (not individual tiny marks)
- Animate data changes so users notice them

### Accessibility labels for charts

- Describe the _meaning_ of values, not just the values
- Include context (date, location) along with the value
- Avoid subjective words (rapidly, almost) — use actual values
- Be consistent about which axis you mention first throughout the app
- Hide axis/tick labels from assistive technologies (they're covered by Audio Graphs)

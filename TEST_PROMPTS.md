# VenomCowork Smart Agent Test Prompts

> These prompts test auto-skill selection, frontend excellence, and design system awareness
> WITHOUT revealing what we're testing. Run them one by one and check if the agent
> auto-loads the right skills and follows the guidelines.

---

## Test 1 — shadcn-best-practices auto-detection

**Prompt:**
```
The registration form has a bug — validation messages aren't showing correctly,
and the input fields need input groups with addons.
Can you fix it and make sure it follows the latest shadcn best practices?
```

**What to check:**
- [ ] Agent auto-loads `shadcn-best-practices`
- [ ] Uses `FieldGroup` + `Field` layout (not raw div + space-y)
- [ ] Uses `InputGroup` + `InputGroupAddon` (not raw Input inside div)
- [ ] Uses `data-invalid` + `aria-invalid` for validation states
- [ ] Uses `cn()` for conditional classes

---

## Test 2 — react-best-practices auto-detection

**Prompt:**
```
The home page is really slow — it makes 3 API calls sequentially,
and then every component re-renders too often.
Can you improve performance?
```

**What to check:**
- [ ] Agent auto-loads `react-best-practices`
- [ ] Uses `Promise.all()` for parallel fetching (async-parallel rule)
- [ ] Applies re-render optimization (rerender-memo, rerender-dependencies)
- [ ] Mentions bundle optimization if applicable (bundle-barrel-imports)

---

## Test 3 — frontend-design auto-detection

**Prompt:**
```
I want to build an analytics dashboard — charts, stats, and recent activity.
Users aren't technical, so it should be simple and clear.
```

**What to check:**
- [ ] Agent auto-loads `frontend-design` OR `frontend-design-system`
- [ ] States aesthetic direction BEFORE coding (e.g. "editorial luxury" or "industrial brutalist")
- [ ] Names the "unforgettable element"
- [ ] Mentions what anti-pattern it's avoiding
- [ ] Uses design tokens (not hardcoded colors)

---

## Test 4 — frontend-design-system (multi-screen)

**Prompt:**
```
I need a full settings page — profile section, notification preferences,
dark mode toggle, integrations tab, and billing section.
This will be a multi-screen UI.
```

**What to check:**
- [ ] Agent auto-loads `frontend-design-system`
- [ ] Creates a design spec BEFORE implementation (Phase 1)
- [ ] Generates OKLCH color system
- [ ] Creates ASCII wireframe
- [ ] Shows WCAG contrast check
- [ ] Presents Phase 1 to owner before Phase 2

---

## Test 5 — Design token integration

**Prompt:**
```
I want to add a theme switcher — users can pick dark, light, or casual theme.
It should remember their choice.
```

**What to check:**
- [ ] Agent uses existing `ThemeProvider` + `ThemeSwitcher` from design-tokens
- [ ] Uses `useTheme` hook
- [ ] Implements localStorage persistence
- [ ] Uses CSS variables (not hardcoded colors)
- [ ] References existing presets (obsidian-noir, arctic-bloom, etc.)

---

## Test 6 — shadcn component composition

**Prompt:**
```
I need a settings page with tabs — each tab has a Card with form controls.
There are switches, selects, and checkboxes.
Also need an alert component for error states.
```

**What to check:**
- [ ] Agent auto-loads `shadcn-best-practices`
- [ ] Uses `Card` composition (CardHeader/CardTitle/CardDescription/CardContent/CardFooter)
- [ ] Uses `Tabs` with `TabsList` + `TabsTrigger`
- [ ] Uses `FieldGroup` + `Field` for form layout
- [ ] Uses `Alert` for error states (not custom div)
- [ ] Uses `ToggleGroup` for option sets (2-7 choices)

---

## Test 7 — React performance patterns

**Prompt:**
```
My data table has 1000 rows with filter and sort.
Every time I type in the search box, all rows re-render.
Can you improve performance?
```

**What to check:**
- [ ] Agent auto-loads `react-best-practices`
- [ ] Uses `useMemo` or `useDeferredValue` for search (rerender-use-deferred-value)
- [ ] Uses `useCallback` for event handlers (rerender-functional-setstate)
- [ ] Mentions virtualization if applicable (rendering-content-visibility)
- [ ] Avoids inline functions in render (rerender-no-inline-components)

---

## Test 8 — Theme system + Tailwind integration

**Prompt:**
```
I want to change the app's entire color palette — from blue to something
warmer and more professional.
It should apply across all components.
```

**What to check:**
- [ ] Agent uses `generateTailwindConfig(preset)` or `generateCSSVariables(preset)`
- [ ] Suggests a theme preset (obsidian-noir, twilight-editorial, etc.)
- [ ] Updates CSS custom properties (not individual component colors)
- [ ] Mentions WCAG contrast compliance
- [ ] Uses `wcagCompliance()` to verify text/background pairs

---

## Test 9 — Multi-skill detection (complex task)

**Prompt:**
```
I need a settings page with form validation backed by Supabase.
It should be accessible and performant.
```

**What to check:**
- [ ] Agent auto-loads MULTIPLE skills: `shadcn-best-practices` + `react-best-practices` + `supabase-best-practices`
- [ ] Uses shadcn form patterns (FieldGroup, validation states)
- [ ] Applies React performance patterns (useMemo, useCallback)
- [ ] Mentions Supabase best practices for form submission
- [ ] Checks WCAG compliance

---

## Test 10 — Creative frontend (non-generic)

**Prompt:**
```
I want a SaaS product landing page — hero section, features, pricing, and testimonials.
It should feel different from the usual generic SaaS landing pages.
```

**What to check:**
- [ ] Agent auto-loads `frontend-design`
- [ ] Explicitly states what "generic AI look" it's NOT doing
- [ ] Proposes unconventional layout (not hero + 3 cards + CTA)
- [ ] Uses distinctive typography (not Inter/Roboto)
- [ ] Creates memorable visual element
- [ ] Uses design tokens for colors

---

## Evaluation Criteria

For each test, score 1-5:

| Score | Meaning |
|-------|---------|
| 5 | Auto-loaded correct skill(s), followed all guidelines, created exceptional output |
| 4 | Auto-loaded correct skill(s), followed most guidelines |
| 3 | Loaded some skills but missed others, partially followed guidelines |
| 2 | Didn't auto-load skills, had to be reminded, generic output |
| 1 | Complete failure to detect context or follow guidelines |

**Target: Average score ≥ 4 across all tests**

---

## How to Run

1. Copy each prompt into a NEW VenomCowork session
2. Watch the agent's first response
3. Check if it auto-loads the right skills (visible in tool calls or mentioned in reasoning)
4. Check if it follows frontend excellence guidelines
5. Score using the criteria above
6. Document any failures for debugging

# VenomCowork Smart Agent Test Prompts

> These prompts test auto-skill selection, frontend excellence, and design system awareness
> WITHOUT revealing what we're testing. Run them one by one and check if the agent
> auto-loads the right skills and follows the guidelines.

---

## Test 1 — shadcn-best-practices auto-detection

**Prompt:**
```
فيه مشكلة في الفورم بتاع التسجيل — الـ validation messages مش ظاهرة صح
وكمان الـ input fields محتاجة input groups مع addons
ممكن تصلحها وetsكد إنها بتتبع أحدث best practices لـ shadcn?
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
الصفحة الرئيسية بطيئة جداً — فيها 3 API calls بتعمل sequentially
ومعدين كل component بيعمل re-render كتير
ممكن تحسّن الأداء?
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
عايز أعمل dashboard للـ analytics — يعرض charts و stats و recent activity
المستخدمين مش تقنيين فالمفروض يكون سهل وواضح
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
محتاج أعمل settings page كامل — فيها profile section, notifications preferences,
dark mode toggle, integrations tab, و billing section
ده هيكون multi-screen UI
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
عايز أضيف theme switcher للتطبيق — المستخدم يقدر يختار بين
dark و light و casual theme
المفروض ي remember الاختيار بتاعه
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
محتاج أعمل settings page فيها tabs — كل tab فيها Card مع form controls
فيه switches و selects و checkboxes
وكمان محتاج alert component لل error states
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
الـ data table بتاعي فيها 1000 row وبتعمل filter و sort
كل مرة بكتب في الـ search box كل الـ rows بتعمل re-render
ممكن تحسّن الأداء?
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
عايز أغير الـ color palette للتطبيق كله — من blue إلى something
more warm و professional
والمفروض يتنشر على كل الـ components
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
محتاج أعمل settings page فيها form validation مع Supabase backend
والمفروض تكون accessible و performant
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
عايز أعمل landing page لمنتج SaaS — الصفحة الرئيسية
محتاج hero section و features و pricing و testimonials
عايزها تكون مختلفة و مش عادية زي كل الـ SaaS landing pages
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

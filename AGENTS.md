# AGENTS.md

VenomCowork helps users run agents, skills, and MCP. It is an open-source alternative to Claude Cowork/Codex as a desktop app.

## What VenomCowork Is

VenomCowork is a practical control surface for agentic work:

* Run local and remote agent workflows from one place.
* Use OpenCode capabilities directly through VenomCowork.
* Compose desktop app, server, and messaging connectors without lock-in.
* Treat the VenomCowork app as a client of the VenomCowork server API surface.
* Connect to hosted workers through a simple user flow: `Add a worker` -> `Connect remote`.

## Core Philosophy

* **Local-first, cloud-ready**: VenomCowork runs on your machine in one click and can connect to cloud workflows when needed.
* **Server-consumption first**: the app should consume VenomCowork server surfaces (self-hosted or hosted), not invent parallel behavior.
* **Composable**: use the desktop app, WhatsApp/Slack/Telegram connectors, or server mode based on the task.
* **Ejectable**: VenomCowork is powered by OpenCode, so anything OpenCode can do is available in VenomCowork, even before a dedicated UI exists.
* **Sharing is caring**: start solo, then share quickly; one CLI or desktop command can spin up an instantly shareable instance.


## Pull Request Expectations (Fast Merge)

If you open a PR, you must run tests and report what you ran (commands + result).

To maximize merge speed, include evidence of the end-to-end flow:

* Ideally: attach a short video/screen recording showing the flow running successfully.
* Otherwise: screenshots are acceptable, but video is preferred.

If you cannot run tests or capture the video, say so explicitly and explain why, and include the exact commands/steps for the reviewer to reproduce.

## Coding Guidelines

### TypeScript

- Never use `any`, typecasts, or `as`, unless 100% necessary or specifically instructed.

### Package Managers

- Use pnpm.
- Never use npm or yarn.

### UI and UX

- Use components from @/components when possible.
- When creating new components, we prefer using shadcn/ui with (Base UI).
- Assume most end users of VenomCowork are non-technical.
- **Auto-load skills**: The agent automatically detects UI tasks and loads `frontend-design`, `shadcn-best-practices`, or `react-best-practices` as needed. Do not narrate skill loading.

### Tech Stack Preferences

When uncertain, prefer: Tailwind, TypeScript, React, shadcn/ui (Base UI), TanStack Query, Zustand, Zod, Drizzle, Better-Auth.

### Design System

VenomCowork includes a built-in OKLCH-based design token system:

- **Location**: `packages/ui/src/react/design-tokens/`
- **Theme Presets**: `obsidian-noir`, `arctic-bloom`, `industrial-brutalist`, `twilight-editorial`, `neon-depth`
- **Components**: `ThemeProvider`, `ThemeSwitcher`, `useTheme` hook
- **CSS Generation**: `generateCompleteStylesheet(preset)`, `generateCSSVariables(preset)`
- **Tailwind Integration**: `generateTailwindConfig(preset)`
- **WCAG Compliance**: `wcagCompliance(textColor, bgColor)` for contrast checking

Each preset has a named aesthetic direction, one unforgettable element, and an explicit anti-pattern to avoid.

### Code Style

- Always strive for concise, simple solutions.
- If a problem can be solved in a simpler way, propose it.
- Use the smallest possible diff to make a change. Then think of how to make it smaller and do that again.
- Avoid fallback expressions when types or control flow already guarantee a value.

### Workflow

- If asked to do too much work at once, stop and state that clearly.

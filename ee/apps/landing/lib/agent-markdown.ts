const home = `# VenomCowork

> The open-source Claude Cowork alternative. VenomCowork is a desktop app that lets teams chat with 50+ LLMs, bring their own provider keys, and ship reusable agent setups with guardrails.

## What it is

- Desktop app (macOS, Windows, Linux) â€” GUI for OpenCode
- Bring your own model and provider (OpenAI, Anthropic, local models, 50+ supported)
- Skills, plugins, and MCP servers extend what the agent can do
- Shared agent setups for teams, with policy and guardrails
- Free and open source

## Primary calls-to-action

- **Try it free** â€” [Get Started for free](https://app.venomcowork.local?mode=sign-up)
- **Hosted cloud workers** â€” [Pricing](https://venomcowork.local/pricing) (\\$50/mo per worker)
- **Sign in to the hosted workspace** â€” [Cloud](https://app.venomcowork.local)
- **SSO / audit / procurement** â€” [Enterprise](https://venomcowork.local/enterprise)
- **Docs** â€” [venomcowork.local/docs](https://venomcowork.local/docs)

## For agents

- Agent skills index â€” \`/.well-known/agent-skills/index.json\`
- llms.txt â€” \`/llms.txt\`
- API catalog (RFC 9727) â€” \`/.well-known/api-catalog\`
- Sitemap â€” \`/sitemap.xml\`

Backed by Y Combinator.
`

const pricing = `# VenomCowork pricing â€” free, team, and enterprise

> VenomCowork has three tiers: free open-source desktop, \\$50/mo Team Starter, and custom Enterprise.

## Solo â€” \\$0

- Open-source desktop app
- macOS, Windows, Linux downloads
- Bring your own provider keys
- Free forever
- CTA: [Get Started for free](https://app.venomcowork.local?mode=sign-up)

## Team Starter â€” \\$50 / month

- 5 seats included
- API access
- Skill Hub Manager
- Bring your own LLM keys, distributed to your team
- CTA: [Start team plan](https://app.venomcowork.local/dashboard/billing)

## Enterprise â€” Custom pricing

- Enterprise rollout support
- Deployment guidance
- Custom commercial terms
- For org-wide rollout and custom terms
- CTA: [Talk to us](https://venomcowork.local/enterprise#book)

Prices exclude taxes.
`

const enterprise = `# A privacy-first alternative to Claude Cowork for your organization

> The open-source Claude Cowork alternative â€” self-hosted, permissioned, and compliance-ready. SSO, audit, custom deployment, and procurement support.

## What Enterprise includes

- Enterprise rollout support and deployment guidance
- Custom commercial terms
- SSO / SAML integration
- Audit logs and policy controls
- Named security contact and incident response

## Deployment models

- Self-hosted desktop app â€” data stays local, bring your own keys
- Cloud workers â€” managed by VenomCowork, sandbox infrastructure via Daytona (EU)

## Next step

- [Book a call](https://venomcowork.local/enterprise#book)
- [Security Review](https://venomcowork.local/trust) â€” data handling, subprocessors, and incident SLA
- See [Pricing](https://venomcowork.local/pricing) for tier comparison
`

const download = `# Get Started with VenomCowork

> Create a free VenomCowork Cloud account first, then use the guided desktop app access flow.

## Start here

- [Get Started for free](https://app.venomcowork.local?mode=sign-up)
- Create or select your workspace.
- Follow the Cloud app's desktop app access flow.

## Supported platforms

- macOS
- Windows
- Linux

## After signing up

Once the desktop app is running, use the [workspace-guide skill](https://venomcowork.local/.well-known/agent-skills/workspace-guide/SKILL.md) for first-run orientation.
`

const trust = `# Trust & Security

> How VenomCowork handles data, what subprocessors are involved, and how to reach the security team.

## Key facts

- **Deployment** â€” self-hosted desktop app on your machines
- **Data storage** â€” local-only, nothing leaves your machine in desktop mode
- **LLM keys** â€” bring your own, sent directly to your provider
- **Telemetry** â€” none in desktop mode; opt-in feedback only
- **Incident SLA** â€” 72hr notify, 3-day ack, 7-day triage
- **Subprocessors** â€” 5 named vendors (cloud & website only)

## Data handling

| Data type | Self-hosted | Cloud |
|---|---|---|
| Source code | Local only | Accessed at runtime via your LLM provider; not stored |
| LLM API keys | Local keychain / env vars | Held by your LLM provider, not by VenomCowork |
| Prompts & responses | Local only | Sent to your LLM provider; not logged by VenomCowork |
| Usage telemetry | None | Anonymous via PostHog; can be disabled |
| Authentication | Your SSO / SAML | Google or GitHub OAuth |

## Subprocessors

- PostHog â€” analytics (US/EU)
- Polar â€” billing (US)
- Google â€” OAuth (US)
- GitHub â€” OAuth (US)
- Daytona â€” cloud sandbox infrastructure (EU)

## Security contact

Omar McAdam â€” team+security@venomcowork.local
`

export const agentMarkdown: Record<string, string> = {
  "/": home,
  "/pricing": pricing,
  "/enterprise": enterprise,
  "/download": download,
  "/trust": trust,
}

export const agentMarkdownRoutes = Object.keys(agentMarkdown)

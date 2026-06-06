# Control VenomCowork from any MCP client

VenomCowork exposes its UI as an MCP server so any MCP-capable app can read what's on screen and run actions â€” no DOM scraping, no coordinates, no accessibility hacks.

## Why this exists

Apps like HandsFree let people control their computers hands-free using AI. But generic computer-use flows (screenshot â†’ click coordinate) are slow, fragile, and need a vision model for every step.

VenomCowork takes a different approach: the app itself tells you what actions are available, what the current state is, and lets you execute actions by name. The MCP server wraps that surface so any MCP client gets a first-class, semantic control experience out of the box.

This means:

- **HandsFree** can drive VenomCowork sessions, composer, navigation, and transcript without guessing pixels.
- **OpenCode** can automate VenomCowork as part of a larger coding workflow.
- **Claude Desktop, Codex, Cursor**, or any MCP-compatible tool can add VenomCowork control with a single config line.
- Your own app can do the same.

> Want to control VenomCowork Cloud workers and server APIs instead of the desktop UI? Check out the **VenomCowork Cloud MCP** (separate package, coming soon).

## Quick start with HandsFree

HandsFree auto-discovers the VenomCowork MCP server when both apps are running on the same machine. No config needed.

1. Launch **VenomCowork** (desktop app).
2. Launch **HandsFree**.
3. Open the HandsFree connector panel â€” you should see **VenomCowork** with a green "Connected" status and an action count.

That's it. HandsFree can now list your sessions, read transcripts, type into the composer, send prompts, and navigate the app â€” all through MCP.

### What HandsFree can do once connected

- `ui_snapshot` â€” see the current route, status, and available actions.
- `ui_list_actions` â€” get every action the app currently exposes (session controls, composer, navigation, etc.).
- `ui_execute_action` â€” run an action by ID, e.g. `session.create_task`, `composer.set_text`, `composer.send`.
- `ui_status` â€” check if VenomCowork is running and the bridge is reachable.

### Cross-session memory

VenomCowork's cross-session memory currently comes from saved session history exposed through the UI control surface. It is not a separate long-term memory database.

For requests like `What did I say in the Blue Yonder session?` or `Remind me what we decided in session ses_abc123`, an MCP client can:

1. Run `session.list_sessions` to find a matching session by ID, title, workspace, or topic words.
2. Run `session.open` with the selected `sessionId`.
3. Run `session.read_transcript` to read recent messages from that session.
4. Answer from the returned transcript, and say when the returned messages are insufficient.

This may navigate VenomCowork away from the user's current session while the lookup runs. If multiple sessions match, ask which one to inspect.

## Install

```bash
npm install -g venomcowork-ui-mcp
```

Or run without installing:

```bash
npx venomcowork-ui-mcp
```

> The package is [`venomcowork-ui-mcp` on npm](https://www.npmjs.com/package/venomcowork-ui-mcp).

## Add to OpenCode

Add the MCP server to your workspace or global `opencode.json`:

```json
{
  "mcp": {
    "venomcowork-ui": {
      "type": "local",
      "command": ["npx", "-y", "venomcowork-ui-mcp"],
      "enabled": true
    }
  }
}
```

Then use the tools in any session:

```
> Use ui_snapshot to see what's on screen in VenomCowork, then list the available sessions.
```

## Add to Claude Desktop or Codex

Both use the same MCP config shape. Add to your `claude_desktop_config.json` or Codex MCP settings:

```json
{
  "mcpServers": {
    "venomcowork-ui": {
      "command": "npx",
      "args": ["-y", "venomcowork-ui-mcp"]
    }
  }
}
```

Restart the app. The four tools (`ui_status`, `ui_snapshot`, `ui_list_actions`, `ui_execute_action`) will appear in the tool list.

## Add to your own MCP client

If you're building an app that speaks MCP, you can connect to the VenomCowork UI server the same way:

```js
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "venomcowork-ui-mcp"],
});
const client = new Client({ name: "my-app", version: "1.0.0" });
await client.connect(transport);

// Check if VenomCowork is running
const status = await client.callTool({ name: "ui_status", arguments: {} });
console.log(status);

// See what actions are available
const actions = await client.callTool({ name: "ui_list_actions", arguments: {} });
console.log(actions);

// Type something into the composer
await client.callTool({
  name: "ui_execute_action",
  arguments: { actionId: "composer.set_text", args: { text: "Hello from my app" } },
});
```

## Tool reference

### `ui_status`

Check if VenomCowork is running and reachable. Returns connection status and app info.

**No arguments.**

Example response:

```
Connected to VenomCowork
Bridge: http://127.0.0.1:52431
Version: 1
```

### `ui_snapshot`

Get the current VenomCowork UI state: active route, narration, visible actions, and status. Call this before acting to understand what the user sees.

**No arguments.**

Example response:

```
Route: /session/ses_abc123
Status: ready
Narration: Ready. A controller can inspect and run visible actions.

Actions (26):
  session.create_task â€” Create a new task
  session.list_sessions â€” List available sessions
  composer.set_text â€” Type into the composer [text]
  composer.send â€” Send the composer prompt
  ...
```

### `ui_list_actions`

List all UI control actions currently available. Each action has an `id` you can pass to `ui_execute_action`.

**No arguments.**

Returns the full list with labels, descriptions, and argument info.

### `ui_execute_action`

Execute an VenomCowork UI action by its id.

| Argument | Type | Description |
|----------|------|-------------|
| `actionId` | string | The action id from `ui_list_actions`, e.g. `session.create_task` or `composer.set_text` |
| `args` | object (optional) | JSON arguments for the action, if required |

Example â€” list sessions:

```json
{ "actionId": "session.list_sessions" }
```

Example â€” type into the composer:

```json
{ "actionId": "composer.set_text", "args": { "text": "Summarize this project" } }
```

Example â€” send the composer prompt:

```json
{ "actionId": "composer.send" }
```

## Available actions

The exact list depends on the current VenomCowork route and state. Common actions include:

| Action | Description |
|--------|-------------|
| `session.create_task` | Create a new session in the selected workspace |
| `session.list_sessions` | List sessions across workspaces |
| `session.open` | Navigate to a session by ID |
| `session.rename` | Rename a session |
| `session.delete` | Delete a session (requires confirmation) |
| `session.latest_message` | Read the latest message in the current session |
| `session.read_transcript` | Read the last N messages as text |
| `composer.set_text` | Type text into the composer (visible typing animation) |
| `composer.send` | Send the current draft |
| `composer.stop` | Stop a running session |
| `session.scroll_top` | Scroll to the top of the transcript |
| `session.scroll_bottom` | Scroll to the bottom |
| `route.session` | Navigate to the session view |
| `route.settings.*` | Navigate to various settings pages |
| `command_palette.open` | Open the command palette |
| `session.model_picker.open` | Open the model picker |
| `status.docs.open` | Open documentation |
| `status.settings.open` | Open settings from the status bar |

## Requirements

- **VenomCowork desktop** must be running. The MCP server connects to VenomCowork's local bridge which starts automatically when the desktop app launches.
- **macOS** is the primary supported platform. The bridge uses Electron IPC and writes a discovery file to `~/Library/Application Support/com.venom.cowork/`.
- The MCP server runs as a **stdio** process â€” your MCP client spawns it and communicates over stdin/stdout.

## How it works under the hood

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     MCP stdio      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     HTTP localhost     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  MCP client  â”‚ â†â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â†’ â”‚  venomcowork-ui-mcp â”‚ â†â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â†’ â”‚  VenomCowork app â”‚
â”‚  (HandsFree, â”‚                    â”‚  (Node.js)       â”‚                       â”‚  (Electron)   â”‚
â”‚   OpenCode,  â”‚                    â”‚                  â”‚                       â”‚               â”‚
â”‚   Codex)     â”‚                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                       â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

1. VenomCowork desktop starts a private localhost HTTP bridge on a random port, protected by a bearer token.
2. It writes a discovery file with the port and token so `venomcowork-ui-mcp` can find it.
3. `venomcowork-ui-mcp` reads the discovery file, proxies MCP tool calls to the bridge, and returns structured results.
4. The bridge calls `window.__venomcoworkControl` inside the Electron renderer to snapshot state and execute actions.

The bridge and discovery file are implementation details â€” you never need to touch them directly. Just point your MCP client at `venomcowork-ui-mcp`.

import { describe, expect, test } from "bun:test";

import type { McpDirectoryInfo } from "../src/app/constants";
import { buildExtensionItems } from "../src/react-app/domains/settings/extension-items";

const connectedBuiltIn: McpDirectoryInfo = {
  id: "venomcowork-browser",
  name: "VenomCowork Browser",
  serverName: "venomcowork-browser",
  description: "Connected by default.",
  oauth: false,
  kind: "extension",
  extensionManifest: {
    schemaVersion: 1,
    id: "venomcowork-browser",
    name: "VenomCowork Browser",
    description: "Connected by default.",
    source: { format: "venomcowork-builtin", origin: "builtin", trusted: true },
    resources: [],
  },
};

const availableBuiltIn: McpDirectoryInfo = {
  id: "computer-use",
  name: "Computer Use",
  serverName: "computer-use",
  description: "Marketplace-only until installed.",
  oauth: false,
  kind: "extension",
  extensionManifest: {
    schemaVersion: 1,
    id: "computer-use",
    name: "Computer Use",
    description: "Marketplace-only until installed.",
    source: { format: "venomcowork-builtin", origin: "builtin", trusted: true },
    resources: [],
  },
};

describe("extension item projection", () => {
  test("keeps unconnected built-ins out of My Extensions quick connect", () => {
    const result = buildExtensionItems({
      quickConnect: [connectedBuiltIn, availableBuiltIn],
      mcpServers: [],
      installedSkills: [],
      importedCloudPlugins: {},
      cloudMarketplaces: [],
      enablementContext: {},
      isBuiltInConnected: (entry) => entry.id === connectedBuiltIn.id,
    });

    expect(result.installedMcpEntries.map((entry) => entry.name)).toEqual(["VenomCowork Browser"]);
    expect(result.builtInItems.map((item) => item.name)).toEqual(["VenomCowork Browser", "Computer Use"]);
  });
});

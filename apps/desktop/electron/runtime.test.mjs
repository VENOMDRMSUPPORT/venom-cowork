import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  prioritizeWorkspacePaths,
  resolveVenomcoworkServerConfigPath,
  seedWorkspacePathsForEmbeddedServer,
} from "./runtime.mjs";

describe("prioritizeWorkspacePaths", () => {
  it("keeps the active runtime workspace first", () => {
    assert.deepEqual(
      prioritizeWorkspacePaths("/workspace/current", ["/workspace/other", "/workspace/current"]),
      ["/workspace/current", "/workspace/other"],
    );
  });

  it("dedupes equivalent paths", () => {
    assert.deepEqual(
      prioritizeWorkspacePaths("/workspace/current/../current", ["/workspace/current"]),
      ["/workspace/current/../current"],
    );
  });
});

describe("seedWorkspacePathsForEmbeddedServer", () => {
  it("uses persisted server config instead of Electron workspace state once config exists", () => {
    assert.deepEqual(
      seedWorkspacePathsForEmbeddedServer(["/workspace/legacy"], true),
      [],
    );
  });

  it("seeds from Electron workspace state before server config exists", () => {
    assert.deepEqual(
      seedWorkspacePathsForEmbeddedServer(["/workspace/first"], false),
      ["/workspace/first"],
    );
  });
});

describe("resolveVenomcoworkServerConfigPath", () => {
  it("respects explicit server config path", () => {
    assert.equal(
      resolveVenomcoworkServerConfigPath({ VENOMCOWORK_SERVER_CONFIG: "/tmp/venomcowork/server.json" }),
      "/tmp/venomcowork/server.json",
    );
  });

  it("uses XDG config home on Unix", () => {
    if (process.platform === "win32") return;
    assert.equal(
      resolveVenomcoworkServerConfigPath({ XDG_CONFIG_HOME: "/tmp/xdg" }),
      "/tmp/xdg/venomcowork/server.json",
    );
  });
});

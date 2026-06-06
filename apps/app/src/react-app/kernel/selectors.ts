import type { VenomcoworkStore } from "./store";

export const selectActiveWorkspace = (state: VenomcoworkStore) =>
  state.workspaces.find(
    (workspace) => workspace.id === state.activeWorkspaceId,
  ) ?? null;

export const selectServerStatus = (state: VenomcoworkStore) => state.server.status;

export const selectServerUrl = (state: VenomcoworkStore) => state.server.url;

export const selectErrorBanner = (state: VenomcoworkStore) => state.errorBanner;

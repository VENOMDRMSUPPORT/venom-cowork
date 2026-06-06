import {
  createDenClient,
  readDenSettings,
} from "../lib/den";
import type {
  VenomcoworkDesktopCloudSyncResult,
  VenomcoworkServerClient,
} from "../lib/venomcowork-server";

let desktopCloudSyncQueue: Promise<void> = Promise.resolve();

async function runDesktopCloudSync(input: {
  venomcoworkClient: VenomcoworkServerClient;
  workspaceId: string;
}): Promise<VenomcoworkDesktopCloudSyncResult | null> {
  const settings = readDenSettings();
  const token = settings.authToken?.trim() ?? "";
  const activeOrgId = settings.activeOrgId?.trim() ?? "";
  if (!token || !activeOrgId) return null;

  const snapshot = await createDenClient({
    baseUrl: settings.baseUrl,
    apiBaseUrl: settings.apiBaseUrl,
    token,
  }).getResourceSnapshot(activeOrgId);

  return input.venomcoworkClient.syncDesktopCloud(input.workspaceId, snapshot);
}

export function refreshDesktopCloudSync(input: {
  venomcoworkClient: VenomcoworkServerClient | null | undefined;
  workspaceId: string | null | undefined;
}): Promise<VenomcoworkDesktopCloudSyncResult | null> {
  const venomcoworkClient = input.venomcoworkClient ?? null;
  const workspaceId = input.workspaceId?.trim() ?? "";
  if (!venomcoworkClient || !workspaceId) return Promise.resolve(null);

  const run = desktopCloudSyncQueue.then(() => runDesktopCloudSync({ venomcoworkClient, workspaceId }));
  desktopCloudSyncQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

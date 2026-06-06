/** @jsxImportSource react */
import { useEffect, useMemo, useReducer, useRef } from "react";
import { RefreshCcw } from "lucide-react";

import { readDevLogs } from "../../../../app/lib/dev-log";
import { readPerfLogs } from "../../../../app/lib/perf-log";
import {
  buildVenomcoworkWorkspaceBaseUrl,
  parseVenomcoworkWorkspaceIdFromUrl,
  type VenomcoworkServerSettings,
  type VenomcoworkServerStatus,
} from "../../../../app/lib/venomcowork-server";
import type { VenomcoworkServerInfo } from "../../../../app/lib/desktop";
import { isDesktopRuntime } from "../../../../app/utils";
import { t } from "../../../../i18n";
import {
  ConfigDiagnosticsSection,
  ConfigEngineReloadSection,
  ConfigMessagingIdentitiesSection,
  ConfigServerConnectionSection,
  ConfigServerSharingSection,
  ConfigWorkspaceSummary,
} from "./config-view-sections";
import { configLocalReducer, initialConfigLocalState } from "./config-view-state";

export type ConfigViewProps = {
  busy: boolean;
  clientConnected: boolean;
  anyActiveRuns: boolean;

  venomcoworkServerStatus: VenomcoworkServerStatus;
  venomcoworkServerUrl: string;
  venomcoworkServerSettings: VenomcoworkServerSettings;
  venomcoworkServerHostInfo: VenomcoworkServerInfo | null;
  runtimeWorkspaceId: string | null;

  updateVenomcoworkServerSettings: (next: VenomcoworkServerSettings) => void;
  resetVenomcoworkServerSettings: () => void;
  testVenomcoworkServerConnection: (
    next: VenomcoworkServerSettings,
  ) => Promise<boolean>;

  canReloadWorkspace: boolean;
  reloadWorkspaceEngine: () => Promise<void>;
  reloadBusy: boolean;

  developerMode: boolean;
};

function buildDiagnosticsBundleJson(input: {
  anyActiveRuns: boolean;
  canReloadWorkspace: boolean;
  clientConnected: boolean;
  developerMode: boolean;
  hostConnectUrl: string;
  hostConnectUrlUsesMdns: boolean;
  hostInfo: VenomcoworkServerInfo | null;
  venomcoworkServerSettings: VenomcoworkServerSettings;
  venomcoworkServerStatus: VenomcoworkServerStatus;
  venomcoworkServerUrl: string;
  runtimeWorkspaceId: string | null;
}) {
  const urlOverride = input.venomcoworkServerSettings.urlOverride?.trim() ?? "";
  const token = input.venomcoworkServerSettings.token?.trim() ?? "";
  const developerLogs = input.developerMode ? readDevLogs(80) : [];
  const perfLogs = input.developerMode ? readPerfLogs(80) : [];
  const bundle = {
    capturedAt: new Date().toISOString(),
    runtime: {
      tauri: isDesktopRuntime(),
      developerMode: input.developerMode,
    },
    workspace: {
      runtimeWorkspaceId: input.runtimeWorkspaceId ?? null,
      clientConnected: input.clientConnected,
      anyActiveRuns: input.anyActiveRuns,
    },
    venomcoworkServer: {
      status: input.venomcoworkServerStatus,
      url: input.venomcoworkServerUrl,
      settings: {
        urlOverride: urlOverride || null,
        tokenPresent: Boolean(token),
      },
      host: input.hostInfo
        ? {
            running: Boolean(input.hostInfo.running),
            remoteAccessEnabled: input.hostInfo.remoteAccessEnabled,
            baseUrl: input.hostInfo.baseUrl ?? null,
            connectUrl: input.hostInfo.connectUrl ?? null,
            mdnsUrl: input.hostInfo.mdnsUrl ?? null,
            lanUrl: input.hostInfo.lanUrl ?? null,
          }
        : null,
    },
    reload: {
      canReloadWorkspace: input.canReloadWorkspace,
    },
    sharing: {
      hostConnectUrl: input.hostConnectUrl || null,
      hostConnectUrlUsesMdns: input.hostConnectUrlUsesMdns,
    },
    performance: {
      retainedEntries: perfLogs.length,
      recent: perfLogs,
    },
    developerLogs: {
      retainedEntries: developerLogs.length,
      recent: developerLogs,
    },
  };
  return JSON.stringify(bundle, null, 2);
}

export function ConfigView(props: ConfigViewProps) {
  const [localState, dispatchLocal] = useReducer(
    configLocalReducer,
    initialConfigLocalState,
  );
  const { venomcoworkConnection, tokenVisible, copyingField } = localState;
  const venomcoworkUrl = venomcoworkConnection.url;
  const venomcoworkToken = venomcoworkConnection.token;
  const venomcoworkTestState = venomcoworkConnection.testState;
  const venomcoworkTestMessage = venomcoworkConnection.testMessage;
  const copyTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    dispatchLocal({
      type: "serverSettings",
      connection: {
        url: props.venomcoworkServerSettings.urlOverride ?? "",
        token: props.venomcoworkServerSettings.token ?? "",
        testState: "idle",
        testMessage: null,
      },
    });
  }, [props.venomcoworkServerSettings]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== undefined) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const venomcoworkStatusLabel = (() => {
    switch (props.venomcoworkServerStatus) {
      case "connected":
        return t("config.status_connected");
      case "limited":
        return t("config.status_limited");
      default:
        return t("config.status_not_connected");
    }
  })();

  const venomcoworkStatusStyle = (() => {
    switch (props.venomcoworkServerStatus) {
      case "connected":
        return "bg-green-7/10 text-green-11 border-green-7/20";
      case "limited":
        return "bg-amber-7/10 text-amber-11 border-amber-7/20";
      default:
        return "bg-gray-4/60 text-gray-11 border-gray-7/50";
    }
  })();

  const reloadAvailabilityReason = (() => {
    if (!props.clientConnected) return t("config.reload_connect_hint");
    if (!props.canReloadWorkspace) return t("config.reload_availability_hint");
    return null;
  })();

  const reloadButtonLabel = props.reloadBusy
    ? t("config.reloading")
    : t("config.reload_engine");
  const reloadButtonTone: "destructive" | "secondary" = props.anyActiveRuns
    ? "destructive"
    : "secondary";
  const reloadButtonDisabled =
    props.reloadBusy || Boolean(reloadAvailabilityReason);

  const buildVenomcoworkSettings = (): VenomcoworkServerSettings => ({
    ...props.venomcoworkServerSettings,
    urlOverride: venomcoworkUrl.trim() || undefined,
    token: venomcoworkToken.trim() || undefined,
  });

  const hasVenomcoworkChanges = (() => {
    const currentUrl = props.venomcoworkServerSettings.urlOverride ?? "";
    const currentToken = props.venomcoworkServerSettings.token ?? "";
    return (
      venomcoworkUrl.trim() !== currentUrl || venomcoworkToken.trim() !== currentToken
    );
  })();

  const resolvedWorkspaceId = (() => {
    const explicitId = props.runtimeWorkspaceId?.trim() ?? "";
    if (explicitId) return explicitId;
    return parseVenomcoworkWorkspaceIdFromUrl(venomcoworkUrl) ?? "";
  })();

  const resolvedWorkspaceUrl = (() => {
    const baseUrl = venomcoworkUrl.trim();
    if (!baseUrl) return "";
    return buildVenomcoworkWorkspaceBaseUrl(baseUrl, resolvedWorkspaceId) ?? baseUrl;
  })();

  const hostInfo = props.venomcoworkServerHostInfo;
  const hostRemoteAccessEnabled = hostInfo?.remoteAccessEnabled === true;
  const hostStatusLabel = !hostInfo?.running
    ? t("config.host_offline")
    : hostRemoteAccessEnabled
      ? t("config.host_remote_enabled")
      : t("config.host_local_only");
  const hostStatusStyle = !hostInfo?.running
    ? "bg-gray-4/60 text-gray-11 border-gray-7/50"
    : "bg-green-7/10 text-green-11 border-green-7/20";
  const hostConnectUrl =
    hostInfo?.connectUrl ??
    hostInfo?.mdnsUrl ??
    hostInfo?.lanUrl ??
    hostInfo?.baseUrl ??
    "";
  const hostConnectUrlUsesMdns = hostConnectUrl.includes(".local");

  const diagnosticsBundleJson = useMemo(() => {
    return buildDiagnosticsBundleJson({
      anyActiveRuns: props.anyActiveRuns,
      canReloadWorkspace: props.canReloadWorkspace,
      clientConnected: props.clientConnected,
      developerMode: props.developerMode,
      hostConnectUrl,
      hostConnectUrlUsesMdns,
      hostInfo,
      venomcoworkServerSettings: props.venomcoworkServerSettings,
      venomcoworkServerStatus: props.venomcoworkServerStatus,
      venomcoworkServerUrl: props.venomcoworkServerUrl,
      runtimeWorkspaceId: props.runtimeWorkspaceId,
    });
  }, [
    hostConnectUrl,
    hostConnectUrlUsesMdns,
    hostInfo,
    props.anyActiveRuns,
    props.canReloadWorkspace,
    props.clientConnected,
    props.developerMode,
    props.venomcoworkServerSettings.token,
    props.venomcoworkServerSettings.urlOverride,
    props.venomcoworkServerStatus,
    props.venomcoworkServerUrl,
    props.runtimeWorkspaceId,
  ]);

  const handleCopy = async (value: string, field: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      dispatchLocal({ type: "copyingField", field });
      if (copyTimeoutRef.current !== undefined) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        dispatchLocal({ type: "copyingField", field: null });
        copyTimeoutRef.current = undefined;
      }, 2000);
    } catch {
      // ignore
    }
  };

  const handleTestConnection = async () => {
    if (venomcoworkTestState === "testing") return;
    const next = buildVenomcoworkSettings();
    props.updateVenomcoworkServerSettings(next);
    dispatchLocal({
      type: "testState",
      testState: "testing",
      testMessage: null,
    });
    try {
      const ok = await props.testVenomcoworkServerConnection(next);
      dispatchLocal({
        type: "testState",
        testState: ok ? "success" : "error",
        testMessage: ok
          ? t("config.connection_successful")
          : t("config.connection_failed"),
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t("config.connection_failed_check");
      dispatchLocal({
        type: "testState",
        testState: "error",
        testMessage: message,
      });
    }
  };

  return (
    <section className="space-y-6 max-w-3xl w-full">
      <ConfigWorkspaceSummary runtimeWorkspaceId={props.runtimeWorkspaceId} />
      <ConfigEngineReloadSection
        anyActiveRuns={props.anyActiveRuns}
        reloadBusy={props.reloadBusy}
        reloadAvailabilityReason={reloadAvailabilityReason}
        reloadButtonTone={reloadButtonTone}
        reloadButtonDisabled={reloadButtonDisabled}
        reloadButtonLabel={reloadButtonLabel}
        onReload={props.reloadWorkspaceEngine}
      />
      {props.developerMode ? (
        <ConfigDiagnosticsSection
          busy={props.busy}
          diagnosticsBundleJson={diagnosticsBundleJson}
          copyingField={copyingField}
          onCopy={handleCopy}
        />
      ) : null}
      {hostInfo ? (
        <ConfigServerSharingSection
          hostInfo={hostInfo}
          hostConnectUrl={hostConnectUrl}
          hostRemoteAccessEnabled={hostRemoteAccessEnabled}
          hostConnectUrlUsesMdns={hostConnectUrlUsesMdns}
          hostStatusLabel={hostStatusLabel}
          hostStatusStyle={hostStatusStyle}
          tokenVisible={tokenVisible}
          copyingField={copyingField}
          onCopy={handleCopy}
          onToggleToken={(key) => dispatchLocal({ type: "toggleToken", key })}
        />
      ) : null}
      <ConfigServerConnectionSection
        busy={props.busy}
        venomcoworkUrl={venomcoworkUrl}
        venomcoworkToken={venomcoworkToken}
        tokenVisible={tokenVisible.venomcowork}
        venomcoworkStatusLabel={venomcoworkStatusLabel}
        venomcoworkStatusStyle={venomcoworkStatusStyle}
        resolvedWorkspaceUrl={resolvedWorkspaceUrl}
        resolvedWorkspaceId={resolvedWorkspaceId}
        venomcoworkTestState={venomcoworkTestState}
        venomcoworkTestMessage={venomcoworkTestMessage}
        hasVenomcoworkChanges={hasVenomcoworkChanges}
        onUrlChange={(url) => dispatchLocal({ type: "url", url })}
        onTokenChange={(token) => dispatchLocal({ type: "token", token })}
        onToggleToken={() => dispatchLocal({ type: "toggleToken", key: "venomcowork" })}
        onTestConnection={handleTestConnection}
        onSave={() => props.updateVenomcoworkServerSettings(buildVenomcoworkSettings())}
        onReset={props.resetVenomcoworkServerSettings}
      />
      <ConfigMessagingIdentitiesSection />
      {!isDesktopRuntime() ? <div className="text-xs text-gray-9">{t("config.desktop_only_hint")}</div> : null}
    </section>
  );
}

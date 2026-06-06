/** @jsxImportSource react */
import { useCallback, useEffect, useMemo, useReducer } from "react";

import {
  buildVenomcoworkWorkspaceBaseUrl,
  createVenomcoworkServerClient,
  parseVenomcoworkWorkspaceIdFromUrl,
} from "../../../app/lib/venomcowork-server";
import type {
  EngineInfo,
  VenomcoworkServerInfo,
  WorkspaceInfo,
} from "../../../app/lib/desktop";
import type { VenomcoworkServerSettings } from "../../../app/lib/venomcowork-server";
import { t } from "../../../i18n";
import { isDesktopRuntime, normalizeDirectoryPath } from "../../../app/utils";

export type ShareWorkspaceState = ReturnType<typeof useShareWorkspaceState>;

type UseShareWorkspaceStateOptions = {
  workspaces: WorkspaceInfo[];
  venomcoworkServerHostInfo: VenomcoworkServerInfo | null;
  venomcoworkServerSettings: VenomcoworkServerSettings;
  engineInfo: EngineInfo | null;
  exportWorkspaceBusy: boolean;
  openLink: (url: string) => void;
  workspaceLabel: (workspace: WorkspaceInfo) => string;
};

type ShareWorkspaceLocalState = {
  shareWorkspaceId: string | null;
  shareLocalVenomcoworkWorkspaceId: string | null;
};

type ShareWorkspaceLocalAction =
  | { type: "open"; workspaceId: string }
  | { type: "close" }
  | { type: "localVenomcoworkWorkspace"; workspaceId: string | null };

const initialShareWorkspaceLocalState: ShareWorkspaceLocalState = {
  shareWorkspaceId: null,
  shareLocalVenomcoworkWorkspaceId: null,
};

function shareWorkspaceLocalReducer(
  state: ShareWorkspaceLocalState,
  action: ShareWorkspaceLocalAction,
): ShareWorkspaceLocalState {
  switch (action.type) {
    case "open":
      return { ...state, shareWorkspaceId: action.workspaceId };
    case "close":
      return { ...state, shareWorkspaceId: null };
    case "localVenomcoworkWorkspace":
      return { ...state, shareLocalVenomcoworkWorkspaceId: action.workspaceId };
  }
}

export function useShareWorkspaceState(options: UseShareWorkspaceStateOptions) {
  const [{ shareWorkspaceId, shareLocalVenomcoworkWorkspaceId }, dispatchShareWorkspace] = useReducer(
    shareWorkspaceLocalReducer,
    initialShareWorkspaceLocalState,
  );

  const openShareWorkspace = useCallback((workspaceId: string) => {
    dispatchShareWorkspace({ type: "open", workspaceId });
  }, []);

  const closeShareWorkspace = useCallback(() => {
    dispatchShareWorkspace({ type: "close" });
  }, []);

  const shareWorkspace = useMemo(() => {
    const id = shareWorkspaceId;
    if (!id) return null;
    return options.workspaces.find((workspace) => workspace.id === id) ?? null;
  }, [options.workspaces, shareWorkspaceId]);

  const shareWorkspaceName = useMemo(() => {
    return shareWorkspace ? options.workspaceLabel(shareWorkspace) : "";
  }, [options, shareWorkspace]);

  const shareWorkspaceDetail = useMemo(() => {
    const workspace = shareWorkspace;
    if (!workspace) return "";
    if (workspace.workspaceType === "remote") {
      if (workspace.remoteType === "venomcowork") {
        const hostUrl = workspace.venomcoworkHostUrl?.trim() || workspace.baseUrl?.trim() || "";
        const mounted = buildVenomcoworkWorkspaceBaseUrl(
          hostUrl,
          workspace.venomcoworkWorkspaceId,
        );
        return mounted || hostUrl;
      }
      return workspace.baseUrl?.trim() || "";
    }
    return workspace.path?.trim() || "";
  }, [shareWorkspace]);

  useEffect(() => {
    void shareWorkspaceId;
  }, [shareWorkspaceId]);

  useEffect(() => {
    const workspace = shareWorkspace;
    const baseUrl = options.venomcoworkServerHostInfo?.baseUrl?.trim() ?? "";
    const token =
      options.venomcoworkServerHostInfo?.ownerToken?.trim() ||
      options.venomcoworkServerHostInfo?.clientToken?.trim() ||
      "";
    const workspacePath = workspace?.workspaceType === "local" ? (workspace.path?.trim() ?? "") : "";

    if (
      !workspace ||
      workspace.workspaceType !== "local" ||
      !workspacePath ||
      !baseUrl ||
      !token
    ) {
      dispatchShareWorkspace({ type: "localVenomcoworkWorkspace", workspaceId: null });
      return;
    }

    let cancelled = false;
    dispatchShareWorkspace({ type: "localVenomcoworkWorkspace", workspaceId: null });

    void (async () => {
      try {
        const client = createVenomcoworkServerClient({ baseUrl, token });
        const response = await client.listWorkspaces();
        if (cancelled) return;
        const items = Array.isArray(response.items) ? response.items : [];
        const targetPath = normalizeDirectoryPath(workspacePath);
        const match = items.find(
          (entry) => normalizeDirectoryPath(entry.path) === targetPath,
        );
        dispatchShareWorkspace({ type: "localVenomcoworkWorkspace", workspaceId: match?.id ?? null });
      } catch {
        if (!cancelled) {
          dispatchShareWorkspace({ type: "localVenomcoworkWorkspace", workspaceId: null });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [options.venomcoworkServerHostInfo, shareWorkspace]);

  const shareFields = useMemo(() => {
    const workspace = shareWorkspace;
    if (!workspace) {
      return [] as Array<{
        label: string;
        value: string;
        secret?: boolean;
        placeholder?: string;
        hint?: string;
      }>;
    }

    if (workspace.workspaceType !== "remote") {
      if (options.venomcoworkServerHostInfo?.remoteAccessEnabled !== true) {
        return [];
      }
      const hostUrl =
        options.venomcoworkServerHostInfo?.connectUrl?.trim() ||
        options.venomcoworkServerHostInfo?.lanUrl?.trim() ||
        options.venomcoworkServerHostInfo?.mdnsUrl?.trim() ||
        options.venomcoworkServerHostInfo?.baseUrl?.trim() ||
        "";
      const mountedUrl = shareLocalVenomcoworkWorkspaceId
        ? buildVenomcoworkWorkspaceBaseUrl(hostUrl, shareLocalVenomcoworkWorkspaceId)
        : null;
      const url = mountedUrl || hostUrl;
      const collaboratorToken = options.venomcoworkServerHostInfo?.clientToken?.trim() || "";
      const ownerToken =
        collaboratorToken || options.venomcoworkServerHostInfo?.ownerToken?.trim() || "";
      return [
        {
          label: t("session.share_worker_url"),
          value: url,
          placeholder: !isDesktopRuntime()
            ? t("session.share_desktop_app_required")
            : t("session.share_starting_server"),
          hint: mountedUrl
            ? t("session.share_worker_url_phones_hint")
            : hostUrl
              ? t("session.share_worker_url_resolving_hint")
              : undefined,
        },
        {
          label: t("session.share_password"),
          value: ownerToken,
          secret: true,
          placeholder: isDesktopRuntime() ? "-" : t("session.share_desktop_app_required"),
          hint: mountedUrl
            ? t("session.share_worker_url_phones_hint")
            : t("session.share_owner_permission_hint"),
        },
        {
          label: t("session.share_collaborator_label"),
          value: collaboratorToken,
          secret: true,
          placeholder: isDesktopRuntime() ? "-" : t("session.share_desktop_app_required"),
          hint: mountedUrl
            ? t("session.share_collaborator_hint")
            : t("session.share_collaborator_host_hint"),
        },
      ];
    }

    if (workspace.remoteType === "venomcowork") {
      const hostUrl = workspace.venomcoworkHostUrl?.trim() || workspace.baseUrl?.trim() || "";
      const url =
        buildVenomcoworkWorkspaceBaseUrl(hostUrl, workspace.venomcoworkWorkspaceId) ||
        hostUrl;
      const token =
        workspace.venomcoworkToken?.trim() ||
        options.venomcoworkServerSettings.token?.trim() ||
        "";
      return [
        {
          label: t("session.share_worker_url"),
          value: url,
        },
        {
          label: t("session.share_password"),
          value: token,
          secret: true,
          placeholder: token ? undefined : t("session.share_set_token_hint"),
          hint: t("session.share_connected_with_hint"),
        },
      ];
    }

    const baseUrl = workspace.baseUrl?.trim() || workspace.path?.trim() || "";
    const directory = workspace.directory?.trim() || "";
    return [
      {
        label: t("session.share_opencode_base_url"),
        value: baseUrl,
      },
      {
        label: t("common.path"),
        value: directory,
        placeholder: t("common.default_parens"),
      },
    ];
  }, [
    options.venomcoworkServerHostInfo,
    options.venomcoworkServerSettings,
    shareLocalVenomcoworkWorkspaceId,
    shareWorkspace,
  ]);

  const shareNote = useMemo(() => {
    const workspace = shareWorkspace;
    if (!workspace) return null;
    if (workspace.workspaceType === "local" && options.engineInfo?.runtime === "direct") {
      return t("session.share_note_direct_runtime");
    }
    return null;
  }, [options.engineInfo, shareWorkspace]);

  const shareServiceDisabledReason = useMemo(() => {
    const workspace = shareWorkspace;
    if (!workspace) return t("session.share_select_workspace");
    if (workspace.workspaceType === "remote" && workspace.remoteType !== "venomcowork") {
      return t("session.share_venomcowork_workers_only");
    }
    if (workspace.workspaceType !== "remote") {
      const baseUrl = options.venomcoworkServerHostInfo?.baseUrl?.trim() ?? "";
      const token =
        options.venomcoworkServerHostInfo?.ownerToken?.trim() ||
        options.venomcoworkServerHostInfo?.clientToken?.trim() ||
        "";
      if (!baseUrl || !token) {
        return t("session.share_local_host_not_ready");
      }
    } else {
      const hostUrl = workspace.venomcoworkHostUrl?.trim() || workspace.baseUrl?.trim() || "";
      const token =
        workspace.venomcoworkToken?.trim() ||
        options.venomcoworkServerSettings.token?.trim() ||
        "";
      if (!hostUrl) return t("session.share_missing_host_url");
      if (!token) return t("session.share_missing_token");
    }
    return null;
  }, [options.venomcoworkServerHostInfo, options.venomcoworkServerSettings, shareWorkspace]);

  const exportDisabledReason = useMemo(() => {
    const workspace = shareWorkspace;
    if (!workspace) return t("session.export_desktop_only_local");
    if (workspace.workspaceType === "remote") {
      return t("session.export_local_only");
    }
    if (!isDesktopRuntime()) return t("session.export_desktop_only");
    if (options.exportWorkspaceBusy) return t("session.export_already_running");
    return null;
  }, [options.exportWorkspaceBusy, shareWorkspace]);

  return {
    shareWorkspaceId,
    shareWorkspaceOpen: Boolean(shareWorkspaceId),
    openShareWorkspace,
    closeShareWorkspace,
    shareWorkspace,
    shareWorkspaceName,
    shareWorkspaceDetail,
    shareFields,
    shareNote,
    shareServiceDisabledReason,
    exportDisabledReason,
  };
}

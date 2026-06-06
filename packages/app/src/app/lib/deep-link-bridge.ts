export const deepLinkBridgeEvent = "venomcowork:deep-link";
export const nativeDeepLinkEvent = "venomcowork:deep-link-native";

export type DeepLinkBridgeDetail = {
  urls: string[];
};

declare global {
  interface Window {
    __VENOMCOWORK__?: {
      deepLinks?: string[];
    };
  }
}

function normalizeDeepLinks(urls: readonly string[]): string[] {
  return urls.map((url) => url.trim()).filter(Boolean);
}

export function pushPendingDeepLinks(target: Window, urls: readonly string[]): string[] {
  const normalized = normalizeDeepLinks(urls);
  if (normalized.length === 0) {
    return [];
  }

  target.__VENOMCOWORK__ ??= {};
  const pending = target.__VENOMCOWORK__.deepLinks ?? [];
  target.__VENOMCOWORK__.deepLinks = [...pending, ...normalized];
  target.dispatchEvent(
    new CustomEvent<DeepLinkBridgeDetail>(deepLinkBridgeEvent, {
      detail: { urls: normalized },
    }),
  );
  return normalized;
}

export function drainPendingDeepLinks(target: Window): string[] {
  const pending = target.__VENOMCOWORK__?.deepLinks ?? [];
  if (target.__VENOMCOWORK__) {
    target.__VENOMCOWORK__.deepLinks = [];
  }
  return [...pending];
}

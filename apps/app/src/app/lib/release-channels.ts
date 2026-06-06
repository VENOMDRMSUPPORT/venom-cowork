/**
 * Release-channel concept for VenomCowork desktop builds.
 *
 * There are two channels users can opt into:
 *
 * - "stable": the default. The desktop app auto-updates from a user-supplied
 *   feed URL. Set VENOMCOWORK_UPDATER_STABLE_URL to point at a generic
 *   electron-updater host (S3, generic HTTP, local file server, etc.).
 *
 * - "alpha": a rolling channel. Set VENOMCOWORK_UPDATER_ALPHA_URL similarly.
 *
 * In this vanilla build the URLs are empty by default, so the in-app updater
 * is effectively a no-op until the operator wires a feed.
 */

import type { ReleaseChannel } from "../types";

/** Stable channel electron-updater manifest URL (empty until configured). */
export const STABLE_UPDATER_ENDPOINT = process.env.VENOMCOWORK_UPDATER_STABLE_URL || "";

/** Alpha channel electron-updater manifest URL (empty until configured). */
export const ALPHA_UPDATER_ENDPOINT = process.env.VENOMCOWORK_UPDATER_ALPHA_URL || "";

/** Rolling release tag identifier (label only — no remote fetch in this build). */
export const ALPHA_MACOS_RELEASE_TAG = "alpha-macos-latest";

export type PlatformKind = "darwin" | "linux" | "windows" | "web" | "unknown";

/**
 * Returns true when the given platform supports the alpha channel.
 *
 * Today alpha builds are produced only for macOS (arm64). The type-level
 * conservatism here is deliberate: it's easier to widen later than to
 * silently start advertising an alpha endpoint that serves no artifact.
 */
export function isAlphaChannelSupported(platform: PlatformKind): boolean {
  return platform === "darwin";
}

/**
 * Resolve the Tauri updater manifest URL for the requested channel.
 *
 * Falls back to the stable endpoint whenever alpha isn't supported on the
 * current platform, so the caller never needs to special-case "alpha chosen
 * on Linux" / "alpha chosen on Windows" etc.
 */
export function resolveUpdaterEndpoint(
  channel: ReleaseChannel,
  platform: PlatformKind = "darwin",
): string {
  if (channel === "alpha" && isAlphaChannelSupported(platform)) {
    return ALPHA_UPDATER_ENDPOINT;
  }
  return STABLE_UPDATER_ENDPOINT;
}

/** Narrow an arbitrary string to a valid ReleaseChannel, defaulting to stable. */
export function coerceReleaseChannel(value: unknown): ReleaseChannel {
  return value === "alpha" ? "alpha" : "stable";
}

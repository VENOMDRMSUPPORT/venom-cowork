import { INFERENCE_MODEL_ALIASES } from "@venom-cowork/types/den/inference";

import {
  buildDenAuthUrl,
  getDenInferenceUrl,
  readDenBootstrapConfig,
  readDenSettings,
} from "../../../app/lib/den";

export const VENOMCOWORK_MODELS_PROVIDER_ID = "venomcowork";
export const VENOMCOWORK_MODELS_PROVIDER_NAME = "VenomCowork Models";
export const VENOMCOWORK_MODELS_PROMO_HIDDEN_KEY = "venomcowork.venomcoworkModelsPromo.hidden";
export const VENOMCOWORK_MODELS_PROMO_LAST_SHOWN_KEY = "venomcowork.venomcoworkModelsPromo.lastShownAt";
export const VENOMCOWORK_MODELS_STARTUP_PROMO_SHOWN_KEY = "venomcowork.venomcoworkModelsPromo.startupShown";
export const venomCoworkModelsPromoChangedEvent = "venomcowork-venomcowork-models-promo-changed";
export const VENOMCOWORK_MODELS_PROMO_SHOW_DELAY_MS = 4_000;
export const VENOMCOWORK_MODELS_PROMO_VISIBLE_MS = 14_000;
export const VENOMCOWORK_MODELS_PROMO_REPEAT_MS = 6 * 60 * 60 * 1000;

export type VenomCoworkModelPreview = {
  id: string;
  title: string;
  subtitle: string;
};

export const VENOMCOWORK_MODEL_PREVIEWS: VenomCoworkModelPreview[] = Object.entries(
  INFERENCE_MODEL_ALIASES,
)
  .filter(([, model]) => model.enabled)
  .map(([id, model]) => ({
    id,
    title: model.displayName.replace(/^VenomCowork:\s*/, ""),
    subtitle: "VenomCowork hosted",
  }));

export function hasVenomCoworkModelsProvider(providerIds: readonly string[]) {
  return providerIds.some((id) => id.trim().toLowerCase() === VENOMCOWORK_MODELS_PROVIDER_ID);
}

export function getVenomCoworkModelsActionUrl(isSignedIn: boolean) {
  const settings = readDenSettings();
  const baseUrl = settings.baseUrl || readDenBootstrapConfig().baseUrl;
  return isSignedIn ? getDenInferenceUrl(baseUrl) : buildDenAuthUrl(baseUrl, "sign-in");
}

export function isVenomCoworkModelsPromoHidden() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(VENOMCOWORK_MODELS_PROMO_HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function hideVenomCoworkModelsPromo() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VENOMCOWORK_MODELS_PROMO_HIDDEN_KEY, "1");
    window.dispatchEvent(new Event(venomCoworkModelsPromoChangedEvent));
  } catch {}
}

export function wasVenomCoworkModelsStartupPromoShown() {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(VENOMCOWORK_MODELS_STARTUP_PROMO_SHOWN_KEY) === "1";
  } catch {
    return true;
  }
}

export function markVenomCoworkModelsStartupPromoShown() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VENOMCOWORK_MODELS_STARTUP_PROMO_SHOWN_KEY, "1");
  } catch {}
}

export function shouldShowVenomCoworkModelsPromo(now = Date.now()) {
  if (typeof window === "undefined" || isVenomCoworkModelsPromoHidden()) return false;
  try {
    const lastShown = Number(window.localStorage.getItem(VENOMCOWORK_MODELS_PROMO_LAST_SHOWN_KEY) ?? "0");
    return !Number.isFinite(lastShown) || now - lastShown >= VENOMCOWORK_MODELS_PROMO_REPEAT_MS;
  } catch {
    return true;
  }
}

export function markVenomCoworkModelsPromoShown(now = Date.now()) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VENOMCOWORK_MODELS_PROMO_LAST_SHOWN_KEY, String(now));
  } catch {}
}

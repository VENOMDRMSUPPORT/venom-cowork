export const VENOMCOWORK_DEPLOYMENT_ENV_VAR = "VITE_VENOMCOWORK_DEPLOYMENT";

export type VenomCoworkDeployment = "desktop" | "web";

function normalizeDeployment(value: string | undefined): VenomCoworkDeployment {
  const normalized = value?.trim().toLowerCase();
  return normalized === "web" ? "web" : "desktop";
}

export function getVenomCoworkDeployment(): VenomCoworkDeployment {
  const envValue =
    typeof import.meta !== "undefined" && typeof import.meta.env?.VITE_VENOMCOWORK_DEPLOYMENT === "string"
      ? import.meta.env.VITE_VENOMCOWORK_DEPLOYMENT
      : undefined;

  return normalizeDeployment(envValue);
}

export function isWebDeployment(): boolean {
  return getVenomCoworkDeployment() === "web";
}

export function isDesktopDeployment(): boolean {
  return getVenomCoworkDeployment() === "desktop";
}

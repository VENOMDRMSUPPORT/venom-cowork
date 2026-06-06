import { afterEach, beforeEach, describe, expect, test } from "bun:test";

import {
  buildVenomcoworkEnvRuntimeKey,
  readVenomcoworkEnvPendingChanges,
  writeVenomcoworkEnvPendingChanges,
} from "../src/app/lib/venomcowork-env-runtime";

const originalWindow = globalThis.window;

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

describe("venomcowork env runtime", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: memoryStorage(),
        sessionStorage: memoryStorage(),
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
  });

  test("persists pending changes across browser sessions", () => {
    const runtimeKey = "http://127.0.0.1:8787::pid:123";
    writeVenomcoworkEnvPendingChanges(true, runtimeKey);
    expect(readVenomcoworkEnvPendingChanges(runtimeKey)).toBe(true);

    window.sessionStorage.clear();
    expect(readVenomcoworkEnvPendingChanges(runtimeKey)).toBe(true);

    writeVenomcoworkEnvPendingChanges(false);
    expect(readVenomcoworkEnvPendingChanges(runtimeKey)).toBe(false);
  });

  test("reads legacy sessionStorage pending state", () => {
    window.sessionStorage.setItem("venomcowork.settings.environment.pendingChanges", "1");

    expect(readVenomcoworkEnvPendingChanges()).toBe(true);
  });

  test("clears pending changes after the runtime changes", () => {
    writeVenomcoworkEnvPendingChanges(true, "http://127.0.0.1:8787::pid:123");

    expect(readVenomcoworkEnvPendingChanges("http://127.0.0.1:8787::pid:456")).toBe(false);
    expect(readVenomcoworkEnvPendingChanges("http://127.0.0.1:8787::pid:456")).toBe(false);
  });

  test("builds a stable runtime key from server identity", () => {
    expect(buildVenomcoworkEnvRuntimeKey({
      baseUrl: "http://127.0.0.1:8787/",
      pid: 123,
      port: 8787,
    })).toBe("http://127.0.0.1:8787::pid:123");
    expect(buildVenomcoworkEnvRuntimeKey({
      baseUrl: "http://127.0.0.1:8787",
      port: 8787,
    })).toBe("http://127.0.0.1:8787::port:8787");
    expect(buildVenomcoworkEnvRuntimeKey({})).toBeUndefined();
  });
});

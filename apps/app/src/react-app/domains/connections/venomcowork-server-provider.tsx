/** @jsxImportSource react */
import {
  createContext,
  use,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { VenomcoworkServerStore } from "./venomcowork-server-store";

const VenomcoworkServerContext = createContext<VenomcoworkServerStore | null>(null);

export function VenomcoworkServerProvider(props: {
  store: VenomcoworkServerStore;
  children: ReactNode;
}) {
  return (
    <VenomcoworkServerContext.Provider value={props.store}>
      {props.children}
    </VenomcoworkServerContext.Provider>
  );
}

export function useVenomcoworkServer() {
  const store = use(VenomcoworkServerContext);
  if (!store) {
    throw new Error("useVenomcoworkServer must be used within an VenomcoworkServerProvider");
  }

  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return store;
}

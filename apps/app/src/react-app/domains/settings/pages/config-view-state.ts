export type OpenworkTestState = "idle" | "testing" | "success" | "error";

export type OpenworkConnectionState = {
  url: string;
  token: string;
  testState: OpenworkTestState;
  testMessage: string | null;
};

export type TokenVisibilityKey = "venomcowork" | "client" | "owner" | "host";

type ConfigLocalState = {
  venomcoworkConnection: OpenworkConnectionState;
  tokenVisible: Record<TokenVisibilityKey, boolean>;
  copyingField: string | null;
};

type ConfigLocalAction =
  | { type: "serverSettings"; connection: OpenworkConnectionState }
  | { type: "url"; url: string }
  | { type: "token"; token: string }
  | { type: "testState"; testState: OpenworkTestState; testMessage: string | null }
  | { type: "toggleToken"; key: TokenVisibilityKey }
  | { type: "copyingField"; field: string | null };

export const initialConfigLocalState: ConfigLocalState = {
  venomcoworkConnection: {
    url: "",
    token: "",
    testState: "idle",
    testMessage: null,
  },
  tokenVisible: {
    venomcowork: false,
    client: false,
    owner: false,
    host: false,
  },
  copyingField: null,
};

export function configLocalReducer(
  state: ConfigLocalState,
  action: ConfigLocalAction,
): ConfigLocalState {
  switch (action.type) {
    case "serverSettings":
      return { ...state, venomcoworkConnection: action.connection };
    case "url":
      return {
        ...state,
        venomcoworkConnection: {
          ...state.venomcoworkConnection,
          url: action.url,
          testState: "idle",
          testMessage: null,
        },
      };
    case "token":
      return {
        ...state,
        venomcoworkConnection: {
          ...state.venomcoworkConnection,
          token: action.token,
          testState: "idle",
          testMessage: null,
        },
      };
    case "testState":
      return {
        ...state,
        venomcoworkConnection: {
          ...state.venomcoworkConnection,
          testState: action.testState,
          testMessage: action.testMessage,
        },
      };
    case "toggleToken":
      return {
        ...state,
        tokenVisible: {
          ...state.tokenVisible,
          [action.key]: !state.tokenVisible[action.key],
        },
      };
    case "copyingField":
      return { ...state, copyingField: action.field };
  }
}

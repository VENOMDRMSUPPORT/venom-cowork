#!/usr/bin/env sh
set -eu

VENOMCOWORK_WORKSPACE="${VENOMCOWORK_WORKSPACE:-/workspace}"
VENOMCOWORK_DATA_DIR="${VENOMCOWORK_DATA_DIR:-/data/venomcowork-orchestrator}"
VENOMCOWORK_SIDECAR_DIR="${VENOMCOWORK_SIDECAR_DIR:-/data/sidecars}"
VENOMCOWORK_PORT="${VENOMCOWORK_PORT:-8787}"
VENOMCOWORK_OPENCODE_PORT="${VENOMCOWORK_OPENCODE_PORT:-4096}"
VENOMCOWORK_TOKEN="${VENOMCOWORK_TOKEN:-microsandbox-token}"
VENOMCOWORK_HOST_TOKEN="${VENOMCOWORK_HOST_TOKEN:-microsandbox-host-token}"
VENOMCOWORK_APPROVAL_MODE="${VENOMCOWORK_APPROVAL_MODE:-auto}"
VENOMCOWORK_CORS_ORIGINS="${VENOMCOWORK_CORS_ORIGINS:-*}"
VENOMCOWORK_CONNECT_HOST="${VENOMCOWORK_CONNECT_HOST:-127.0.0.1}"
HOME="${HOME:-/root}"
USER="${USER:-root}"
SHELL="${SHELL:-/bin/sh}"
XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
XDG_CACHE_HOME="${XDG_CACHE_HOME:-$HOME/.cache}"
XDG_DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}"
XDG_STATE_HOME="${XDG_STATE_HOME:-$HOME/.local/state}"

if [ "$HOME" = "/" ]; then
  HOME=/root
  XDG_CONFIG_HOME="$HOME/.config"
  XDG_CACHE_HOME="$HOME/.cache"
  XDG_DATA_HOME="$HOME/.local/share"
  XDG_STATE_HOME="$HOME/.local/state"
fi

export HOME USER SHELL XDG_CONFIG_HOME XDG_CACHE_HOME XDG_DATA_HOME XDG_STATE_HOME

mkdir -p "$VENOMCOWORK_WORKSPACE" "$VENOMCOWORK_DATA_DIR" "$VENOMCOWORK_SIDECAR_DIR"
mkdir -p "$HOME" "$XDG_CONFIG_HOME" "$XDG_CACHE_HOME" "$XDG_DATA_HOME" "$XDG_STATE_HOME"

printf '%s\n' "Starting VenomCowork micro-sandbox"
printf '%s\n' "- workspace: $VENOMCOWORK_WORKSPACE"
printf '%s\n' "- home: $HOME"
printf '%s\n' "- venomcowork url: http://$VENOMCOWORK_CONNECT_HOST:$VENOMCOWORK_PORT"
printf '%s\n' "- client token: $VENOMCOWORK_TOKEN"
printf '%s\n' "- host token: $VENOMCOWORK_HOST_TOKEN"
printf '%s\n' "- health: curl http://$VENOMCOWORK_CONNECT_HOST:$VENOMCOWORK_PORT/health"
printf '%s\n' "- auth test: curl -H \"Authorization: Bearer $VENOMCOWORK_TOKEN\" http://$VENOMCOWORK_CONNECT_HOST:$VENOMCOWORK_PORT/workspaces"

exec venomcowork serve \
  --workspace "$VENOMCOWORK_WORKSPACE" \
  --remote-access \
  --venomcowork-port "$VENOMCOWORK_PORT" \
  --opencode-host 127.0.0.1 \
  --opencode-port "$VENOMCOWORK_OPENCODE_PORT" \
  --venomcowork-token "$VENOMCOWORK_TOKEN" \
  --venomcowork-host-token "$VENOMCOWORK_HOST_TOKEN" \
  --approval "$VENOMCOWORK_APPROVAL_MODE" \
  --cors "$VENOMCOWORK_CORS_ORIGINS" \
  --connect-host "$VENOMCOWORK_CONNECT_HOST" \
  --allow-external \
  --sidecar-source external \
  --opencode-source external \
  --venomcowork-server-bin /usr/local/bin/venomcowork-server \
  --opencode-bin /usr/local/bin/opencode \
  --no-opencode-router

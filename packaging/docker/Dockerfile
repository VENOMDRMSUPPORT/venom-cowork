FROM node:22-bookworm-slim

ARG VENOMCOWORK_ORCHESTRATOR_VERSION=0.11.22

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    tar \
    unzip \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g "venomcowork-orchestrator@${VENOMCOWORK_ORCHESTRATOR_VERSION}"

# Persistent directories (mount volumes here on PaaS/SSH).
ENV VENOMCOWORK_DATA_DIR=/data/venomcowork-orchestrator
ENV VENOMCOWORK_SIDECAR_DIR=/data/sidecars

# The workspace is mounted from the host/volume.
ENV VENOMCOWORK_WORKSPACE=/workspace

# VenomCowork host contract surface.
EXPOSE 8787

# Optional: opencode-router health (only relevant if you enable the router).
EXPOSE 3005

VOLUME ["/workspace", "/data"]

# Defaults:
# - VenomCowork server is published intentionally via --remote-access
# - OpenCode stays internal (127.0.0.1:4096)
# - VenomCowork server proxies OpenCode via localhost
# - OpenCode Router disabled by default
CMD [
  "venomcowork",
  "serve",
  "--workspace", "/workspace",
  "--remote-access",
  "--venomcowork-port", "8787",
  "--opencode-host", "127.0.0.1",
  "--opencode-port", "4096",
  "--connect-host", "127.0.0.1",
  "--cors", "*",
  "--approval", "manual",
  "--no-opencode-router"
]

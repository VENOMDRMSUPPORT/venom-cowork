#!/usr/bin/env bash
set -euo pipefail

# Start all services for the Daytona/devcontainer workspace.
# Launches the real Electron app with a virtual display.
#
# Usage: bash .devcontainer/start-services.sh
#
# Services started:
#   - Xvfb + noVNC (port 6080) â€” see the Electron app in your browser
#   - Vite dev server (port 5173) â€” React UI with HMR
#   - Electron app â€” the real desktop app on the virtual display
#   - CDP debugging (port 9825) â€” for automation
#
# Optional (if MySQL is available):
#   - Den API (port 8788)
#   - Den Web (port 3005)

cd /workspace

# â”€â”€ 1. Virtual display â”€â”€
echo "==> Starting virtual display..."
.devcontainer/start-daytona-vnc.sh
sleep 2

# â”€â”€ 2. Vite dev server on 0.0.0.0 (so Electron can reach it via 127.0.0.1) â”€â”€
echo "==> Starting Vite on :5173..."
cd apps/app
VENOMCOWORK_DEV_MODE=1 nohup npx vite --host 0.0.0.0 --port 5173 > /tmp/vite.log 2>&1 &
cd /workspace
sleep 3

# â”€â”€ 3. Electron app â”€â”€
echo "==> Starting Electron app..."
bash .devcontainer/start-daytona-electron.sh --detach

# â”€â”€ 4. Wait for Electron to be ready â”€â”€
echo "==> Waiting for Electron..."
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:9825/json/list >/dev/null 2>&1; then
    echo "Electron CDP ready."
    break
  fi
  sleep 2
done

# â”€â”€ 5. Optional: Den stack (only if MySQL is reachable) â”€â”€
if mysql -h mysql -u root -ppassword -e "SELECT 1" >/dev/null 2>&1; then
  echo "==> MySQL found, starting Den stack..."

  echo "  Pushing DB schema..."
  pnpm --filter @venom-cowork-ee/den-db db:push 2>&1 || echo "  DB push failed (may be up to date)"

  echo "  Starting Den API on :8788..."
  pnpm dev:den:api > /tmp/den-api.log 2>&1 &

  for i in $(seq 1 20); do
    if curl -sf http://localhost:8788/health >/dev/null 2>&1; then
      echo "  Den API healthy."
      break
    fi
    sleep 2
  done

  echo "  Starting Den Web on :3005..."
  pnpm dev:den:web > /tmp/den-web.log 2>&1 &
else
  echo "==> MySQL not found, skipping Den stack."
fi

echo ""
echo "============================================"
echo "  All services running!"
echo ""
echo "  Desktop App (noVNC):  http://localhost:6080"
echo "  CDP Debug:            ws://127.0.0.1:9825"
echo "  Vite HMR:             http://localhost:5173"
if mysql -h mysql -u root -ppassword -e "SELECT 1" >/dev/null 2>&1; then
echo "  Den Web:              http://localhost:3005"
echo "  Den API:              http://localhost:8788"
fi
echo "============================================"
echo ""

# Keep alive
wait

#!/usr/bin/env bash
# One-time setup of a Debian 12 VM for the indexer: Node 24, pnpm, Caddy (automatic HTTPS), a locked-down systemd service.
# Usage (as root on the VM): HOSTNAME=<public host> CORS_ORIGINS=<https://app,...> bash setup-vm.sh /opt/stabletap-src.tar.gz
set -euo pipefail
: "${HOSTNAME:?set HOSTNAME to the public hostname (DNS must point at this VM)}"
: "${CORS_ORIGINS:?set CORS_ORIGINS to the web app origin(s)}"
SRC_TAR="${1:?path to the source tarball}"
APP=/opt/stabletap
DATA=/var/lib/stabletap

# 1 GB RAM: add swap so pnpm install doesn't run out of memory.
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo "/swapfile none swap sw 0 0" >> /etc/fstab
fi

apt-get update -y
apt-get install -y ca-certificates curl gnupg debian-keyring debian-archive-keyring apt-transport-https unattended-upgrades

# Node 24 from NodeSource, pnpm via corepack.
if ! command -v node >/dev/null || [[ "$(node -v)" != v24* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
fi
corepack enable

# Caddy from its official apt repository.
if ! command -v caddy >/dev/null; then
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y && apt-get install -y caddy
fi

# Unprivileged service user; code is root-owned and read-only to it, data dir is its own.
id stabletap >/dev/null 2>&1 || useradd --system --home "$DATA" --shell /usr/sbin/nologin stabletap
install -d -o stabletap -g stabletap -m 700 "$DATA"
rm -rf "$APP.new" && mkdir -p "$APP.new" && tar -xzf "$SRC_TAR" -C "$APP.new"
(cd "$APP.new" && COREPACK_ENABLE_DOWNLOAD_PROMPT=0 pnpm install --frozen-lockfile --prod=false --filter @stabletap/indexer...)
rm -rf "$APP.old"; [[ -d "$APP" ]] && mv "$APP" "$APP.old"; mv "$APP.new" "$APP"
chown -R root:root "$APP"

# Public config only (the indexer holds no secrets). Kept outside the code dir so redeploys don't replace it.
install -d -m 755 /etc/stabletap
cat > /etc/stabletap/indexer.env <<EOF
STABLETAP_WS=wss://test-node-v3.portaldot.dev
STABLETAP_ASSET_ID=7777
STABLETAP_ASSET_DECIMALS=6
INDEXER_START_BLOCK=148225
INDEXER_DB=$DATA/indexer.db
INDEXER_HOST=127.0.0.1
INDEXER_PORT=8787
INDEXER_CORS_ORIGINS=$CORS_ORIGINS
EOF

cat > /etc/systemd/system/stabletap-indexer.service <<EOF
[Unit]
Description=StableTap indexer
After=network-online.target
Wants=network-online.target

[Service]
User=stabletap
Group=stabletap
WorkingDirectory=$APP/apps/indexer
ExecStart=/usr/bin/node --env-file=/etc/stabletap/indexer.env src/main.ts
Restart=always
RestartSec=5
# Node's heap fits in the e2-micro's memory.
Environment=NODE_OPTIONS=--max-old-space-size=384
# Hardening: read-only system, private tmp, no privilege escalation; only the data dir is writable.
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
LockPersonality=true
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
CapabilityBoundingSet=
ReadWritePaths=$DATA

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/caddy/Caddyfile <<EOF
$HOSTNAME {
	encode zstd gzip
	header {
		Strict-Transport-Security "max-age=31536000"
		-Server
	}
	reverse_proxy 127.0.0.1:8787
}
EOF

systemctl daemon-reload
systemctl enable --now stabletap-indexer
systemctl restart stabletap-indexer
systemctl reload caddy || systemctl restart caddy
echo "done: https://$HOSTNAME/health"

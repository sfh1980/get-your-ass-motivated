# GYAM homelab deploy

Target: Docker Compose Postgres + Node API + Vite/PWA web, fronted by nginx, remote access via Cloudflare. Data stays on Sean’s machines (no public SaaS as system of record). No Tailscale/Nextcloud required.

V1 Compose only runs Postgres today; API and web stay host processes (or your own containers later). Do not block core on sidecars.

## Compose: Postgres

Root `docker-compose.yml`:

| Item | Value |
|------|--------|
| Image | `postgres:16-alpine` |
| Container | `gyam-postgres` |
| Host port | **5434** → container `5432` (avoids clashing with other local DBs) |
| User / DB | `gyam` / `gyam` |
| Volume | named `gyam_pgdata` → `/var/lib/postgresql/data` |
| Healthcheck | `pg_isready -U gyam -d gyam` |

```bash
docker compose up -d
# wait until healthy, then point apps at DATABASE_URL
```

Env (see `.env.example`; never commit real secrets):

```env
DATABASE_URL=postgresql://gyam:gyam@localhost:5434/gyam
# MCP / Docker tools hitting host Postgres from a container:
GYAM_DATABASE_URI=postgresql://gyam:gyam@host.docker.internal:5434/gyam
API_PORT=4070
WEB_ORIGIN=http://localhost:5173
SESSION_DAYS=30
```

Change the Compose password for any always-on host; keep `.env` and Compose in sync.

## API and web ports (dev / LAN)

| Process | Default | Notes |
|---------|---------|--------|
| API (`apps/api`) | **4070** | `API_PORT`; health: `GET /api/health` |
| Web (`apps/web` Vite) | **5173** | Dev proxy: `/api` → `http://localhost:4070` |
| Browser → API | same origin in prod | Web uses `fetch(..., { credentials: "include" })` on `/api/...` |

Local: start Postgres, migrate/seed, run API + web. Multi-device on LAN without Cloudflare: bind API/web to the LAN IP or put nginx in front and open only 80/443.

## nginx reverse proxy (sketch)

Goal: one public origin so cookies and CORS stay simple — browser hits `https://gyam.example.com`, nginx serves the built PWA and proxies `/api` to the Node process.

```nginx
# /etc/nginx/sites-available/gyam  (placeholders only)
server {
    listen 80;
    server_name gyam.example.com;
    # Prefer HTTPS termination at Cloudflare or local certs; redirect if needed.

    root /var/www/gyam/web/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:4070;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Required for session cookie auth
        proxy_set_header Cookie $http_cookie;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Options if ports conflict:

1. Keep API on **4070** (default) and only expose nginx 80/443.
2. Move `API_PORT` if something else owns 4070; update nginx `proxy_pass` only.
3. Leave Postgres on **5434** and do **not** publish it through Cloudflare/nginx.

Build web (`apps/web` production build) into the nginx `root` path on the homelab host.

## Cloudflare (tunnel or proxied DNS)

SoT path: **Cloudflare → nginx → app**.

**Option A — Cloudflare Tunnel (preferred for no open inbound ports)**  
Run `cloudflared` on the homelab, point a hostname at `http://127.0.0.1:80` (nginx). Do not tunnel straight to Vite or Postgres.

**Option B — Proxied DNS (orange cloud)**  
Point `gyam.example.com` at the homelab public IP; Cloudflare proxies HTTPS to nginx (origin 80 or 443). Restrict origin firewall to Cloudflare IPs if the host is otherwise exposed.

Notes:

- Terminate TLS at Cloudflare (Flexible) or end-to-end (Full / Full strict) to nginx with a cert — Full/strict is better once origin certs exist.
- Web Push / VAPID later can be picky about HTTPS and service-worker scope; keep a single stable HTTPS hostname.
- Do not expose host port **5434** via Cloudflare.

## `WEB_ORIGIN`, cookies, multi-device

API CORS uses a **single** `WEB_ORIGIN` with `credentials: true` (`apps/api/src/index.ts`). Session cookie `gyam_session` is `httpOnly`, `sameSite: "lax"`, path `/` (`apps/api/src/auth.ts`). Today `secure` is hard-coded `false` for local HTTP.

| Environment | `WEB_ORIGIN` | Cookie / CORS tips |
|-------------|--------------|--------------------|
| Local Vite | `http://localhost:5173` | Default in `.env.example` |
| Homelab HTTPS (nginx + CF) | `https://gyam.example.com` | Must match the browser origin exactly (scheme + host + port) |
| Same host, nginx serves SPA + `/api` | Public site URL | Prefer one origin; avoids cross-site cookie issues |

For multi-device: all phones/desktops use the **same** HTTPS origin. Do not mix `http://lan-ip:5173` and `https://gyam.example.com` against one API without aligning `WEB_ORIGIN` (and eventually `Secure` cookies for HTTPS).

When you turn on HTTPS for real users, set cookie `secure: true` (code change) so browsers accept the session over Cloudflare HTTPS. Until then, LAN HTTP + `secure: false` is fine for solo use.

## Postgres volume backup

Named volume: `gyam_pgdata`.

Logical dump (preferred; works while DB is up):

```bash
docker compose exec -T postgres pg_dump -U gyam -d gyam -Fc > "gyam-$(date +%Y%m%d).dump"
# restore:
# docker compose exec -T postgres pg_restore -U gyam -d gyam --clean < gyam-YYYYMMDD.dump
```

Optional: copy dumps to NAS/TrueNAS (SoT backup path). Rotate dumps; do not commit dumps to git.

Volume filesystem snapshot (DB stopped or consistent snapshot tooling):

```bash
docker compose stop postgres
# back up Docker volume directory for gyam_pgdata, then:
docker compose start postgres
```

## Out of scope (intentionally)

- No extra Compose services (API/web containers, redis, sidecars) required for this V1 polish doc.
- No Tailscale/Nextcloud as a dependency.
- Secrets stay in env / host secret store — placeholders only in repo.

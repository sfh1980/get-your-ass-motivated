# GYAM homelab deploy

**Source of truth for hosting.** Mirror the proven **Yum4Less TrueNAS SCALE Custom App** pattern: LAN first, WAN later.

| Phase | Goal | Status |
|-------|------|--------|
| **A — LAN** | TrueNAS Custom App: Postgres + single app container; household LAN | **Done** 2026-08-02 (`http://192.168.1.246:4070`) |
| **B — WAN** | Cloudflare Tunnel → HTTPS; `COOKIE_SECURE=true` | **Deferred** — blocked until Yum4Less Cloudflare is done; then add GYAM |

Data stays on Sean’s infrastructure. No Tailscale/Nextcloud required. No public SaaS as system of record.

**Related:** repo SoT §3; Obsidian `Projects/GYAM/GYAM Homelab Deploy`; Yum4Less `docs/homelab-deploy.md` §9 (working sibling pattern).

---

## Phase A — TrueNAS SCALE Custom App (primary path)

### Topology

```
Phone / PC (LAN)
    → http://<truenas-lan-ip>:4070
        → gyam-app  (Express serves SPA + /api, one origin)
            → gyam-postgres  (Apps network only; no host port)
```

| Piece | Choice |
|-------|--------|
| Host | TrueNAS SCALE Apps → **Custom App** YAML |
| Datasets | `/mnt/appPool/gyam/{repo,postgres-data,uploads}` |
| `db` | `postgres:16-alpine`, **no host ports**, volume → `postgres-data` |
| `app` | `ghcr.io/sfh1980/gyam-app:homelab` (or `:<sha7>` pin) on **`4070:4070`** |
| Ingest / cron sidecar | **None** (unlike Yum4Less) |
| Watchtower | Optional sibling Custom App after first green GHCR publish; label **app only**, never `db` |
| Public domain / nginx / Tunnel | **Not Phase A** |

**Why one app container:** Web already calls same-origin `/api/...` with cookies. Production image = Express serves `apps/web/dist` + API. One LAN origin → simple `WEB_ORIGIN`, no CORS fight.

### Repo artifacts (Phase A image path)

| Artifact | Path |
|----------|------|
| Dockerfile | `Dockerfile` (Express serves SPA + `/api`) |
| Entrypoint | `docker/entrypoint.sh` (`prisma migrate deploy` then `node`) |
| TrueNAS YAML | `docker/truenas/custom-app.yml` |
| Local proof compose | `docker compose -f docker-compose.homelab.yml up --build` |
| GHCR workflow | `.github/workflows/publish-image.yml` → `ghcr.io/sfh1980/gyam-app:<sha7\|latest\|homelab>` |
| Baseline migration | `apps/api/prisma/migrations/20260802000000_init` |
| Follow-on (TrueNAS applied 2026-08-03) | `20260803100000_task_instructions`, `20260803120000_task_attachments` |

**Phase A live (2026-08-02):** Custom App `gyam` on TrueNAS; image `ghcr.io/sfh1980/gyam-app:homelab`; LAN smoke green. Optional later: Watchtower.

**Uploads volume (required for job + task file attachments):** mount `/mnt/appPool/gyam/uploads` → `/app/data/uploads` (see `docker/truenas/custom-app.yml`). JSON export stores attachment **metadata only**; binaries live on this volume — keep it on backups with Postgres.

Local Windows Compose (Postgres-only + host Node) remains the **dev** path.

### Datasets & permissions (Sean on TrueNAS)

```bash
# Create datasets in UI or CLI, then:
sudo chown -R 999:999 /mnt/appPool/gyam/postgres-data
sudo chmod 700 /mnt/appPool/gyam/postgres-data
```

Ops habits from Yum4Less that transfer:

- Use **`sudo docker`** as `truenas_admin` when debugging (Apps UI logs alone can mislead)
- App healthcheck: Node `fetch` to `/api/health` — **not** wget/curl (often missing in slim images)
- Rotate Postgres password away from local-dev `gyam`/`gyam` for always-on

Optional: clone private repo under `/mnt/appPool/gyam/repo` for ops/docs. Schema comes from Prisma in the image, not a `db/init` mount (Yum4Less difference).

### Custom App YAML sketch

Paste into TrueNAS Apps → Custom App → YAML. Replace password and LAN IP. Adjust pool paths only if your dataset names differ.

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: gyam-postgres
    restart: unless-stopped
    # NO ports: — unpublished on host
    environment:
      POSTGRES_USER: gyam
      POSTGRES_PASSWORD: "REPLACE_STRONG"
      POSTGRES_DB: gyam
    volumes:
      - /mnt/appPool/gyam/postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gyam -d gyam"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    image: ghcr.io/sfh1980/gyam-app:homelab   # or :<sha7> until Watchtower
    container_name: gyam-app
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "4070:4070"   # LAN-reachable; not WAN
    environment:
      NODE_ENV: production
      API_PORT: "4070"
      DATABASE_URL: postgresql://gyam:REPLACE_STRONG@db:5432/gyam
      WEB_ORIGIN: "http://REPLACE_TRUENAS_LAN_IP:4070"
      SESSION_DAYS: "30"
      COOKIE_SECURE: "false"   # LAN HTTP only
    labels:
      - "com.centurylinklabs.watchtower.enable=true"
    healthcheck:
      test:
        [
          "CMD",
          "node",
          "-e",
          "fetch('http://127.0.0.1:4070/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))",
        ]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 45s
```

### Phase A env / cookies

| Variable | Phase A value |
|----------|----------------|
| `DATABASE_URL` | `…@db:5432/gyam` (compose DNS — **not** host `5434`) |
| `WEB_ORIGIN` | `http://<truenas-lan-ip>:4070` (exact browser origin) |
| `COOKIE_SECURE` | `false` |
| `API_PORT` | `4070` |
| `SESSION_DAYS` | `30` |

Leave SMTP unset for V1 must-ship.

### Smoke check

```bash
curl -sS "http://<truenas-lan-ip>:4070/api/health"
# Browser: open same origin, login (PIN), confirm Today loads
```

### Differences vs Yum4Less (do not copy blindly)

| Topic | Yum4Less | GYAM |
|-------|----------|------|
| App shape | Next.js standalone `:3000` | Express + Vite monorepo → **one** SPA+API image `:4070` |
| Ingest sidecar | Yes (cron + Playwright) | No |
| DB bootstrap | `db/init` SQL mount | Prisma `migrate deploy` in image |
| GHCR visibility | Public packages (no PAT) | **Private** — needs pull auth |
| WAN | Tunnel planned, not live | Same — Phase B |

---

## Local / Windows Compose (dev proof)

Root `docker-compose.yml` today is **Postgres only** for laptop development:

| Item | Value |
|------|--------|
| Image | `postgres:16-alpine` |
| Container | `gyam-postgres` |
| Host port | **5434** → `5432` (avoids clashing with other local DBs) |
| User / DB | `gyam` / `gyam` |
| Volume | named `gyam_pgdata` |
| Healthcheck | `pg_isready -U gyam -d gyam` |

```bash
docker compose up -d
# then host processes: npm run dev:api / npm run dev:web
```

```env
DATABASE_URL=postgresql://gyam:gyam@localhost:5434/gyam
GYAM_DATABASE_URI=postgresql://gyam:gyam@host.docker.internal:5434/gyam
API_PORT=4070
WEB_ORIGIN=http://localhost:5173
SESSION_DAYS=30
```

| Process | Default | Notes |
|---------|---------|--------|
| API | **4070** | `GET /api/health` |
| Web (Vite) | **5173** | Dev proxy `/api` → API |
| Production app image | **4070** | Single origin (Phase A) |

**TrueNAS must not publish Postgres** the way local Compose does for convenience.

---

## Phase B — nginx + Cloudflare (deferred)

SoT long-term path: **Cloudflare → (optional nginx) → app**. Do **not** start Phase B until Phase A LAN smoke is green.

Preferred: **Cloudflare Tunnel** (no open inbound ports) pointing at the single app origin (or nginx on `:80` if you keep a shared front door). Do not tunnel Vite `:5173` or Postgres.

When HTTPS is real:

| Setting | Value |
|---------|--------|
| `WEB_ORIGIN` | Exact `https://gyam.example.com` |
| `COOKIE_SECURE` | `true` (code/env must support this) |

Optional nginx sketch (only if SPA is still static files separate from API — prefer single-origin app image first):

```nginx
# placeholders only — Phase B
server {
    listen 80;
    server_name gyam.example.com;
    root /var/www/gyam/web/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:4070;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Cookie $http_cookie;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Postgres backup

**TrueNAS Phase A** (SCALE `docker` may not support `exec -T` — omit it):

```bash
# Remove any prior 0-byte failed dump first, then:
rm -f /mnt/appPool/GYAM/gyam-*.dump   # only if empty/failed; keep good dumps
sudo docker exec gyam-postgres pg_dump -U gyam -d gyam -Fc > /mnt/appPool/GYAM/gyam-$(date +%Y%m%d).dump
ls -lh /mnt/appPool/GYAM/gyam-*.dump   # must be non-zero size
# restore:
# sudo docker exec -i gyam-postgres pg_restore -U gyam -d gyam --clean < /mnt/appPool/GYAM/gyam-YYYYMMDD.dump
```

**Local Compose:**

```bash
docker compose exec -T postgres pg_dump -U gyam -d gyam -Fc > "gyam-$(date +%Y%m%d).dump"
```

Keep dumps on the pool/NAS; rotate; never commit dumps or secrets to git.

---

## Out of scope

- Tailscale / Nextcloud as a dependency
- Publishing Postgres through Cloudflare or LAN “for convenience” on TrueNAS
- Treating Phase B as blocking V1 dogfood on LAN
- Sidecars (ingest, redis, mail) blocking core bring-up

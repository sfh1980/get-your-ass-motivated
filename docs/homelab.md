# GYAM homelab deploy

**Source of truth for hosting.** Mirror the proven **Yum4Less TrueNAS SCALE Custom App** pattern: LAN first, WAN later.

| Phase | Goal | Status |
|-------|------|--------|
| **A — LAN** | TrueNAS Custom App: Postgres + single app container; household LAN | **Done** 2026-08-02 (`http://192.168.1.246:4070`) |
| **B — WAN** | Cloudflare Tunnel → HTTPS; `COOKIE_SECURE=true` | **Parked** — Yum4Less Tunnel is live; no GYAM hostname until Sean wants LAN-only or a free subdomain of an existing domain |

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
| Datasets | **Live:** `/mnt/appPool/gyam/{postgres-data,uploads}`. **Dumps:** `/mnt/appPool/GYAM/` (separate; do not delete until inspected) |
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

**Phase A live (2026-08-02):** Custom App `gyam` on TrueNAS; image `ghcr.io/sfh1980/gyam-app:homelab`; LAN smoke green. Watchtower may update the **app image** (`watchtower.enable=true` on `app` only, never `db`). It does **not** add volumes — dataset mounts require a Custom App YAML Save.

**Uploads volume (required for job + task file attachments):** live Custom App already bind-mounts `/mnt/appPool/gyam/uploads` → `/app/data/uploads`. App runs as `USER node` (uid 1000), not Postgres 999. If attaches fail, fix permissions on that lowercase path — do not retarget YAML at `/mnt/appPool/GYAM`. JSON export stores attachment **metadata only**; binaries live on this volume. Without this bind mount, Watchtower recreates wipe files in the container overlay.

### YAML volume changes vs Watchtower (R8)

Watchtower and Custom App **Save** do different jobs. Mixing them up is how attachments disappear.

| Action | Watchtower | Custom App YAML **Save** |
|--------|------------|---------------------------|
| Pull a new `gyam-app` image | Yes (app label only) | Not required |
| Recreate the app container | Yes — **reuses existing mounts** | Yes |
| Add / remove / change a bind mount | **No** | **Yes — this is the only way** |
| Create a ZFS dataset | No | No — create the dataset in the UI/shell first |
| Change host path (`GYAM` vs `gyam`) | No | Yes, then confirm with `docker inspect` |

A **volume change** is any of: adding a mount, removing a mount, changing the host path, or changing the container path. Repo `docker/truenas/custom-app.yml` is a paste template — TrueNAS does not read the git file. After you edit the live YAML, click **Save**. Then:

```bash
sudo docker inspect gyam-app --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'
```

Expect `/mnt/appPool/gyam/uploads -> /app/data/uploads`. T8.3 (2026-08-17): app restart kept the PM PDF because this mount was already on the live YAML.

Local Windows Compose (Postgres-only + host Node) remains the **dev** path.

### Datasets & permissions (Sean on TrueNAS)

```bash
# Live app datasets (must match Custom App YAML):
sudo chown -R 999:999 /mnt/appPool/gyam/postgres-data
sudo chmod 700 /mnt/appPool/gyam/postgres-data
sudo chown -R 1000:1000 /mnt/appPool/gyam/uploads
sudo chmod 775 /mnt/appPool/gyam/uploads
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
    volumes:
      - /mnt/appPool/gyam/uploads:/app/data/uploads
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
| WAN | Tunnel live (`yum4less.com`) | GYAM Phase B **parked** (LAN-only) |

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

## Phase B — nginx + Cloudflare (parked)

SoT long-term path: **Cloudflare → (optional nginx) → app**. Phase A LAN is green. **Parked 2026-08-12:** GYAM is LAN-only; no public site. Yum4Less Tunnel no longer blocks this. Free option later (no new domain): add a hostname on the existing `yum4less.com` zone (e.g. `gyam.yum4less.com`) to the same Cloudflare Tunnel. Do not register a second domain for this.

Preferred when un-parked: **Cloudflare Tunnel** (no open inbound ports) pointing at the single app origin. Do not tunnel Vite `:5173` or Postgres.

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

## `gyam` vs `GYAM` on the pool (do not delete blindly)

ZFS is case-sensitive. Both can exist at once. **Live Custom App YAML (2026-08-14) uses lowercase `gyam`.** Uppercase `GYAM` is where the 2026-08-02 dump file sits.

| Path | Role | Safe to delete? |
|------|------|-----------------|
| `/mnt/appPool/gyam/postgres-data` | Live database (YAML `db` volume) | **No** — this is the running app |
| `/mnt/appPool/gyam/uploads` | Live attachments (YAML `app` volume) | **No** — keep; fix perms if attaches fail |
| `/mnt/appPool/GYAM/gyam-*.dump` | Backup file(s) | Keep Aug 2 (52K) and Aug 17 (120K, TOC listed). Do not delete until a newer listed dump exists |

Verify on TrueNAS Shell before touching either:

```bash
# 1. What the running containers actually mount (this is truth)
sudo docker inspect gyam-postgres --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'
sudo docker inspect gyam-app --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'

# 2. Datasets vs plain folders
sudo zfs list -o name,used,mountpoint -r appPool | grep -i gyam
ls -lah /mnt/appPool/gyam
ls -lah /mnt/appPool/GYAM

# 3. Live DB looks like Postgres (PG_VERSION present)
ls -lah /mnt/appPool/gyam/postgres-data | head

# 4. Dump is non-zero and listable (pg_restore is **inside** the Postgres container)
# Do not pipe to `pg_restore -l -` — this image errors: could not open input file "-"
ls -lh /mnt/appPool/GYAM/gyam-*.dump
sudo docker cp /mnt/appPool/GYAM/gyam-20260817.dump gyam-postgres:/tmp/gyam.dump
sudo docker exec gyam-postgres pg_restore -l /tmp/gyam.dump | head
sudo docker exec gyam-postgres rm /tmp/gyam.dump

# 5. Uploads writable by app user (uid 1000)
sudo docker exec gyam-app id
ls -lah /mnt/appPool/gyam/uploads
sudo docker exec gyam-app ls -la /app/data/uploads
```

Expect inspect to show `/mnt/appPool/gyam/postgres-data` and `/mnt/appPool/gyam/uploads`. If it does, **keep `gyam`**. Keep `GYAM` at least as the dump shelf (or copy the dump into `gyam` first). Only destroy a dataset after inspect shows nothing mounted from it and you have a second good dump.

If attaches still fail after chown 1000:1000 on `/mnt/appPool/gyam/uploads`, paste the five command outputs — do not retarget YAML at `GYAM`.

---

## Postgres backup

**TrueNAS Phase A:** `pg_dump` / `pg_restore` live **inside** `gyam-postgres`, not on the TrueNAS host (`zsh: command not found: pg_restore`). Do **not** redirect `docker exec` binary output on SCALE — it often writes a ~12-byte junk file.

```bash
# Fresh dump: write inside the container, then copy out
sudo docker exec gyam-postgres pg_dump -U gyam -d gyam -Fc -f /tmp/gyam.dump
sudo docker cp gyam-postgres:/tmp/gyam.dump /mnt/appPool/GYAM/gyam-$(date +%Y%m%d).dump
sudo docker exec gyam-postgres rm /tmp/gyam.dump
ls -lh /mnt/appPool/GYAM/gyam-*.dump   # tens of KB+ (120K proven 2026-08-17), not ~12 bytes

# List a dump (copy in; do not use `pg_restore -l -` — stdin "-" fails on this image)
sudo docker cp /mnt/appPool/GYAM/gyam-20260817.dump gyam-postgres:/tmp/gyam.dump
sudo docker exec gyam-postgres pg_restore -l /tmp/gyam.dump | head
sudo docker exec gyam-postgres rm /tmp/gyam.dump

# restore (only when you mean it — copy in, then restore from a path inside the container):
# sudo docker cp /mnt/appPool/GYAM/gyam-YYYYMMDD.dump gyam-postgres:/tmp/gyam.dump
# sudo docker exec gyam-postgres pg_restore -U gyam -d gyam --clean /tmp/gyam.dump
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

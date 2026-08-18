# 04 — RACI (Sean + agent team)

**R** = Responsible (does the work) · **A** = Accountable (one owner) · **C** = Consulted · **I** = Informed

Standing matrix (ongoing work packages):

| Work package | Sean (PM/PO) | Primary Agent | Scope Guard | Roadmap Seeder | Homelab Deploy | Activity Analyst | Specialists* |
|--------------|--------------|---------------|-------------|----------------|----------------|------------------|--------------|
| Product decisions / SoT changes | **A/R** | C | C | I | I | I | I |
| V1 feature implementation | **A** | **R** | C | I | I | I | C |
| Scope creep control | **A** | I | **R** | I | I | C | I |
| Roadmap seed / remap | **A** | C | I | **R** | I | I | I |
| Homelab / deploy docs | **A** | C | I | I | **R** | I | I |
| Next-version planning from logs | **A** | C | C | I | I | **R** | I |
| Security / quality review | **A** | I | I | I | I | I | **R** |
| Test / Playwright gate | **A** | **R** | I | I | I | I | C |
| PM docs (`docs/pm`) maintenance | **A/R** | C | C | I | I | C | I |
| In-app PM dashboard (`/pm`) | **A** | **R** | C | I | I | I | C |
| Portfolio-export captures | **A/R** | C | I | I | I | I | I |
| Release accept / Lock production | **A/R** | I | C | I | C | I | I |

\*Specialists = senior-auditor, security-review, testing-cicd-standards, web-frontend/backend-standards, database-codegen-standards, verifier as assigned.  
\*Primary Agent = default Cursor delivery agent in chat (not a named `.cursor/agents/` file).  
\*GYAM project agents: `gyam-v1-scope-guard`, `gyam-roadmap-seeder`, `gyam-homelab-deploy`, `gyam-activity-analyst`.

## Management practice (this is the “team”)

1. Sean writes the goal / acceptance (story).  
2. Assigns the right agent (or primary agent + specialist).  
3. Reviews output against SoT + DoD.  
4. Accepts, requests rework, or rejects scope.  
5. Logs issues/risks in RAID; updates status weekly.

That supervision loop is the transferable PM skill — same as directing human ICs, with clearer written briefs.

---

## Sprint 1 — who did what (closed 2026-08-03)

Epic context: **E1** follow-ons (S5 ops/portfolio) + **E2** governance. Emergent accepted scope: Python CS dual-track (P8), coach briefs, task attachments.

| Sprint 1 item / story work | Sean | Primary Agent | Scope Guard | Roadmap Seeder | Homelab Deploy | Playwright / testing | Notes |
|----------------------------|------|---------------|-------------|----------------|----------------|----------------------|-------|
| Create `docs/pm` charter → lessons pack | **A/R** | **R** (draft/edit) | C | I | I | I | Sean accepted pack |
| Update seed + roadmap markdown (GYAM = sample) | **A** | C | C | **R** | I | I | Seeder pattern + primary implement |
| Remap DB Week 1+ (`db:remap-sample`) — I1 | **A** | C | I | **R** | I | I | Script + Sean ran/accepted |
| Dogfood Today ≥5 days | **A/R** | I | I | I | I | I | **Carry** — agents cannot dogfood |
| Portfolio screenshots (8) | **A** | **R** | I | I | I | **R** (Playwright) | Capture done; PII review carry |
| Multi-purpose + progress docs (SoT §1, `00-…`) | **A/R** | **R** | C | I | I | I | Scope Guard consulted on roles |
| PII-review screenshots + metrics | **A/R** | C | I | I | I | I | **Carry → S7** |
| Sunday status/RAID refresh | **A/R** | C | I | I | I | I | Partial; formal refresh in Sprint 2 |
| Homelab Phase A (T5.5a) | **A** | C | C | I | **R** | C | Sean ops on TrueNAS; agent authored YAML/docs |
| Python CS dual-track (titles/seed/remap) | **A** | C | C | **R** | I | I | Scope Guard: no Python runtime in app |
| Coach briefs (`instructions`) | **A** | **R** | C | C | I | C | Seed/remap + UI; TrueNAS remap Sean ops |
| Task note attachments | **A** | **R** | C | I | C (uploads vol) | **R** (e2e) | Multi-file; PM allowlist |

### Sprint 1 epic / story summary

| Epic / Story | Accountable | Responsible (delivery) | Consulted |
|--------------|-------------|------------------------|-----------|
| **E1** / S5 follow-ons (notify, export, quality, Phase A, screenshots) | Sean | Primary + Homelab Deploy (T5.5a) + Playwright (T5.6a) | Scope Guard |
| **E2** governance pack + RACI + sample-project language | Sean | Primary (docs) + Roadmap Seeder (remap) | Scope Guard |
| **P8** Python CS dual-track (emergent under E2) | Sean | Roadmap Seeder (+ Primary for epic/docs) | Scope Guard |
| Coach briefs + attachments (emergent product) | Sean | Primary Agent | Scope Guard; Homelab (uploads); testing e2e |

Activity Analyst was **I** for Sprint 1 (no next-version log analysis sprint). Specialists used ad hoc via Primary (validation, Prisma, FE) rather than formal specialist invocations.

---

## Sprint 2 — planned assignments (2026-08-04 → 2026-08-10)

| Story | Sean | Primary Agent | Scope Guard | Roadmap Seeder | Homelab Deploy | Activity Analyst |
|-------|------|---------------|-------------|----------------|----------------|------------------|
| **S6** Dogfood week | **A/R** | I | I | I | I (LAN available) | I |
| **S7** Portfolio PII + metrics | **A/R** | C (draft metrics text if briefed) | I | I | I | I |
| **S8** Accept briefs/attachments on LAN | **A/R** | C (fix only) | I | I | C (uploads volume) | I |
| **S9** Python CS hygiene | **A** | C | C | **R** (names/seed if filling) | I | I |
| Status + RAID Sunday | **A/R** | C | I | I | I | C |

**Rule:** Any urge to start Phase B, SMTP, or new product features → Scope Guard **R** for the “stop/go” check; Sean **A**.

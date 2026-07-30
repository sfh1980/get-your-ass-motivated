# 04 — RACI (Sean + agent team)

**R** = Responsible (does the work) · **A** = Accountable (one owner) · **C** = Consulted · **I** = Informed

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
| Portfolio-export captures | **A/R** | C | I | I | I | I | I |
| Release accept / Lock production | **A/R** | I | C | I | C | I | I |

\*Specialists = senior-auditor, security-review, testing-cicd-standards, web-frontend/backend-standards, database-codegen-standards, verifier as assigned.

## Management practice (this is the “team”)

1. Sean writes the goal / acceptance (story).  
2. Assigns the right agent (or primary agent + specialist).  
3. Reviews output against SoT + DoD.  
4. Accepts, requests rework, or rejects scope.  
5. Logs issues/risks in RAID; updates status weekly.

That supervision loop is the transferable PM skill — same as directing human ICs, with clearer written briefs.

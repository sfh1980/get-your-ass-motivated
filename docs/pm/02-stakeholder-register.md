# 02 — Stakeholder register

| ID | Stakeholder | Role | Interest | Influence | Engagement | Notes |
|----|-------------|------|----------|-----------|------------|-------|
| S1 | Sean Holmes | Sponsor / PM / PO / end user | High | High | Manage closely | Sole decision maker; daily user |
| S2 | Hiring managers (PC / coord roles) | Future evaluators | Medium | High (career) | Keep informed | Portfolio consumers; need clear artifacts |
| S3 | LinkedIn network / mentors | Advisors | Medium | Medium | Keep informed | Networking tasks on roadmap |
| S4 | Cursor Agent (primary) | Delivery lead | High | Medium | Manage closely | Implements features under scope guard |
| S5 | gyam-v1-scope-guard | Scope / governance | High | Medium | Consult | Blocks gold-plating vs SoT |
| S6 | gyam-roadmap-seeder | Planning specialist | Medium | Low | Consult | Seed/remap roadmap |
| S7 | gyam-homelab-deploy | Infra specialist | Medium | Medium | Consult | TrueNAS Custom App, Compose, Cloudflare Phase B |
| S8 | gyam-activity-analyst | Insights / CI improvement | Medium | Low | Consult | Next-version options from logs |
| S9 | senior-auditor / security-review / testing-cicd / web-* / database standards | Specialist contributors | Medium | Low | Consult as needed | Quality, security, FE/BE/DB standards |
| S10 | verifier | Independent check | Medium | Low | Inform | Config/workflow trust |

## Power/interest notes

- **S1** is both customer and PM — risk of self-scope-creep; mitigate with SoT + scope-guard agent.  
- **S2** never sees secrets (PINs, `.env`, real emails); sanitize portfolio-export.  
- Agents have **no autonomous production deploy authority**; Sean accepts all merges/releases.
